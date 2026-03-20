import { Injectable, Logger } from '@nestjs/common';
// import { categoriesData } from '../categories/default/categoriesData';
// import { currenciesData, unitMeasurementsData } from '../dictionaries/default/dictionariesData';
// import { roles } from '../users/default/roleData';
// import { specificationsData } from '../attributes/default/specificaitonsData';
import { prisma } from './lib/prisma';
import { categoriesData } from './categories/default/categoriesData';
import { roles } from './users/default/roleData';
import {
  currenciesData,
  unitMeasurementsData,
} from './dictionaries/default/dictionariesData';
import { specificationsData } from './attributes/default/specificaitonsData';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  ping(): string {
    return 'Pong';
  }

  async seedDefaultData() {
    this.logger.log(' Начало seed дефолтных данных...');

    try {
      // Очищаем таблицы с autoincrement ID и сбрасываем счетчики
      await this.clearAndResetTables();

      // Создаем дефолтные данные из файлов
      await this.seedRoles();
      await this.seedCurrencies();
      await this.seedUnitMeasurements();
      await this.seedCategories();
      await this.seedSpecifications();

      this.logger.log(' Seed дефолтных данных завершен успешно');
      return {
        success: true,
        message: 'Дефолтные данные успешно загружены',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(' Ошибка при seed дефолтных данных:', error.message);
      throw error;
    }
  }

  private async clearAndResetTables() {
    this.logger.log('🧹 Очистка таблиц и сброс счетчиков...');

    // Сначала отключаем foreign key checks для очистки
    try {
      await prisma.$executeRawUnsafe('SET session_replication_role = replica;');
    } catch (error) {
      this.logger.warn(`⚠️ Не удалось отключить FK checks: ${error.message}`);
    }

    // Только таблицы с дефолтными данными, которые мы заполняем
    const tablesToReset = [
      'category_specifications', // Зависит от categories и specifications
      'categories',
      'currencies',
      'currency_rates',
      'unit_measurements',
      'specifications',
    ];

    // Выполняем через raw SQL для надежности
    for (const table of tablesToReset) {
      try {
        // Очищаем таблицу
        await prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);

        // Сбрасываем счетчик ID
        await prisma.$executeRawUnsafe(
          `ALTER SEQUENCE "${table}_id_seq" RESTART WITH 1`,
        );

        this.logger.log(`✅ Таблица ${table} очищена и счетчик сброшен`);
      } catch (error) {
        this.logger.warn(
          `⚠️ Ошибка при очистке таблицы ${table}: ${error.message}`,
        );
      }
    }

    // Очищаем роли (UUID таблица)
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "roles"`);
      this.logger.log(`✅ Таблица roles очищена`);
    } catch (error) {
      this.logger.warn(`⚠️ Ошибка при очистке таблицы roles: ${error.message}`);
    }

    // Включаем обратно foreign key checks
    try {
      await prisma.$executeRawUnsafe('SET session_replication_role = DEFAULT;');
    } catch (error) {
      this.logger.warn(`⚠️ Не удалось включить FK checks: ${error.message}`);
    }
  }

  private async seedRoles() {
    this.logger.log(' Создание ролей...');

    for (const roleData of roles) {
      try {
        await prisma.role.upsert({
          where: { role: roleData.role },
          update: { code: roleData.code, type: roleData.type },
          create: roleData,
        });
      } catch (error) {
        this.logger.warn(
          ` Ошибка при создании роли ${roleData.code}: ${error.message}`,
        );
      }
    }

    this.logger.log(' Роли созданы');
  }

  private async seedCurrencies() {
    this.logger.log(' Создание валют...');

    for (const currencyData of currenciesData) {
      try {
        await prisma.currency.create({
          data: currencyData,
        });
      } catch (error) {
        this.logger.warn(
          ` Ошибка при создании валюты ${currencyData.code}: ${error.message}`,
        );
      }
    }

    this.logger.log(' Валюты созданы');
  }

  private async seedUnitMeasurements() {
    this.logger.log(' Создание единиц измерения...');

    for (const unitData of unitMeasurementsData) {
      try {
        await prisma.unitMeasurement.create({
          data: unitData,
        });
      } catch (error) {
        this.logger.warn(
          ` Ошибка при создании единицы измерения: ${error.message}`,
        );
      }
    }

    this.logger.log(' Единицы измерения созданы');
  }

  private async seedCategories() {
    this.logger.log('📂 Создание категорий...');

    // Создаем глубокую копию и трансформируем данные, убирая поля ID
    const categoriesWithoutIds = JSON.parse(JSON.stringify(categoriesData)).map(
      (category: any) => {
        const { id, ...categoryWithoutId } = category;
        return {
          ...categoryWithoutId,
          subcategories: category.subcategories.map((subcategory: any) => {
            const { id: subId, ...subWithoutId } = subcategory;
            return {
              ...subWithoutId,
              subsubcategories: subcategory.subsubcategories.map(
                (subsubcategory: any) => {
                  const { id: subSubId, ...subSubWithoutId } = subsubcategory;
                  return subSubWithoutId;
                },
              ),
            };
          }),
        };
      },
    );

    // Создаем основные категории
    for (const category of categoriesWithoutIds) {
      try {
        const mainCategory = await prisma.category.create({
          data: {
            name: category.name,
            parentId: null,
          },
        });

        // Создаем подкатегории
        for (const subcategory of category.subcategories) {
          const subCategoryRecord = await prisma.category.create({
            data: {
              name: subcategory.name,
              parentId: mainCategory.id,
            },
          });

          // Создаем под-подкатегории
          for (const subsubcategory of subcategory.subsubcategories) {
            await prisma.category.create({
              data: {
                name: subsubcategory.name,
                parentId: subCategoryRecord.id,
              },
            });
          }
        }
      } catch (error) {
        this.logger.warn(
          `⚠️ Ошибка при создании категории ${category.name}: ${error.message}`,
        );
      }
    }

    this.logger.log('✅ Категории созданы');
  }

  private async seedSpecifications() {
    this.logger.log(' Создание характеристик...');

    for (const specData of specificationsData) {
      try {
        await prisma.specification.create({
          data: specData,
        });
      } catch (error) {
        this.logger.warn(
          ` Ошибка при создании характеристики: ${error.message}`,
        );
      }
    }

    this.logger.log(' Характеристики созданы');
  }
}
