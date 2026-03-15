import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '@/cache/cacheService.service';
import { prisma } from '@/lib/prisma';
import { Currency } from './entities/currency.entity';
import {
  currenciesData,
  unitMeasurementsData,
} from './default/dictionariesData';
import { AppLogger } from '@/common/logger/logger.service';
import { Language } from './dto/request/get-currency.dto';
import { UnitMeasurement } from './entities/unit-measurement.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CURRENCY_SYMBOL, VALUT_CODE } from './enums/valut-code.enum';
import {
  CurrencyDetails,
  CurrencyRateEntity,
} from './dto/response/valut-response.dto';
import { GetConvertValueFromAmountDto } from './dto/request/get-convert-valut-from-amount.dto';

@Injectable()
export class DictionariesService {
  private readonly trackedCurrencies = new Set<VALUT_CODE>([
    VALUT_CODE.USD,
    VALUT_CODE.EUR,
    VALUT_CODE.CNY,
    VALUT_CODE.KZT,
    VALUT_CODE.BYN,
  ]);

  constructor(
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}

  async getCategoryRates() {
    const valuts: CurrencyRateEntity[] = await prisma.currencyRate.findMany();
    if (valuts.length === 0) {
      throw new NotFoundException('Нет данных о курсах валют');
    }
    return valuts;
  }

  async convertValutFromAmount(body: GetConvertValueFromAmountDto) {
    // 1. Получаем все курсы валют (они уже должны быть в БД)
    const allRates = await this.getCategoryRates();

    // 2. Находим курс переданной валюты
    const fromRate = allRates.find((r) => r.code === body.code);

    // 3. Проверяем, что нашли (TypeScript требует)
    if (!fromRate) {
      throw new Error(`Валюта ${body.code} не найдена`);
    }

    // 4. Считаем сколько это в рублях
    const amountInRub =
      (body.amount * Number(fromRate.rate)) / fromRate.nominal;

    // Результат теперь содержит и значение и символ
    const result: Record<string, { value: number; symbol: string }> = {};

    allRates.forEach((rate) => {
      const code = rate.code as VALUT_CODE;
      result[code] = {
        value: Number(
          ((amountInRub * rate.nominal) / Number(rate.rate)).toFixed(2),
        ),
        symbol: CURRENCY_SYMBOL[code] || code, // если символа нет, показываем код
      };
    });

    return result;

    // return {
    // from: {
    //   code: body.code,
    //   amount: body.amount,
    //   symbol: CURRENCY_SYMBOL[body.code as VALUT_CODE] || body.code,
    // },
    // converted: result,
    // date: allRates[0]?.date,
    // }
  }

  async categoryRates() {
    const ratesData = await axios.get(
      this.configService.getOrThrow<string>('BANK_API_URL'),
    );

    const data = ratesData.data;
    const ratesDate = new Date(data.Date);

    // 1. Удаляем все записи за эту дату
    await prisma.currencyRate.deleteMany({
      where: {
        date: ratesDate,
      },
    });

    // 2. Подготавливаем новые данные
    const ratesToSave = [
      { code: VALUT_CODE.RUB, nominal: 1, rate: 1, date: ratesDate },
    ];

    Object.entries(data.Valute).forEach(
      ([code, details]: [VALUT_CODE, CurrencyDetails]) => {
        if (this.trackedCurrencies.has(code)) {
          ratesToSave.push({
            code: code,
            nominal: details.Nominal,
            rate: details.Value,
            date: ratesDate,
          });
        }
      },
    );

    // 3. Сохраняем новые
    const result = await prisma.currencyRate.createMany({
      data: ratesToSave,
    });

    this.logger.log(
      `Перезаписано ${result.count} курсов за ${ratesDate.toDateString()}`,
    );
    return ratesToSave;
  }

  async currenciesList(lang: Language) {
    this.logger.log(`Currencies language: ${lang}`);
    const cacheKey = `currencies:${lang}`;

    const cachedCurrencies = await this.cacheService.get(cacheKey);
    if (cachedCurrencies) return cachedCurrencies;

    const currencies = await prisma.currency.findMany();

    const result = currencies.map((currencies: Currency) =>
      Currency.fromPrisma(currencies).toResponse(lang),
    );

    if (result) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: result,
      });
    }

    return result;
  }

  async unitMeasurements(lang: Language) {
    const cacheKey = `unit-measurements:${lang}`;
    const cacheData = await this.cacheService.get(cacheKey);
    if (cacheData) return cacheData;

    const unitMeasurements = await prisma.unitMeasurement.findMany();

    const result = unitMeasurements.map((unit: UnitMeasurement) =>
      UnitMeasurement.fromPrisma(unit).toResponse(lang),
    );

    if (result && result.length > 0) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: result,
      });
    }

    return result;
  }

  async seedDictionariesData() {
    try {
      const cacheKeyCurrencies = 'currencies';
      const cacheKeyUnit = 'unit-measurements';
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

      await this.cacheService.set({
        baseKey: cacheKeyCurrencies,
        ttl: 900,
        value: currencies,
      });

      await this.cacheService.set({
        baseKey: cacheKeyUnit,
        ttl: 900,
        value: units,
      });

      this.logger.log(`Создано ${units.length} единиц измерения`);

      return 'OK';
    } catch (error) {
      this.logger.error('Ошибка при сидировании:', error);
      throw error;
    }
  }
}
