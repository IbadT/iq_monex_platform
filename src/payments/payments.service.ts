import { prisma } from '@/lib/prisma';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class PaymentsService {
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

  async processWebhook(payload: any) {
    const event = payload.event;
    const payment = payload.object;

    if (event === 'payment.succeeded') {
      console.log({ payment });
      // TODO: создать слот или обновить и добавить
    }

    if (event === 'payment.canceled') {
      console.log({ payment });
      // TODO: обработка неудачного платежа
    }
    return {
      ok: true,
    };
  }

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

      // удаляем объявления (или деактивируем)
      await prisma.userSlot.deleteMany({
        where: {
          subscription: {
            id: subscriptionId,
          },
        },
      });
    }
    return expiredPeriods;
  }

  // create(createPaymentDto: CreatePaymentDto) {
  //   return 'This action adds a new payment';
  // }

  // findAll() {
  //   return `This action returns all payments`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} payment`;
  // }

  // update(id: number, updatePaymentDto: UpdatePaymentDto) {
  //   return `This action updates a #${id} payment`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} payment`;
  // }
}
