import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateListingDto } from '../dto/request/create-listing.dto';
import { CreateListingResponseDto } from '../dto/response/create-listing-response.dto';

export function CreateListingApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать объявление',
      description: `
Создает новое объявление с валидацией полей в зависимости от статуса.

**Статусы и требования к полям:**

📝 **DRAFT** - Черновик
- Все поля опциональны кроме subcategoryId
- Можно сохранить и продолжить редактирование позже

📋 **TEMPLATE** - Шаблон  
- Все поля опциональны кроме subcategoryId
- Используется как шаблон для быстрых публикаций

🚀 **PUBLISHED** - Публикация
- Все поля обязательны: title, description, price, currencyId, priceUnitId, condition, files
- Обязательно минимум одно изображение/файл

📁 **FILES** - Файлы (документы)
- Массив base64 строк для документов
- Максимум 5 файлов
- Для публикации обязателен хотя бы один файл или фото

� **PHOTOS** - Фото (изображения)
- Массив base64 строк для изображений
- Максимум 10 фотографий
- Для публикации обязателен хотя бы один файл или фото
      `,
    }),
    ApiBody({
      type: CreateListingDto,
      description: 'Данные для создания объявления',
      examples: {
        draft: {
          summary: 'Создание черновика',
          description:
            'Все поля опциональны кроме subcategoryId и contacts. Можно заполнить частично или полностью.',
          value: {
            categoryId: 1,
            subcategoryId: 123,
            subsubcategoryId: 2,
            status: 'DRAFT',
            title: 'iPhone 13',
            description: 'Отличное состояние, использовался 6 месяцев',
            price: 85000,
            currencyId: 1,
            priceUnitId: 1,
            condition: 'USED',
            contacts: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              type: 'WORKER',
            },
            files: [
              'data:application/pdf;base64,JVBERi0xLjQKJeLjz9M=...',
              'data:text/plain;base64,SGVsbG8gV29ybGQ=',
            ],
            photos: [
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
            ],
            maps: [
              {
                type: 'OFFICE',
                latitude: 55.7558,
                longitude: 37.6173,
                address: 'г. Алматы, ул. Абая 123',
                country: 'Казахстан',
                city: 'Алматы',
              },
            ],
            specifications: [
              { specificationId: 1, value: 'Белый', isCustom: false },
              { specificationId: 2, value: '128 ГБ', isCustom: false },
              { specificationId: 3, value: 'iPhone 13', isCustom: false },
              { specificationId: 4, value: 'Отличное', isCustom: false },
              { specificationId: 5, value: '6 месяцев использования', isCustom: false },
            ],
          },
        },
        draftMinimal: {
          summary: 'Минимальный черновик',
          description: 'Только обязательные поля subcategoryId и contacts',
          value: {
            categoryId: 1,
            subcategoryId: 123,
            subsubcategoryId: 2,
            status: 'DRAFT',
            contacts: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              type: 'USER',
            },
          },
        },
        template: {
          summary: 'Создание шаблона',
          description:
            'Шаблон для быстрых публикаций. Все поля опциональны кроме contacts.',
          value: {
            categoryId: 1,
            subcategoryId: 123,
            subsubcategoryId: 2,
            status: 'TEMPLATE',
            title: 'Шаблон электроники',
            description: 'Шаблон для продажи электроники',
            price: 50000,
            currencyId: 1,
            priceUnitId: 1,
            condition: 'USED',
            contacts: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              type: 'WORKER',
            },
            files: ['data:application/pdf;base64,JVBERi0xLjQKJeLjz9M=...'],
            photos: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'],
          },
        },
        published: {
          summary: 'Публикация объявления',
          description:
            'Все поля обязательны для публикации (title, description, price, currencyId, priceUnitId, condition, files, photos, maps, specifications минимум 5 шт)',
          value: {
            categoryId: 1,
            subcategoryId: 123,
            subsubcategoryId: 2,
            status: 'PUBLISHED',
            title: 'iPhone 13 Pro Max',
            description: 'Отличное состояние, использовался 6 месяцев',
            price: 85000,
            currencyId: 1,
            priceUnitId: 1,
            condition: 'USED',
            files: [
              'data:application/pdf;base64,JVBERi0xLjQKJeLjz9M=...',
              'data:text/plain;base64,SGVsbG8gV29ybGQ=',
            ],
            photos: [
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
            ],
            maps: [
              {
                type: 'OFFICE',
                latitude: 55.7558,
                longitude: 37.6173,
                address: 'г. Алматы, ул. Абая 123',
                country: 'Казахстан',
                city: 'Алматы',
              },
            ],
            specifications: [
              { specificationId: 1, value: 'Белый', isCustom: false },
              { specificationId: 2, value: '256 ГБ', isCustom: false },
              { specificationId: 3, value: 'iPhone 13 Pro Max', isCustom: false },
              { specificationId: 4, value: 'Отличное состояние', isCustom: false },
              { specificationId: 5, value: '6 месяцев использования', isCustom: false },
              { specificationId: 6, value: 'Оригинальная коробка', isCustom: false },
            ],
            contacts: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              type: 'USER',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Объявление успешно создано',
      type: CreateListingResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации данных',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'title is required for status: PUBLISHED',
            description: 'Описание ошибки валидации',
          },
          error: {
            type: 'string',
            example: 'Bad Request',
          },
          statusCode: {
            type: 'number',
            example: 400,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Пользователь не авторизован',
    }),
    ApiResponse({
      status: 403,
      description: 'Доступ запрещен',
    }),
  );
}
