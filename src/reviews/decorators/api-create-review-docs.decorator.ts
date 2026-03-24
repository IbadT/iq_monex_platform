import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateReviewDto } from '../dto/create-review.dto';
import { CreateReviesResponseDto } from '../dto/response/create-reviews-response.dto';

export function ApiCreateReviewDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Создать отзыв к объявлению',
      description: `
Создает новый отзыв (комментарий) для опубликованного объявления.

**Правила создания отзыва:**

✅ **Требования к объявлению:**
- Объявление должно быть опубликовано (статус PUBLISHED)
- Объявление должно существовать в системе
- Только опубликованные объявления могут получать отзывы

✅ **Требования к отзыву:**
- Обязательные поля: listingId, content, rating
- Опциональные поля: title, files
- Рейтинг: от 1 до 5 звезд
- Файлы: максимум 5 файлов в формате base64

🚫 **Ограничения:**
- Нельзя оставлять отзывы на черновики, шаблоны или архивированные объявления
- Нельзя оставлять отзывы без рейтинга
- Нельзя оставлять отзывы без текста
- Максимум 5 файлов к отзыву

📝 **Процесс создания:**
1. Проверка существования опубликованного объявления
2. Валидация данных отзыва
3. Создание отзыва с привязкой к пользователю
4. Обновление счетчиков отзывов у объявления
      `,
    }),
    ApiBody({
      type: CreateReviewDto,
      description: 'Данные для создания отзыва',
      examples: {
        fullReview: {
          summary: 'Полный отзыв с файлами',
          description: 'Максимально полный отзыв со всеми полями',
          value: {
            listingId: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Отличное объявление',
            content:
              'Продавец очень вежливый, товар соответствует описанию. Рекомендую!',
            rating: 5,
            photos: [
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
            ],
          },
        },
        minimalReview: {
          summary: 'Минимальный отзыв',
          description: 'Все обязательные поля с минимальными данными',
          value: {
            listingId: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Отзыв',
            content: 'Хороший товар, доволен покупкой',
            rating: 4,
            photos: [],
          },
        },
        lowRating: {
          summary: 'Низкий рейтинг',
          description: 'Отзыв с низким рейтингом',
          value: {
            listingId: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Не понравилось',
            content: 'Товар не соответствует описанию, качество низкое',
            rating: 2,
            photos: [],
          },
        },
        withFiles: {
          summary: 'Отзыв с файлами',
          description: 'Отзыв с прикрепленными файлами-доказательствами',
          value: {
            listingId: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Фото состояния товара',
            content: 'Прикрепляю фото состояния товара',
            rating: 3,
            photos: [
              'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            ],
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Отзыв успешно создан',
      type: CreateReviesResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации данных',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Рейтинг должен быть от 1 до 5',
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
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
          statusCode: {
            type: 'number',
            example: 401,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Опубликованное объявление не найдено',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Опубликованное объявление не найдено',
            description: 'Объявление не существует или не опубликовано',
          },
          statusCode: {
            type: 'number',
            example: 404,
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Internal Server Error',
          },
          statusCode: {
            type: 'number',
            example: 500,
          },
        },
      },
    }),
  );
}
