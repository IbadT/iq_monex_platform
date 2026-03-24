import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { SubSubcategoryResponseDto } from '../dto/response/categories-response.dto';

export function ApiGetSubsubcategoriesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить подподкатегории',
      description:
        'Возвращает список всех подподкатегорий (категорий третьего уровня)',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список подподкатегорий успешно получен',
      type: SubSubcategoryResponseDto,
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
