import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

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
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'ID категории',
            example: 1,
          },
          name: {
            type: 'string',
            description: 'Название категории',
            example: 'Электроника',
          },
          parentId: {
            type: 'integer',
            description: 'ID родителя',
            example: 1,
          },
          children: {
            type: 'array',
            description: 'Массив дочерних категорий',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'integer',
                  description: 'ID подкатегории',
                  example: 2,
                },
                name: {
                  type: 'string',
                  description: 'Название подкатегории',
                  example: 'Телефоны',
                },
                parentId: {
                  type: 'integer',
                  description: 'ID родителя',
                  example: 1,
                },
                children: {
                  type: 'array',
                  description: 'Массив подподкатегорий',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        description: 'ID подподкатегории',
                        example: 3,
                      },
                      name: {
                        type: 'string',
                        description: 'Название подподкатегории',
                        example: 'Смартфоны',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
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
