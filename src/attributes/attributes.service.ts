import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { prisma } from '@/lib/prisma';
import { Specification } from './entities/specification.entity';
import { CacheService } from '@/cache/cacheService.service';
import { AppLogger } from '@/common/logger/logger.service';
import { specificationsData } from './default/specificaitonsData';

@Injectable()
export class AttributesService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
  ) {}
  async list(lang: Language) {
    const specifications = await prisma.specification.findMany();

    return specifications.map((spec: Specification) =>
      Specification.fromPrisma(spec).toResponse(lang),
    );
  }

  async seedSpecifications() {
    try {
      this.logger.log('Начинаю сидирование specifications...');

      // Очищаем таблицу
      await prisma.specification.deleteMany();
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
