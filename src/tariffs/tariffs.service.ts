import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { AppLogger } from '@/common/logger/logger.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
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
}
