import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { SubcategoryResponseDto } from '../dto/response/categories-response.dto';

export function ApiGetSubcategoriesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить подкатегории',
      description:
        'Возвращает список всех подкатегорий (категорий второго уровня)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список подкатегорий успешно получен',
      type: SubcategoryResponseDto,
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
