import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Language } from './dto/request/get-currency.dto';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';
import { UnitMeasurement } from './entities/unit-measurement.entity';
import { Specification } from '@/attributes/entities/specification.entity';
import { CURRENCY_SYMBOL, VALUT_CODE } from './enums/valut-code.enum';
import {
  CurrencyDetails,
  CurrencyRateEntity,
} from './dto/response/valut-response.dto';
import { GetConvertValueFromAmountDto } from './dto/request/get-convert-valut-from-amount.dto';
import {
  currenciesData,
  unitMeasurementsData,
} from './default/dictionariesData';
import { categoryNames } from './default/categoryNames';
import { Currency } from './entities/currency.entity';

// Интерфейсы для типов данных
interface UnitMeasurementData {
  name: {
    ru: string;
    en: string;
    kz: string;
  };
}

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
    this.logger.log('Вызвана функция получения курса валют');
    const ratesData = await axios.get(
      this.configService.getOrThrow<string>('BANK_API_URL'),
    );

    const data = ratesData.data;
    this.logger.log(`Получены данные: ${JSON.stringify(data)}`);
    const ratesDate = new Date(data.Date);
    this.logger.log(`Получена дата: ${JSON.stringify(ratesDate)}`);

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

  async getMeasurementsGroups(lang: Language) {
    const cacheKey = `measurements/groups:${lang}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    // Получаем все спецификации
    const specifications = await prisma.specification.findMany();

    // Создаем структуру категорий на основе данных из dictionariesData.ts
    const categories: Record<string, string[]> = {};

    // Используем данные из dictionariesData.ts для группировки
    unitMeasurementsData.forEach((unit: UnitMeasurementData) => {
      const name = unit.name[lang] || unit.name['ru'] || unit.name.en || '';
      
      // Определяем категорию на основе позиции в массиве данных
      // Штучные (индексы 0-15)
      if (
        unitMeasurementsData.indexOf(unit) >= 0 &&
        unitMeasurementsData.indexOf(unit) <= 15
      ) {
        if (!categories['количество штук']) categories['количество штук'] = [];
        categories['количество штук'].push(name);
      }
      // Весовые (индексы 16-24)
      else if (
        unitMeasurementsData.indexOf(unit) >= 16 &&
        unitMeasurementsData.indexOf(unit) <= 24
      ) {
        if (!categories['вес']) categories['вес'] = [];
        categories['вес'].push(name);
      }
      // Объемные (индексы 25-29)
      else if (
        unitMeasurementsData.indexOf(unit) >= 25 &&
        unitMeasurementsData.indexOf(unit) <= 29
      ) {
        if (!categories['объем']) categories['объем'] = [];
        categories['объем'].push(name);
      }
      // Длина (индексы 30-36)
      else if (
        unitMeasurementsData.indexOf(unit) >= 30 &&
        unitMeasurementsData.indexOf(unit) <= 36
      ) {
        if (!categories['длина']) categories['длина'] = [];
        categories['длина'].push(name);
      }
      // Площадь (индексы 37-39)
      else if (
        unitMeasurementsData.indexOf(unit) >= 37 &&
        unitMeasurementsData.indexOf(unit) <= 39
      ) {
        if (!categories['площадь']) categories['площадь'] = [];
        categories['площадь'].push(name);
      }
      // Время (индексы 40-46)
      else if (
        unitMeasurementsData.indexOf(unit) >= 40 &&
        unitMeasurementsData.indexOf(unit) <= 46
      ) {
        if (!categories['время']) categories['время'] = [];
        categories['время'].push(name);
      }
      // Услуги (индексы 47-52)
      else if (
        unitMeasurementsData.indexOf(unit) >= 47 &&
        unitMeasurementsData.indexOf(unit) <= 52
      ) {
        if (!categories['цифровые услуги']) categories['цифровые услуги'] = [];
        categories['цифровые услуги'].push(name);
      }
      // Логистика (индексы 53-56)
      else if (
        unitMeasurementsData.indexOf(unit) >= 53 &&
        unitMeasurementsData.indexOf(unit) <= 56
      ) {
        if (!categories['транспорт']) categories['транспорт'] = [];
        categories['транспорт'].push(name);
      }
    });

    // Локализуем названия категорий
    const localizedCategories: Record<string, string[]> = {};
    Object.keys(categories).forEach(key => {
      if (categories[key].length > 0) {
        const categoryKey = key as keyof typeof categoryNames;
        const localizedCategoryName = categoryNames[categoryKey]?.[lang] || categoryNames[categoryKey]?.['ru'] || key;
        localizedCategories[localizedCategoryName] = categories[key];
      }
    });

    // Удаляем пустые категории
    Object.keys(categories).forEach((key) => {
      if (categories[key].length === 0) {
        delete categories[key];
      }
    });

    // Формируем список спецификаций
    const specificationsList = specifications.map((spec: Specification) =>
      Specification.fromPrisma(spec).toResponse(lang),
    );

    const result = {
      categories: localizedCategories,
      specifications: specificationsList.map((spec) => spec.name),
    };

    // Кэшируем результат
    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 3600,
      value: result,
    });

    return result;
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
