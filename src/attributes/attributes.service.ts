import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { prisma } from '@/lib/prisma';
import { Specification } from './entities/specification.entity';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';
import { specificationsData } from './default/specificaitonsData';
import { SpecificationResponseDto } from './dto/response/specification.dto';
import { UserSpecificationResponseDto } from './dto/response/user-specification.dto';
import { CreateSpecificationDto } from './dto/request/createSpecification.dto';
import { CreateUserSpecificationDto } from './dto/request/create-user-specification.dto';
import { UpdateSpecificationDto } from './dto/request/updateSpecification.dto';

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  quotaFinished: boolean;
  mtLangSupported: boolean;
  responseDetails: string;
  responseStatus: number;
  responderId: string;
}

@Injectable()
export class AttributesService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}
  async list(
    lang: Language,
    userId?: string,
  ): Promise<SpecificationResponseDto[]> {
    // const cachekey = `specifications:${lang}`;

    // // получаем из redis
    // const cachedSpecifications =
    //   await this.cacheService.get<SpecificationResponseDto[]>(cachekey);
    // if (cachedSpecifications) return cachedSpecifications;

    const specifications = await prisma.specification.findMany();

    const response = specifications.map((spec) =>
      Specification.fromPrisma(spec).toResponse(lang),
    );

    // Если пользователь авторизован, добавляем его персональные характеристики
    if (userId) {
      const userSpecifications = await prisma.userSpecification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      const userSpecsResponse = userSpecifications.map(
        (spec) =>
          new SpecificationResponseDto(
            spec.id,
            (spec.name as Record<string, string>)[lang] ||
              (spec.name as Record<string, string>)['ru'] ||
              Object.values(spec.name as Record<string, string>)[0] ||
              '',
            true, // пользовательская характеристика
          ),
      );

      response.push(...userSpecsResponse);
    }

    // if (response) {
    //   await this.cacheService.set({
    //     baseKey: cachekey,
    //     ttl: 3600,
    //     value: response,
    //   });
    // }

    return response;
  }

  async createSpecification(
    body: CreateSpecificationDto,
  ): Promise<{ id: number }> {
    const translations = await this.translateToMultipleLanguages(body.name);

    // Сохраняем в БД
    return prisma.specification.create({
      data: {
        name: translations,
      }, // { ru: "...", en: "...", kk: "..." }
      select: {
        id: true,
      },
    });
  }

  async translateViaMyMemory(
    text: string,
    targetLang: string,
  ): Promise<string> {
    try {
      const url = new URL('https://api.mymemory.translated.net/get');
      url.searchParams.append('q', text);
      url.searchParams.append('langpair', `ru|${targetLang}`);

      const response = await fetch(url.toString());

      if (!response.ok) {
        this.logger.warn(
          `MyMemory API returned ${response.status}`,
          'AttributesService',
        );
        return text;
      }

      const data = (await response.json()) as MyMemoryResponse;

      // Извлекаем переведённый текст из ответа
      const translated = data.responseData?.translatedText;

      // Если перевода нет или он совпадает с оригиналом
      if (!translated || translated === text) {
        return text;
      }

      return translated;
    } catch (error) {
      this.logger.error(
        `Translation failed for "${text}" (${targetLang}): ${error instanceof Error ? error.message : 'Unknown error'}`,
        'AttributesService',
      );
      return text;
    }
  }

  async translateToMultipleLanguages(
    text: string,
  ): Promise<Record<string, string>> {
    const translations: Record<string, string> = {
      ru: text, // Для русского языка оставляем оригинальный текст
    };

    // Переводим только на другие языки
    const targetLanguages = ['en', 'kk'];

    for (const lang of targetLanguages) {
      translations[lang] = await this.translateViaMyMemory(text, lang);
      // Небольшая задержка между запросами
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    // Конвертируем kk в kz для совместимости с БД
    const result: Record<string, string> = {
      ru: translations.ru,
      en: translations.en,
      kz: translations.kk,
    };

    return result;
  }

  async updateSpecification(
    id: number,
    body: UpdateSpecificationDto,
  ): Promise<{ message: string }> {
    this.logger.log(
      `Updating specification ${id} with name: ${body.name}`,
      'AttributesService',
    );

    const spec = await prisma.specification.findUnique({
      where: { id },
    });

    if (!spec) {
      throw new Error(`Specification with id ${id} not found`);
    }

    const translations = await this.translateToMultipleLanguages(body.name);

    await prisma.specification.update({
      where: { id },
      data: {
        name: translations,
      },
    });

    // Очищаем кэш для всех языков
    const languages = ['ru', 'en', 'kz'];
    for (const lang of languages) {
      const cacheKey = `specifications:${lang}`;
      await this.cacheService.del(cacheKey);
      this.logger.log(
        `Cleared cache for key: ${cacheKey}`,
        'AttributesService',
      );
    }

    this.logger.log(
      `Successfully updated specification ${id}`,
      'AttributesService',
    );

    return { message: 'Specification updated successfully' };
  }

  async deleteSpecification(id: number): Promise<{ message: string }> {
    this.logger.log(`Deleting specification ${id}`, 'AttributesService');

    // Удаляем из БД
    const spec = await prisma.specification.findUnique({
      where: { id },
    });

    if (!spec) {
      throw new Error(`Specification with id ${id} not found`);
    }

    await prisma.specification.delete({
      where: { id },
    });

    // Очищаем кэш для всех языков
    const languages = ['ru', 'en', 'kz'];
    for (const lang of languages) {
      const cacheKey = `specifications:${lang}`;
      await this.cacheService.del(cacheKey);
      this.logger.log(
        `Cleared cache for key: ${cacheKey}`,
        'AttributesService',
      );
    }

    this.logger.log(
      `Successfully deleted specification ${id}`,
      'AttributesService',
    );

    return { message: 'Specification deleted' };
  }

  // TODO: добавить redis при создании
  async seedSpecifications() {
    // const cachekey = 'specifications';
    try {
      this.logger.log('Начинаю сидирование specifications...');

      // Очищаем таблицу
      await prisma.specification.deleteMany();
      // await this.cacheService.del(cachekey);
      this.logger.log('Таблица specifications очищена');

      // Сидирование
      const specifications = await Promise.all(
        specificationsData.map((spec) =>
          prisma.specification.create({
            data: {
              name: spec.name,
            },
          }),
        ),
      );

      this.logger.log(`Создано ${specifications.length} specifications`);

      return 'OK';
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Ошибка при сидировании specifications: ${error.message}`,
        );
      }
      throw error;
    }
  }

  // ============ USER SPECIFICATIONS (пользовательские характеристики) ============

  async listUserSpecifications(
    userId: string,
    lang: Language,
  ): Promise<UserSpecificationResponseDto[]> {
    const userSpecifications = await prisma.userSpecification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return userSpecifications.map((spec) =>
      UserSpecificationResponseDto.fromPrisma(
        spec as { id: number; name: Record<string, string> },
        lang,
      ),
    );
  }

  async createUserSpecification(
    userId: string,
    body: CreateUserSpecificationDto,
  ): Promise<{ id: number }> {
    const translations = await this.translateToMultipleLanguages(body.name);

    // Получаем максимальные ID из обеих таблиц
    const [maxSpec, maxUserSpec] = await Promise.all([
      prisma.specification.aggregate({ _max: { id: true } }),
      prisma.userSpecification.aggregate({ _max: { id: true } }),
    ]);

    const maxId = Math.max(maxSpec._max.id ?? 0, maxUserSpec._max.id ?? 0);

    const result = await prisma.userSpecification.create({
      data: {
        id: maxId + 1,
        name: translations,
        userId,
      },
      select: {
        id: true,
      },
    });

    return result;
  }

  async deleteUserSpecification(
    userId: string,
    id: number,
  ): Promise<{ id: number }> {
    const spec = await prisma.userSpecification.findFirst({
      where: { id, userId },
    });

    if (!spec) {
      throw new NotFoundException(
        `Характеристика с ID ${id} не найдена или у вас нет прав на её удаление`,
      );
    }

    // Удаляем связи с объявлениями
    await prisma.listingUserSpecification.deleteMany({
      where: { userSpecificationId: id },
    });

    // Удаляем саму характеристику
    await prisma.userSpecification.delete({
      where: { id },
    });

    return { id };
  }
}
