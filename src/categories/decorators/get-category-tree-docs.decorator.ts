import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CategoryTreeResponseDto } from '../dto/response/category-tree-response.dto';

export function ApiGetCategoryTreeDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить дерево категорий по ID',
      description:
        'Возвращает категорию со всеми дочерними элементами (подкатегориями и подподкатегориями)',
    }),
    ApiParam({
      name: 'id',
      description: 'ID категории',
      required: true,
      example: 1,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Дерево категорий успешно получено',
      type: CategoryTreeResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Категория не найдена',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Категория с ID {id} не найдена',
          },
        },
      },
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
