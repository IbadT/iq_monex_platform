import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { CategoryTreeResponseDto } from '../dto/response/category-tree-response.dto';

export function ApiGetSubcategoryTreeDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить дерево подкатегории по ID',
      description:
        'Возвращает подкатегорию со всеми дочерними подподкатегориями',
    }),
    ApiParam({
      name: 'id',
      description: 'ID подкатегории',
      required: true,
      example: 2,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Дерево подкатегории успешно получено',
      type: CategoryTreeResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Подкатегория не найдена',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Подкатегория с ID {id} не найдена',
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
