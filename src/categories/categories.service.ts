import { Injectable, NotFoundException } from '@nestjs/common';
import { CacheService } from '@/cache/cacheService.service';
import { prisma } from '@/lib/prisma';
import {
  CategoryResponseDto,
  SubcategoryResponseDto,
  SubSubcategoryResponseDto,
} from './dto/response/categories-response.dto';
import { AppLogger } from '@/common/logger/logger.service';
import { categoriesData } from './default/categoriesData';
import { legalEntityTypes } from './default/legalEntityTypes';
import { LegalEntityType } from './entities/legal-entity-type.entity';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly cacheService: CacheService,
    private logger: AppLogger,
  ) {}

  async getLegalEntityTypes(lang: Language) {
    const cacheKey = `legal-entity-types/:${lang}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;

    const legalEntityTypes = await prisma.legalEntityType.findMany();
    const legalEntityTypesWithLang = legalEntityTypes.map((le) => {
      return LegalEntityType.fromPromise(le).toResponse(lang);
    });
    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 3600,
      value: legalEntityTypesWithLang,
    });

    return legalEntityTypesWithLang;
  }

  async addSeedLegalEntityTypes() {
    const data = legalEntityTypes.map((item) => ({
      data: item.data, // Prisma сама сериализует JSON
    }));

    return await prisma.legalEntityType.createMany({
      data: data,
    });
  }

  async categoriesList(): Promise<CategoryResponseDto[]> {
    const cacheKey = `categories`;

    // получаем из redis
    const cachedCategories =
      await this.cacheService.get<CategoryResponseDto[]>(cacheKey);
    if (cachedCategories) return cachedCategories;

    const categories = await prisma.category.findMany({
      where: {
        parent: null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (categories) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 3600,
        value: categories,
      });
    }

    return categories;
  }

  async getCategoryTreeById(id: number) {
    const cacheKey = `categories/tree/id:$${id}`;
    const cachedData = await this.cacheService.get(cacheKey);
    if (cachedData) return cachedData;
    const categoryTree = await prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!categoryTree) {
      throw new NotFoundException(`Категория с ID ${id} не найдена`);
    }

    await this.cacheService.set({
      baseKey: cacheKey,
      ttl: 900,
      value: categoryTree,
    });

    return categoryTree;
  }

  async subcategoriesList(): Promise<SubcategoryResponseDto[]> {
    const cackeKey = 'subcategories';
    const cachedData =
      await this.cacheService.get<SubcategoryResponseDto[]>(cackeKey);
    if (cachedData) return cachedData;

    const subcategories = await prisma.category.findMany({
      where: {
        parentId: { not: null },
        parent: { parentId: null },
      },
    });

    if (subcategories && subcategories.length > 0) {
      await this.cacheService.set({
        baseKey: cackeKey,
        ttl: 900,
        value: subcategories,
      });
    }

    return subcategories;
  }

  async subsubcategoriesList(): Promise<SubSubcategoryResponseDto[]> {
    const cacheKey = 'subsubcategories';
    const cachedData =
      await this.cacheService.get<SubSubcategoryResponseDto[]>(cacheKey);
    if (cachedData) return cachedData;
    const subsubcategories = await prisma.category.findMany({
      where: {
        parent: {
          parentId: { not: null },
        },
      },
    });

    if (subsubcategories && subsubcategories.length > 0) {
      await this.cacheService.set({
        baseKey: cacheKey,
        ttl: 900,
        value: subsubcategories,
      });
    }

    return subsubcategories;
  }

  async seedCategories(): Promise<string> {
    const cacheCategoriesKey = `categories`;
    try {
      this.logger.log('Начинаю сидирование категорий...');

      // Очищаем таблицу (опционально)
      await prisma.category.deleteMany();
      await this.cacheService.del(cacheCategoriesKey);
      this.logger.log('Таблица categories очищена');

      let categoryCount = 0;
      let subcategoryCount = 0;
      let subsubcategoryCount = 0;

      // Проходим по всем категориям
      for (const categoryData of categoriesData) {
        // Создаем категорию (parentId = null)
        const category = await prisma.category.create({
          data: {
            id: categoryData.id,
            name: categoryData.name,
            parentId: null,
          },
        });
        categoryCount++;
        this.logger.log(`Создана категория: ${category.name}`);

        // Проходим по подкатегориям
        for (const subcategoryData of categoryData.subcategories) {
          // Создаем подкатегорию (parentId = id категории)
          const subcategory = await prisma.category.create({
            data: {
              id: subcategoryData.id,
              name: subcategoryData.name,
              parentId: category.id,
            },
          });
          subcategoryCount++;
          this.logger.log(`  Создана подкатегория: ${subcategory.name}`);

          // Проходим по подподкатегориям
          for (const subsubcategoryData of subcategoryData.subsubcategories) {
            await prisma.category.create({
              data: {
                id: subsubcategoryData.id,
                name: subsubcategoryData.name,
                parentId: subcategory.id,
              },
            });
            subsubcategoryCount++;
          }
        }
      }

      this.logger.log('Сидирование завершено успешно');
      this.logger.log(
        `Создано: ${categoryCount} категорий, ${subcategoryCount} подкатегорий, ${subsubcategoryCount} подподкатегорий`,
      );

      return 'OK';
    } catch (error) {
      this.logger.error('Ошибка при сидировании:', error);
      throw error;
    }
  }
}
