import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';
import { SubscriptionService } from '@/subscription/subscription.service';
import { YookassaService, ConfirmationEnum } from 'nestjs-yookassa';
import { CreatePaymentDto, PaymentType } from './dto/create-payment.dto';
import { CreateDonationDto } from './dto/create-donation.dto';
import { PAYMENT_ITEM_TYPE, PAYMENT_STATUS } from './enums/payment-status.enum';
import { TariffsService } from '@/tariffs/tariffs.service';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from 'prisma/generated/client';
import { prisma } from '@/lib/prisma';
import { convertCurrencyToYookassa } from '@/common/utils/currency.util';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly subscriptionService: SubscriptionService,
    private readonly yooKassaService: YookassaService,
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
    private readonly tariffsService: TariffsService,
  ) {}

  async createPayment(userId: string, body: CreatePaymentDto) {
    const cacheKey = `payment:${userId}:${Date.now()}`;

    // Получаем данные тарифа
    const tariff = await this.tariffsService.getTariffById(body.tariffId);

    const tariffData = tariff;
    let amount = Number(tariffData.price);
    const daysCount = tariffData.baseDays;
    const currency = tariffData.currencyCode;
    const currencyCode = tariffData.currencyCode;

    // Проверяем скидку 50% для EXTEND_BASE_SUBSCRIPTION
    let discountApplied = false;
    let discountPercent = 0;
    if (body.paymentType === PaymentType.EXTEND_BASE_SUBSCRIPTION) {
      const participant = await prisma.promoCampaignParticipant.findFirst({
        where: {
          userId,
          freePeriodGranted: true,
          discountUsed: false,
          droppedOut: false,
        },
        include: { campaign: true },
      });

      if (participant && participant.campaign) {
        // Проверяем что скидка доступна (дата начала скидочного периода)
        const now = new Date();
        if (
          participant.discountAvailableAt &&
          now >= participant.discountAvailableAt
        ) {
          discountPercent = participant.campaign.subsequentDiscount; // 50%
          amount = amount * (1 - discountPercent / 100); // Применяем скидку
          discountApplied = true;
          this.logger.log(
            `Applied ${discountPercent}% discount for user ${userId}, new amount: ${amount}`,
          );
        }
      }
    }

    this.logger.log(
      `Create payment for user ${userId}: type=${body.paymentType}, tariff=${body.tariffId}, amount=${amount}, days=${daysCount}`,
    );

    // Валидация в зависимости от типа платежа
    if (
      body.paymentType === PaymentType.EXTEND_PACKAGES &&
      !body.packageIds?.length
    ) {
      throw new BadRequestException(
        'Для продления пакетов необходимо указать packageIds',
      );
    }

    if (
      body.paymentType === PaymentType.EXTEND_BASE_SUBSCRIPTION ||
      body.paymentType === PaymentType.EXTEND_PACKAGES
    ) {
      const subscription =
        await this.subscriptionService.getUserSubscription(userId);
      this.logger.debug(`Есть ли подписка у пользователя: ${subscription}`);

      if (!subscription) {
        throw new BadRequestException('Сначала оформите базовую подписку');
      }
    }

    // if (body.paymentType === PaymentType.EXTEND_PACKAGES || body.paymentType === PaymentType.BUY_ADDITIONAL_PACKAGE) {
    if (body.paymentType === PaymentType.BUY_ADDITIONAL_PACKAGE) {
      // Проверяем, что у пользователя не более 4 активных пакетов
      const subscription =
        await this.subscriptionService.getUserSubscription(userId);
      this.logger.debug(`Есть ли подписка у пользователя: ${subscription}`);

      if (!subscription) {
        throw new BadRequestException('Сначала оформите базовую подписку');
      }

      const packages = await this.subscriptionService.getUserPackages(userId);
      this.logger.debug(`Колличество пакетов ${packages.length}`);
      if (packages.length > 4) {
        throw new BadRequestException(
          'У пользователя достигнуто максимальное количество пакетов',
        );
      }
    }

    if (body.paymentType === PaymentType.BUY_BASE_SUBSCRIPTION) {
      const subscription =
        await this.subscriptionService.getUserSubscription(userId);
      this.logger.debug(`Подписка: ${subscription}`);
      if (subscription) {
        throw new BadRequestException('У пользователя уже создана подписка');
      }
    }

    try {
      const paymentId = uuidv4();

      // Сохраняем данные в Redis для webhook
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900, // 15 минут
        value: {
          userId,
          paymentType: body.paymentType,
          tariffId: body.tariffId,
          packageIds: body.packageIds,
          amount,
          currency,
          daysCount,
          paymentId,
          discountApplied,
          discountPercent,
        },
      });

      // Создаем платеж в YooKassa
      const payment = await this.yooKassaService.payments.create({
        amount: {
          value: amount,
          currency: convertCurrencyToYookassa(currency),
        },
        capture: true,
        confirmation: {
          type: ConfirmationEnum.REDIRECT,
          return_url: 'https://your-site.com/payment-success',
        },
        description: this.getPaymentDescription(
          body.paymentType,
          body.packageIds?.length,
        ),
        metadata: {
          userId,
          paymentType: body.paymentType,
          packageIds: body.packageIds?.join(',') || '',
          daysCount: daysCount.toString(),
          cacheKey, // Для быстрого доступа к данным в webhook
          type: 'payment',
        },
      });

      // Создаем запись в таблице Payment
      await prisma.payment.create({
        data: {
          id: paymentId,
          userId,
          amount: amount,
          currency: currencyCode,
          status: PAYMENT_STATUS.PENDING,
          externalId: payment.id,
          provider: 'yookassa',
          description: this.getPaymentDescription(
            body.paymentType,
            body.packageIds?.length,
          ),
          metadata: {
            paymentType: body.paymentType,
            packageIds: body.packageIds,
            daysCount: daysCount,
            paymentId,
            cacheKey,
          },
        },
      });

      let confirmationUrl = null;
      if (payment.confirmation && 'confirmation_url' in payment.confirmation) {
        confirmationUrl = payment.confirmation.confirmation_url;
      }

      // TODO: убрать после проверки
      // Имитация успешного webhook для тестирования
      const simulatedWebhook = {
        event: 'payment.succeeded',
        object: {
          id: payment.id,
          status: 'succeeded',
          amount: {
            value: amount.toString(),
            currency: currency,
          },
          metadata: {
            userId,
            paymentType: body.paymentType,
            packageIds: body.packageIds?.join(',') || '',
            daysCount: daysCount.toString(),
            cacheKey,
            type: 'payment',
            paymentId,
          },
        },
      };

      // Вызываем обработчик webhook как будто пришел от YooKassa
      await this.processWebhook(simulatedWebhook);
      // TODO: убрать после проверки

      return {
        id: payment.id,
        status: payment.status,
        confirmationUrl,
        amount: amount,
        currency: currency,
      };
    } catch (error) {
      this.logger.error(`Create payment error: ${error.message}`);
      throw new ServiceUnavailableException('Ошибка создания платежа');
    }
  }

  //
  //
  //

  private getPaymentDescription(
    paymentType: PaymentType,
    packageCount?: number,
  ): string {
    switch (paymentType) {
      case PaymentType.EXTEND_PACKAGES:
        return `Продление ${packageCount} пакетов на 100 дней`;
      case PaymentType.EXTEND_BASE_SUBSCRIPTION:
        return 'Продление базовой подписки на 30 дней';
      case PaymentType.BUY_ADDITIONAL_PACKAGE:
        return 'Покупка дополнительного пакета (100 слотов) на 30 дней';
      case PaymentType.BUY_BASE_SUBSCRIPTION:
        return 'Покупка базовой подписки (100 слотов) на 30 дней';
      case PaymentType.DONATION:
        return 'Пожертвование';
      default:
        return 'Платеж';
    }
  }

  async paymentList(limit: number, offset: number) {
    const cacheKey = 'payments';
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const payments = await prisma.payment.findMany({
      take: limit,
      skip: offset,
    });

    if (payments && payments.length > 0) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: payments,
      });
    }

    return payments;
  }

  async donationList(limit: number, offset: number) {
    const cacheKey = 'donations';
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    this.logger.log('Cache donations is empty');
    const donations = await prisma.donation.findMany({
      take: limit,
      skip: offset,
    });

    this.logger.log(`Got ${donations.length} donations`);

    if (donations && donations.length > 0) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: donations,
      });
    }

    return donations;
  }

  async tariffList(userId: string) {
    this.logger.log(`Got tariff list by user id: ${userId}`);
    return await prisma.tariff.findMany();
  }

  async subscriptionList(userId: string) {
    return await prisma.subscription.findMany({
      where: {
        userId,
      },
    });
  }

  async subscriptionPeriodList(userId: string) {
    this.logger.log(`Got subscription period list by user id: ${userId}`);
    return await prisma.subscriptionPeriod.findMany();
  }

  async paymentItemList(userId: string) {
    this.logger.log(`Got payment item list by user id: ${userId}`);
    return await prisma.paymentItem.findMany();
  }

  async slotPackageList(userId: string) {
    return await prisma.slotPackage.findMany({
      where: {
        userId,
      },
    });
  }

  async userSlotList(userId: string) {
    return await prisma.userSlot.findMany({
      where: {
        userId,
      },
    });
  }

  async listingSlotList(userId: string) {
    this.logger.log(`Got listing slot list by user id: ${userId}`);
    return await prisma.listingSlot.findMany();
  }

  validateYookassaAuth(auth: string) {
    const expected =
      'Basic ' +
      Buffer.from(
        `${process.env.YK_SHOP_ID}:${process.env.YK_SECRET_KEY}`,
      ).toString('base64');

    if (auth !== expected) {
      throw new UnauthorizedException('Invalid YooKassa signature');
    }
  }

  //

  async processWebhook(payload: any) {
    const event = payload.event;
    const payment = payload.object;

    this.logger.log(`Processing webhook: ${event} for payment ${payment.id}`);

    if (event === 'payment.succeeded') {
      console.log({ payment });

      // Проверяем тип платежа через metadata
      if (payment.metadata?.type === 'donation') {
        await this.handleSuccessfulDonation(payment);
      } else {
        // Обработка успешной оплаты
        await this.handleSuccessfulPayment(payment);

        this.logger.log(
          `Payment ${payment.id} succeeded - processing subscription/package`,
        );
      }
    }

    if (event === 'payment.canceled') {
      console.log({ payment });

      // Проверяем тип платежа через metadata
      if (payment.metadata?.type === 'donation') {
        await this.handleCanceledDonation(payment);
      } else {
        // Обработка отмены оплаты
        await this.handleCanceledPayment(payment);

        this.logger.log(
          `Payment ${payment.id} canceled - processing subscription/package`,
        );
      }
    }

    return {
      ok: true,
    };
  }

  private async handleSuccessfulDonation(payment: any) {
    const donationId = payment.metadata.donationId;
    const paymentId = payment.id;

    this.logger.log(
      `[handleSuccessfulDonation] Processing for donation: ${donationId}, paymentId: ${paymentId}`,
    );

    try {
      await prisma.$transaction(async (tx: PrismaClient) => {
        // Обновляем статус доната как успешный
        const donation = await tx.donation.update({
          where: { id: donationId },
          data: {
            // status: 'COMPLETED',
            status: PAYMENT_STATUS.COMPLETED,
          },
        });

        // Создаем запись в PaymentItem для доната
        await tx.paymentItem.create({
          data: {
            paymentId: paymentId,
            itemType: 'DONATION',
            itemId: donationId,
            quantity: 1,
            unitPrice: donation.amount,
            description: `Донат на развитие проекта`,
          },
        });

        this.logger.log(
          `Donation ${donationId} payment succeeded - PaymentItem created`,
        );

        // TODO: отправить уведомление пользователю
        // Здесь можно добавить дополнительную логику внутри транзакции:
        // - Обновить баланс пользователя
        // - Начислить бонусы
        // - Обновить статистику
      });
    } catch (error) {
      this.logger.error(
        `Error processing successful donation ${donationId}: ${error.message}`,
      );
    }
  }

  private async handleCanceledDonation(payment: any) {
    const donationId = payment.metadata.donationId;

    try {
      // Обновляем статус доната как отмененный
      await prisma.donation.update({
        where: { id: donationId },
        data: {
          // status: 'CANCELED',
          status: PAYMENT_STATUS.CANCELED,
        },
      });

      this.logger.log(
        `Donation ${donationId} payment canceled - status updated`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing canceled donation ${donationId}: ${error.message}`,
      );
    }
  }

  private async handleSuccessfulPayment(payment: any) {
    const paymentType = payment.metadata?.paymentType;
    const cacheKey = payment.metadata?.cacheKey;
    const paymentId = payment.metadata?.paymentId;

    try {
      // Получаем данные из Redis или metadata
      let paymentData;
      if (cacheKey) {
        paymentData = await this.cacheService.get(cacheKey);
      }

      if (!paymentData) {
        // Fallback на metadata если Redis недоступен
        paymentData = {
          userId: payment.metadata.userId,
          paymentType: payment.metadata.paymentType,
          packageIds: payment.metadata.packageIds?.split(',') || [],
          daysCount: parseInt(payment.metadata.daysCount),
          amount: parseFloat(payment.amount.value),
          currency: payment.amount.currency,
          paymentId: paymentId, // Используем ID из metadata
        };
      }

      await prisma.$transaction(async (tx: PrismaClient) => {
        // Обновляем статус платежа
        await tx.payment.updateMany({
          where: { externalId: payment.id },
          data: { status: PAYMENT_STATUS.COMPLETED },
        });

        // Создаем объект платежа с правильным id
        const paymentWithId = { ...payment, id: paymentId };

        switch (paymentType) {
          case PaymentType.EXTEND_PACKAGES:
            await this.handleExtendPackages(tx, paymentData, paymentWithId);
            break;
          case PaymentType.EXTEND_BASE_SUBSCRIPTION:
            await this.handleExtendBaseSubscription(
              tx,
              paymentData,
              paymentWithId,
            );
            break;
          case PaymentType.BUY_ADDITIONAL_PACKAGE:
            await this.handleBuyAdditionalPackage(
              tx,
              paymentData,
              paymentWithId,
            );
            break;
          case PaymentType.BUY_BASE_SUBSCRIPTION:
            await this.handleBuyBaseSubscription(
              tx,
              paymentData,
              paymentWithId,
            );
            break;
        }

        // Redis очистится автоматически по TTL
      });

      this.logger.log(
        `Payment ${payment.id} succeeded - processed ${paymentType}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing successful payment ${payment.id}: ${error.message}`,
      );
    }
  }

  private async handleBuyBaseSubscription(
    tx: PrismaClient,
    paymentData: any,
    payment: any,
  ) {
    // TODO: использовать только один из paymentData, payment
    const { userId, daysCount, paymentId } = paymentData;
    // const userId = payment.metadata.userId;
    // const daysCount = parseInt(payment.metadata.daysCount);
    // const paymentId = payment.metadata.paymentId;

    this.logger.log(
      `[handleBuyBaseSubscription] Processing for user: ${userId}, days: ${daysCount}, dbPaymentId: ${payment.id}`,
    );

    // Проверяем что подписки нет (доп проверка)
    const existingSubscription = await tx.subscription.findFirst({
      where: { userId },
    });

    if (existingSubscription) {
      throw new BadRequestException('У пользователя уже есть подписка');
    }

    // Находим базовый тариф
    const baseTariff = await tx.tariff.findFirst({
      where: { code: 'BASE' },
    });

    if (!baseTariff) {
      this.logger.error(`[handleBuyBaseSubscription] BASE tariff not found!`);
      throw new Error('Базовый тариф не найден');
    }

    // Создаем новую подписку
    const now = new Date();
    const endAt = new Date(now);
    endAt.setDate(endAt.getDate() + daysCount);

    const newSubscription = await tx.subscription.create({
      data: {
        userId,
        tariffId: baseTariff.id,
        totalSlots: baseTariff.baseSlots,
      },
    });

    // Создаем период подписки
    await tx.subscriptionPeriod.create({
      data: {
        subscriptionId: newSubscription.id,
        days: daysCount,
        startAt: now,
        endAt: endAt,
        paymentId: paymentId,
      },
    });

    // Создаем слоты для базовой подписки
    // Находим максимальный индекс существующих слотов
    // const maxSlot = await tx.userSlot.findFirst({
    //   where: { userId },
    //   orderBy: { slotIndex: 'desc' },
    // });

    // const startSlotIndex = maxSlot ? maxSlot.slotIndex + 1 : 1;

    const slots = [];
    for (let i = 1; i <= baseTariff.baseSlots; i++) {
      slots.push({
        userId,
        // slotIndex: startSlotIndex + i,
        slotIndex: i,
        // sourceType: 'SUBSCRIPTION' as const,
        sourceType: PAYMENT_ITEM_TYPE.SUBSCRIPTION as const,
        sourceId: newSubscription.id,
        subscriptionId: newSubscription.id, // Прямая связь для быстрых запросов
        expiresAt: endAt,
      });
    }

    await tx.userSlot.createMany({ data: slots });

    this.logger.log(
      `[handleBuyBaseSubscription] Created ${baseTariff.baseSlots} slots for subscription`,
    );

    this.logger.log(
      `[handleBuyBaseSubscription] Created new subscription with period successfully`,
    );
  }

  private async handleExtendPackages(
    tx: PrismaClient,
    paymentData: any,
    payment: any,
  ) {
    const { userId, packageIds, daysCount, paymentId } = paymentData;

    this.logger.log(
      `[handleExtendPackages] Processing for user: ${userId}, packages: ${packageIds.join(',')}, days: ${daysCount}, dbPaymentId: ${paymentId}, paymentId: ${payment.id}`,
    );

    // Продлеваем указанные пакеты
    for (const packageId of packageIds) {
      // ??? TODO: Promise.all ???
      const slotPackage = await tx.slotPackage.findUnique({
        where: { id: packageId, userId },
      });

      if (slotPackage) {
        const newExpiresAt = new Date(slotPackage.expiresAt);
        newExpiresAt.setDate(newExpiresAt.getDate() + daysCount);

        await tx.slotPackage.update({
          where: { id: packageId },
          data: {
            expiresAt: newExpiresAt,
            paymentId: paymentId,
          },
        });

        // Создаем PaymentItem
        await tx.paymentItem.create({
          data: {
            paymentId: paymentId,
            // itemType: 'SLOT_PACKAGE',
            itemType: PAYMENT_ITEM_TYPE.SLOT_PACKAGE,
            itemId: packageId, // TODO: проверить - это ли значение нужно?
            quantity: 1,
            unitPrice: paymentData.amount / packageIds.length,
            description: `Продление пакета на ${daysCount} дней`,
          },
        });
      }
    }
  }

  private async handleExtendBaseSubscription(
    tx: PrismaClient,
    paymentData: any,
    payment: any,
  ) {
    const { userId, daysCount, paymentId } = paymentData;

    this.logger.log(
      `[handleExtendBaseSubscription] Processing for user: ${userId}, days: ${daysCount}, dbPaymentId: ${paymentId}, paymentId: ${payment.id}`,
    );

    try {
      // Находим активную базовую подписку
      this.logger.log(
        `[handleExtendBaseSubscription] Looking for active BASE subscription for user: ${userId}`,
      );

      const subscription = await tx.subscription.findFirst({
        where: {
          userId,
          isActive: true,
          tariff: { code: 'BASE' },
        },
        include: { periods: true },
      });

      this.logger.log(
        `[handleExtendBaseSubscription] Found subscription:`,
        subscription ? 'YES' : 'NO',
      );

      if (subscription) {
        this.logger.log(
          `[handleExtendBaseSubscription] Extending existing subscription: ${subscription.id}`,
        );

        // Создаем новый период
        const now = new Date();
        const lastPeriod =
          subscription.periods[subscription.periods.length - 1];
        const startAt = lastPeriod?.endAt > now ? lastPeriod.endAt : now;
        const endAt = new Date(startAt);
        endAt.setDate(endAt.getDate() + daysCount);

        this.logger.log(
          `[handleExtendBaseSubscription] Creating period from ${startAt} to ${endAt}`,
        );

        await tx.subscriptionPeriod.create({
          data: {
            subscriptionId: subscription.id,
            days: daysCount,
            startAt,
            endAt,
            paymentId: paymentId,
          },
        });

        // Создаем PaymentItem
        await tx.paymentItem.create({
          data: {
            paymentId: paymentId,
            // itemType: 'SUBSCRIPTION',
            itemType: PAYMENT_ITEM_TYPE.SUBSCRIPTION,
            itemId: subscription.id,
            quantity: 1,
            unitPrice: paymentData.amount,
            description: `Продление базовой подписки на ${daysCount} дней${paymentData.discountApplied ? ` (со скидкой ${paymentData.discountPercent}%)` : ''}`,
          },
        });

        // Если была применена скидка - активируем скидочный период и отмечаем скидку как использованную
        if (paymentData.discountApplied) {
          this.logger.log(
            `[handleExtendBaseSubscription] Activating discount period for user ${userId}`,
          );

          // Находим скидочный период (DISCOUNTED) без paymentId и обновляем его
          const discountedPeriod = await tx.subscriptionPeriod.findFirst({
            where: {
              subscriptionId: subscription.id,
              periodType: 'DISCOUNTED',
              paymentId: null, // Ещё не оплачен
            },
          });

          if (discountedPeriod) {
            await tx.subscriptionPeriod.update({
              where: { id: discountedPeriod.id },
              data: { paymentId: paymentId },
            });
            this.logger.log(
              `[handleExtendBaseSubscription] Discount period ${discountedPeriod.id} activated with payment ${paymentId}`,
            );
          }

          // Отмечаем скидку как использованную
          await tx.promoCampaignParticipant.updateMany({
            where: {
              userId,
              discountUsed: false,
              freePeriodGranted: true,
            },
            data: { discountUsed: true },
          });

          this.logger.log(
            `[handleExtendBaseSubscription] Discount marked as used for user ${userId}`,
          );
        }

        // Обновляем expiresAt существующих слотов или создаем новые
        const existingSlots = await tx.userSlot.findMany({
          where: {
            userId,
            // sourceType: 'SUBSCRIPTION',
            sourceType: PAYMENT_ITEM_TYPE.SUBSCRIPTION,
            sourceId: subscription.id,
          },
        });

        if (existingSlots.length > 0) {
          // Обновляем существующие слоты
          await tx.userSlot.updateMany({
            where: {
              userId,
              // sourceType: 'SUBSCRIPTION',
              sourceType: PAYMENT_ITEM_TYPE.SUBSCRIPTION,
              sourceId: subscription.id,
              subscriptionId: subscription.id,
            },
            data: {
              expiresAt: endAt,
            },
          });
        } else {
          // Создаем новые слоты если их нет
          // Находим максимальный индекс существующих слотов
          const maxSlot = await tx.userSlot.findFirst({
            where: { userId },
            orderBy: { slotIndex: 'desc' },
          });

          const startSlotIndex = maxSlot ? maxSlot.slotIndex + 1 : 1;

          const slots = [];
          for (let i = 0; i < subscription.totalSlots; i++) {
            slots.push({
              userId,
              slotIndex: startSlotIndex + i,
              // sourceType: 'SUBSCRIPTION' as const,
              sourceType: PAYMENT_ITEM_TYPE.SUBSCRIPTION as const,
              sourceId: subscription.id,
              subscriptionId: subscription.id, // Добавляем прямую связь
              expiresAt: endAt,
            });
          }
          await tx.userSlot.createMany({ data: slots });
        }

        this.logger.log(
          `[handleExtendBaseSubscription] Extended existing subscription with slots successfully`,
        );
      } else {
        this.logger.error(
          `[handleExtendBaseSubscription] No existing subscription found for EXTEND_BASE_SUBSCRIPTION`,
        );
        throw new Error('Подписка для продления не найдена');
      }
    } catch (error) {
      this.logger.error(
        `[handleExtendBaseSubscription] Error: ${error.message}`,
      );
      throw error;
    }
  }

  private async handleBuyAdditionalPackage(
    tx: PrismaClient,
    paymentData: any,
    payment: any,
  ) {
    const { userId, daysCount, paymentId } = paymentData;

    this.logger.log(
      `[handleBuyAdditionalPackage] Processing for user: ${userId}, days: ${daysCount}, dbPaymentId: ${paymentId}, paymentId: ${payment.id}`,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysCount);

    // TODO: уточнить, как будут отображаться слоты
    // Находим максимальный индекс слота пользователя
    const maxSlot = await tx.userSlot.findFirst({
      where: { userId },
      orderBy: { slotIndex: 'desc' },
    });

    const startSlotIndex = maxSlot ? maxSlot.slotIndex + 1 : 1;

    const newPackage = await tx.slotPackage.create({
      data: {
        userId,
        slots: 100, // Фиксировано 100 слотов
        price: paymentData.amount,
        expiresAt,
        isActive: true,
        paymentId: paymentId,
      },
    });

    this.logger.debug(`СОЗДАННЫЙ ПАКЕТ С ID: ${newPackage.id}`);

    // Создаем слоты для пакета
    const slots = [];
    for (let i = 0; i < 100; i++) {
      slots.push({
        userId,
        slotIndex: startSlotIndex + i,
        // sourceType: 'SLOT_PACKAGE' as const,
        sourceType: PAYMENT_ITEM_TYPE.SLOT_PACKAGE as const,
        sourceId: newPackage.id,
        slotPackageId: newPackage.id, // Добавляем прямую связь
        expiresAt,
      });
    }

    await tx.userSlot.createMany({ data: slots });

    // Создаем PaymentItem
    await tx.paymentItem.create({
      data: {
        paymentId: paymentId,
        // itemType: 'SLOT_PACKAGE',
        itemType: PAYMENT_ITEM_TYPE.SLOT_PACKAGE,
        itemId: newPackage.id,
        quantity: 100,
        unitPrice: paymentData.amount / 100,
        description: `Покупка пакета (100 слотов) на ${daysCount} дней`,
      },
    });
  }

  private async handleCanceledPayment(payment: any) {
    // TODO: логика для отмененных платежей подписок/пакетов
    this.logger.log(`Payment ${payment.id} canceled`);
  }

  //

  async handleCronExpired() {
    const now = new Date();
    // получаем дату 60 дней назад
    const nowMinus60days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const expiredPeriods = await prisma.subscriptionPeriod.findMany({
      where: {
        endAt: {
          lt: nowMinus60days, // endAt < (сейчас - 60 дней)
        },
        subscription: {
          // TODO: возможно нужно будет брать все, а не только активные
          isActive: true, // берем только активные подписки
        },
      },
      include: {
        subscription: true,
      },
    });

    for (const period of expiredPeriods) {
      const subscriptionId = period.subscriptionId;

      // деактивируем подписку
      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { isActive: false },
      });

      // Находим все listingSlot для слотов этой подписки
      const listingSlots = await prisma.listingSlot.findMany({
        where: {
          userSlot: {
            subscriptionId: subscriptionId,
          },
          releasedAt: null, // Только активные привязки
        },
      });

      // Освобождаем все объявления
      if (listingSlots.length > 0) {
        await prisma.listingSlot.updateMany({
          where: {
            id: { in: listingSlots.map((ls: any) => ls.id) },
          },
          data: {
            releasedAt: new Date(),
            releaseReason: 'SUBSCRIPTION_EXPIRED',
          },
        });
      }

      // удаляем слоты подписки
      await prisma.userSlot.deleteMany({
        where: {
          subscriptionId: subscriptionId,
        },
      });
    }

    return expiredPeriods;
  }

  async createDonation(userId: string, body: CreateDonationDto) {
    this.logger.log(
      `Create donation for user ${userId}: amount=${body.amount}, currency=${body.currency}`,
    );

    try {
      const result = await prisma.$transaction(async (tx: PrismaClient) => {
        // Создаем запись о донате в БД (пока без paymentId)
        const donation = await tx.donation.create({
          data: {
            userId,
            amount: body.amount,
            currency: body.currency,
          },
        });

        // Создаем платеж в YooKassa
        const payment = await this.yooKassaService.payments.create({
          amount: {
            value: body.amount,
            currency: convertCurrencyToYookassa(body.currency),
          },
          capture: true,
          confirmation: {
            type: ConfirmationEnum.REDIRECT,
            return_url: 'https://your-site.com/donation-success',
          },
          description: 'Донат на развитие проекта',
          metadata: {
            userId,
            donationId: donation.id,
            type: 'donation',
          },
        });

        // Обновляем запись доната с paymentId
        await tx.donation.update({
          where: { id: donation.id },
          data: { paymentId: payment.id },
        });

        return {
          donationId: donation.id,
          paymentId: payment.id,
          confirmationUrl: payment.confirmation,
          amount: body.amount,
          currency: body.currency || 'RUB',
        };
      });

      return result;
    } catch (error) {
      this.logger.error(`Error creating donation: ${error.message}`);
      throw new ServiceUnavailableException('Ошибка создания доната');
    }
  }
}
