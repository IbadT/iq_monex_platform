import { Injectable, Logger } from '@nestjs/common';
import { prisma } from './lib/prisma';
import { categoriesData } from './categories/default/categoriesData';
import { roles } from './users/default/roleData';
import {
  currenciesData,
  unitMeasurementsData,
} from './dictionaries/default/dictionariesData';
import { specificationsData } from './attributes/default/specificaitonsData';
import { tariffData } from './tariffs/default/tariffData';
import { S3Service } from './s3/s3.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly s3Service: S3Service) {}

  ping(): string {
    return 'Pong';
  }

  async userSuggestions(limit: number, offset: number) {
    return await prisma.userSuggestion.findMany({
      take: limit,
      skip: offset,
    });
  }

  async createUserSuggestion(text: string) {
    return await prisma.userSuggestion.create({
      data: { text }
    })
  }

  async getBannerByKey(key: string): Promise<{ key: string; url: string } | null> {
    try {
      // Проверяем существует ли такой файл в S3
      const imageKeys = await this.s3Service.listObjects();
      const exists = imageKeys.includes(key);
      
      if (!exists) {
        this.logger.warn(`Banner not found: ${key}`);
        return null;
      }

      // Формируем URL для баннера
      const url = `${this.s3Service.customEndpoint}/${key}`;
      this.logger.log(`Found banner: ${key}`);
      
      return { key, url };
    } catch (error) {
      this.logger.error(`Failed to get banner: ${key}`, error);
      return null;
    }
  }

  async getImages() {
    try {
      const imageKeys = await this.s3Service.listObjects();
      this.logger.log(`Found ${imageKeys.length} images in S3`);
      
      // Формируем полные URL для изображений
      const images = imageKeys.map(key => ({
        key,
        url: `${this.s3Service.customEndpoint}/${key}`,
      }));
      
      return images;
    } catch (error) {
      this.logger.error('Failed to get images from S3', error);
      return [];
    }
  }

  async deleteImage(key: string): Promise<boolean> {
    try {
      const success = await this.s3Service.deleteObject(key);
      if (success) {
        this.logger.log(`Successfully deleted image: ${key}`);
      }
      return success;
    } catch (error) {
      this.logger.error(`Failed to delete image: ${key}`, error);
      return false;
    }
  }

  async deleteAllImages(): Promise<{ success: number; failed: number }> {
    try {
      const result = await this.s3Service.deleteAllObjects();
      this.logger.log(`Delete all images completed: ${result.success} success, ${result.failed} failed`);
      return result;
    } catch (error) {
      this.logger.error('Failed to delete all images', error);
      return { success: 0, failed: 1 };
    }
  }

  async uploadImage(file: Buffer, fileName: string, contentType: string): Promise<{ key: string; url: string } | null> {
    try {
      // Генерируем уникальный ключ для файла
      const timestamp = Date.now();
      const extension = fileName.split('.').pop() || 'jpg';
      const key = `images/${timestamp}.${extension}`;

      // Загружаем в S3
      const url = await this.s3Service.upload(file, key, contentType);
      
      if (url) {
        this.logger.log(`Successfully uploaded image: ${key}`);
        return { key, url };
      }
      
      return null;
    } catch (error) {
      this.logger.error('Failed to upload image', error);
      return null;
    }
  }

  async seedDefaultData() {
    this.logger.log(' Начало seed дефолтных данных...');

    try {
      const results = {
        roles: { created: 0, updated: 0, errors: 0 },
        currencies: { created: 0, updated: 0, errors: 0 },
        unitMeasurements: { created: 0, updated: 0, errors: 0 },
        categories: { created: 0, updated: 0, errors: 0 },
        specifications: { created: 0, updated: 0, errors: 0 },
        tariffs: { created: 0, updated: 0, errors: 0 },
      };

      // Создаем дефолтные данные без очистки
      await this.seedRoles(results);
      await this.seedCurrencies(results);
      await this.seedUnitMeasurements(results);
      await this.seedCategories(results);
      await this.seedSpecifications(results);
      await this.seedTariffs(results);

      this.logger.log(' Seed дефолтных данных завершен успешно');
      
      const totalCreated = Object.values(results).reduce((sum, item) => sum + item.created, 0);
      const totalUpdated = Object.values(results).reduce((sum, item) => sum + item.updated, 0);
      const totalErrors = Object.values(results).reduce((sum, item) => sum + item.errors, 0);

      return {
        success: true,
        message: 'Дефолтные данные успешно загружены',
        timestamp: new Date().toISOString(),
        results,
        summary: {
          totalCreated,
          totalUpdated,
          totalErrors,
        },
      };
    } catch (error) {
      this.logger.error(' Ошибка при seed дефолтных данных:', error.message);
      throw error;
    }
  }

  private async seedRoles(results: any) {
    this.logger.log(' Создание/обновление ролей...');

    for (const roleData of roles) {
      try {
        await prisma.role.upsert({
          where: { role: roleData.role },
          update: { code: roleData.code, type: roleData.type },
          create: roleData,
        });
        
        const existing = await prisma.role.findUnique({ where: { role: roleData.role } });
        if (existing) {
          results.roles.updated++;
        } else {
          results.roles.created++;
        }
      } catch (error) {
        this.logger.warn(` Ошибка при создании роли ${roleData.code}: ${error.message}`);
        results.roles.errors++;
      }
    }

    this.logger.log(` Роли обработано: создано ${results.roles.created}, обновлено ${results.roles.updated}, ошибок ${results.roles.errors}`);
  }

  private async seedCurrencies(results: any) {
    this.logger.log(' Создание/обновление валют...');

    for (const currencyData of currenciesData) {
      try {
        await prisma.currency.upsert({
          where: { code: currencyData.code },
          update: currencyData,
          create: currencyData,
        });
        
        const existing = await prisma.currency.findUnique({ where: { code: currencyData.code } });
        if (existing) {
          results.currencies.updated++;
        } else {
          results.currencies.created++;
        }
      } catch (error) {
        this.logger.warn(` Ошибка при создании валюты ${currencyData.code}: ${error.message}`);
        results.currencies.errors++;
      }
    }

    this.logger.log(` Валюты обработано: создано ${results.currencies.created}, обновлено ${results.currencies.updated}, ошибок ${results.currencies.errors}`);
  }

  private async seedUnitMeasurements(results: any) {
    this.logger.log(' Создание/обновление единиц измерения...');

    for (const unitData of unitMeasurementsData) {
      try {
        // Проверяем существует ли такая единица измерения по русскому имени
        const existing = await prisma.unitMeasurement.findFirst({
          where: { 
            name: {
              path: ['ru'],
              equals: unitData.name.ru
            }
          },
        });

        if (existing) {
          // Обновляем существующую
          await prisma.unitMeasurement.update({
            where: { id: existing.id },
            data: unitData,
          });
          results.unitMeasurements.updated++;
        } else {
          // Создаем новую
          await prisma.unitMeasurement.create({
            data: unitData,
          });
          results.unitMeasurements.created++;
        }
      } catch (error) {
        this.logger.warn(` Ошибка при создании единицы измерения: ${error.message}`);
        results.unitMeasurements.errors++;
      }
    }

    this.logger.log(` Единицы измерения обработано: создано ${results.unitMeasurements.created}, обновлено ${results.unitMeasurements.updated}, ошибок ${results.unitMeasurements.errors}`);
  }

  private async seedCategories(results: any) {
    this.logger.log('📂 Создание/обновление категорий...');

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
        // Проверяем существует ли основная категория
        const existingMain = await prisma.category.findFirst({
          where: { 
            name: category.name,
            parentId: null 
          },
        });

        let mainCategory: any;
        if (existingMain) {
          // Обновляем существующую
          mainCategory = await prisma.category.update({
            where: { id: existingMain.id },
            data: {
              name: category.name,
              parentId: null,
            },
          });
          results.categories.updated++;
        } else {
          // Создаем новую
          mainCategory = await prisma.category.create({
            data: {
              name: category.name,
              parentId: null,
            },
          });
          results.categories.created++;
        }

        // Создаем подкатегории
        for (const subcategory of category.subcategories) {
          const existingSub = await prisma.category.findFirst({
            where: { 
              name: subcategory.name,
              parentId: mainCategory.id 
            },
          });

          let subCategoryRecord: any;
          if (existingSub) {
            // Обновляем существующую
            subCategoryRecord = await prisma.category.update({
              where: { id: existingSub.id },
              data: {
                name: subcategory.name,
                parentId: mainCategory.id,
              },
            });
            results.categories.updated++;
          } else {
            // Создаем новую
            subCategoryRecord = await prisma.category.create({
              data: {
                name: subcategory.name,
                parentId: mainCategory.id,
              },
            });
            results.categories.created++;
          }

          // Создаем под-подкатегории
          for (const subsubcategory of subcategory.subsubcategories) {
            const existingSubSub = await prisma.category.findFirst({
              where: { 
                name: subsubcategory.name,
                parentId: subCategoryRecord.id 
              },
            });

            if (existingSubSub) {
              // Обновляем существующую
              await prisma.category.update({
                where: { id: existingSubSub.id },
                data: {
                  name: subsubcategory.name,
                  parentId: subCategoryRecord.id,
                },
              });
              results.categories.updated++;
            } else {
              // Создаем новую
              await prisma.category.create({
                data: {
                  name: subsubcategory.name,
                  parentId: subCategoryRecord.id,
                },
              });
              results.categories.created++;
            }
          }
        }
      } catch (error) {
        this.logger.warn(`⚠️ Ошибка при создании категории ${category.name}: ${error.message}`);
        results.categories.errors++;
      }
    }

    this.logger.log(`✅ Категории обработано: создано ${results.categories.created}, обновлено ${results.categories.updated}, ошибок ${results.categories.errors}`);
  }

  private async seedSpecifications(results: any) {
    this.logger.log(' Создание/обновление характеристик...');

    for (const specData of specificationsData) {
      try {
        // Проверяем существует ли такая характеристика по русскому имени
        const existing = await prisma.specification.findFirst({
          where: { 
            name: {
              path: ['ru'],
              equals: specData.name.ru
            }
          },
        });

        if (existing) {
          // Обновляем существующую
          await prisma.specification.update({
            where: { id: existing.id },
            data: specData,
          });
          results.specifications.updated++;
        } else {
          // Создаем новую
          await prisma.specification.create({
            data: specData,
          });
          results.specifications.created++;
        }
      } catch (error) {
        this.logger.warn(` Ошибка при создании характеристики: ${error.message}`);
        results.specifications.errors++;
      }
    }

    this.logger.log(` Характеристики обработано: создано ${results.specifications.created}, обновлено ${results.specifications.updated}, ошибок ${results.specifications.errors}`);
  }

  private async seedTariffs(results: any) {
    this.logger.log(' Создание/обновление тарифов...');

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
          results.tariffs.updated++;
        } else {
          // Создаем новый
          await prisma.tariff.create({
            data: {
              ...tariff,
              code: tariff.code as any,
            },
          });
          results.tariffs.created++;
        }
      } catch (error) {
        this.logger.warn(` Ошибка при создании тарифа ${tariff.code}: ${error.message}`);
        results.tariffs.errors++;
      }
    }

    this.logger.log(` Тарифы обработано: создано ${results.tariffs.created}, обновлено ${results.tariffs.updated}, ошибок ${results.tariffs.errors}`);
  }
}
