import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CategoryResponseDto } from '../dto/response/categories-response.dto';

export function CategoriesApiDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить категории',
      description:
        'Возвращает список всех категорий (категорий первого уровня)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список категорий успешно получен',
      type: CategoryResponseDto,
      isArray: true,
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 500,
          },
          message: {
            type: 'string',
            example: 'Internal server error',
          },
        },
      },
    }),
  );
}
