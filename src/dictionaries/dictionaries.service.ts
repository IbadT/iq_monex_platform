import { Injectable } from '@nestjs/common';
import { CreateDictionaryDto } from './dto/create-dictionary.dto';
import { UpdateDictionaryDto } from './dto/update-dictionary.dto';
import { CacheService } from '@/cache/cacheService.service';
import { prisma } from '@/lib/prisma';
import { CurrenciesResponseDto } from './dto/response/currencies-response.dto';
import { Currency } from './entities/currency.entity';
import {
  currenciesData,
  unitMeasurementsData,
} from './default/dictionariesData';
import { AppLogger } from '@/common/logger/logger.service';
import { Language } from './dto/request/get-currency.dto';
import { UnitMeasurement } from './entities/unit-measurement.entity';

@Injectable()
export class DictionariesService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}

  async currenciesList(lang: Language) {
    const currencies = await prisma.currency.findMany();

    return currencies.map((currencies: Currency) =>
      Currency.fromPrisma(currencies).toResponse(lang),
    );
  }

  async unitMeasurements(lang: Language) {
    const unitMeasurements = await prisma.unitMeasurement.findMany();

    return unitMeasurements.map((unit: UnitMeasurement) =>
      UnitMeasurement.fromPrisma(unit).toResponse(lang),
    );
  }

  async seedDictionariesData() {
    try {
      this.logger.log('Начинаю сидирование валют и единиц измерения...');

      // Очищаем таблицы
      await prisma.currency.deleteMany();
      await prisma.unitMeasurement.deleteMany();
      this.logger.log('Таблицы очищены');

      // Сидирование валют
      const currencies = await Promise.all(
        currenciesData.map((currency) =>
          prisma.currency.create({
            data: {
              symbol: currency.symbol,
              code: currency.code,
              name: currency.name,
            },
          }),
        ),
      );
      this.logger.log(`Создано ${currencies.length} валют`);

      // Сидирование единиц измерения
      const units = await Promise.all(
        unitMeasurementsData.map((unit) =>
          prisma.unitMeasurement.create({
            data: {
              name: unit.name,
            },
          }),
        ),
      );
      this.logger.log(`Создано ${units.length} единиц измерения`);

      return 'OK';
    } catch (error) {
      this.logger.error('Ошибка при сидировании:', error);
      throw error;
    }
  }
}
