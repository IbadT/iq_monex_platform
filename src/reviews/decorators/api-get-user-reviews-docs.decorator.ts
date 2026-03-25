import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GetReviewsDto } from '../dto/response/get-reviews.dto';

export const ApiGetUserReviewsDocs = () => {
  return applyDecorators(
    ApiTags('Reviews'),
    ApiOperation({
      summary: 'Получить отзывы пользователя',
      description: 'Возвращает список отзывов пользователя с пагинацией',
    }),

    ApiParam({
      name: 'id',
      description: 'UUID пользователя',
      type: 'string',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),

    ApiQuery({
      name: 'limit',
      description: 'Лимит количества отзывов на странице',
      type: 'number',
      required: false,
      example: 10,
    }),

    ApiQuery({
      name: 'offset',
      description: 'Смещение для пагинации',
      type: 'number',
      required: false,
      example: 0,
    }),

    ApiExtraModels(GetReviewsDto),
    
    ApiResponse({
      status: 200,
      description: 'Список отзывов пользователя',
      schema: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GetReviewsDto',
        },
      },
    }),

    ApiResponse({
      status: 401,
      description: 'Пользователь не авторизован',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
        },
      },
    }),

    ApiResponse({
      status: 404,
      description: 'Пользователь не найден',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'User not found' },
          error: { type: 'string', example: 'Not Found' },
          statusCode: { type: 'number', example: 404 },
        },
      },
    }),

    ApiResponse({
      status: 500,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Internal Server Error' },
          error: { type: 'string', example: 'Internal Server Error' },
          statusCode: { type: 'number', example: 500 },
        },
      },
    }),
  );
};
