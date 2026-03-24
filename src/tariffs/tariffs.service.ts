import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { AppLogger } from '@/common/logger/logger.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { tariffData } from './default/tariffData';
import { TariffResponseDto } from './dto/response/tariff-response.dto';
import { TariffMapper } from './mappers/tariff.mapper';

@Injectable()
export class TariffsService {
  constructor(private readonly logger: AppLogger) {}

  async getAllTariffs(): Promise<TariffResponseDto[]> {
    this.logger.log('Получение всех тарифов');

    const tariffs = await prisma.tariff.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return TariffMapper.toResponseList(tariffs);
  }

  async getTariffById(id: string): Promise<TariffResponseDto> {
    this.logger.log(`Получение тарифа по ID: ${id}`);

    const tariff = await prisma.tariff.findUnique({
      where: { id },
    });

    if (!tariff) {
      throw new NotFoundException('Тариф не найден');
    }
    // return tariff;
    return TariffMapper.toResponse(tariff);
    // return {
    //   success: true,
    //   data: tariff,
    // };
  }

  async createTariff(body: CreateTariffDto) {
    this.logger.log(`Создание нового тарифа: ${body.code}`);

    // Проверяем существует ли тариф с таким кодом
    const existingTariff = await prisma.tariff.findFirst({
      where: { code: body.code as any },
    });

    if (existingTariff) {
      throw new ConflictException('Тариф с таким кодом уже существует');
    }

    const tariff = await prisma.tariff.create({
      data: {
        ...body,
        code: body.code as any,
      },
    });

    this.logger.log(`Тариф создан: ${tariff.id}`);

    return tariff;
  }

  async updateTariff(id: string, body: UpdateTariffDto) {
    this.logger.log(`Обновление тарифа: ${id}`);

    // Проверяем существует ли тариф
    const existingTariff = await prisma.tariff.findUnique({
      where: { id },
    });

    if (!existingTariff) {
      throw new NotFoundException('Тариф не найден');
    }

    // Если обновляем код, проверяем что он не занят другим тарифом
    if (body.code) {
      const tariffWithSameCode = await prisma.tariff.findFirst({
        where: {
          code: body.code as any,
          id: { not: id },
        },
      });

      if (tariffWithSameCode) {
        throw new ConflictException('Тариф с таким кодом уже существует');
      }
    }

    const tariff = await prisma.tariff.update({
      where: { id },
      data: {
        ...body,
        ...(body.code && { code: body.code as any }),
      },
    });

    this.logger.log(`Тариф обновлен: ${tariff.id}`);

    return tariff;
  }

  async seedTariffsFromData() {
    this.logger.log('Создание тарифов из дефолтных данных...');

    const results = [];
    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const tariff of tariffData) {
      try {
        // Проверяем существует ли тариф с таким кодом
        const existingTariff = await prisma.tariff.findFirst({
          where: { code: tariff.code as any },
        });

        if (existingTariff) {
          // Обновляем существующий
          await prisma.tariff.update({
            where: { id: existingTariff.id },
            data: {
              name: tariff.name,
              description: tariff.description,
              baseSlots: tariff.baseSlots,
              baseDays: tariff.baseDays,
              maxTotalDays: tariff.maxTotalDays,
              isExtendable: tariff.isExtendable,
              price: tariff.price,
              currencyCode: tariff.currencyCode,
              isActive: tariff.isActive,
            },
          });

          results.push({
            code: tariff.code,
            action: 'updated',
            id: existingTariff.id,
          });
          updated++;
        } else {
          // Создаем новый
          const newTariff = await prisma.tariff.create({
            data: {
              ...tariff,
              code: tariff.code as any,
            },
          });

          results.push({
            code: tariff.code,
            action: 'created',
            id: newTariff.id,
          });
          created++;
        }
      } catch (error) {
        this.logger.error(
          `Ошибка при создании тарифа ${tariff.code}: ${error.message}`,
        );
        results.push({
          code: tariff.code,
          action: 'error',
          error: error.message,
        });
        errors++;
      }
    }

    this.logger.log(
      `Seed тарифов завершен: создано ${created}, обновлено ${updated}, ошибок ${errors}`,
    );

    return {
      message: 'Обработка тарифов завершена',
      data: {
        created,
        updated,
        errors,
        total: tariffData.length,
        results,
      },
    };
  }
}
