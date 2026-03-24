import { Injectable } from '@nestjs/common';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { prisma } from '@/lib/prisma';
import { Specification } from './entities/specification.entity';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';
import { specificationsData } from './default/specificaitonsData';
import { SpecificationResponseDto } from './dto/response/specification.dto';

@Injectable()
export class AttributesService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}
  async list(lang: Language): Promise<SpecificationResponseDto[]> {
    const cachekey = `specifications:${lang}`;

    // получаем из redis
    const cachedSpecifications =
      await this.cacheService.get<SpecificationResponseDto[]>(cachekey);
    if (cachedSpecifications) return cachedSpecifications;

    const specifications = await prisma.specification.findMany();

    const response = specifications.map((spec: Specification) =>
      Specification.fromPrisma(spec).toResponse(lang),
    );

    if (response) {
      await this.cacheService.set({
        baseKey: cachekey,
        ttl: 3600,
        value: response,
      });
    }

    return response;
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
      this.logger.error('Ошибка при сидировании specifications:', error);
      throw error;
    }
  }
}
