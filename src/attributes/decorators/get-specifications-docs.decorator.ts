import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';

export function ApiGetSpecificationsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить спецификации',
      description: 'Возвращает список спецификаций для объявлений с поддержкой языков',
    }),
    ApiQuery({
      name: 'lang',
      enum: Language,
      required: false,
      description: 'Язык ответа (ru, en, kz)',
      example: Language.RU
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список спецификаций успешно получен',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Уникальный идентификатор спецификации',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Название спецификации на выбранном языке',
              example: 'Состояние'
            }
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 500
          },
          message: {
            type: 'string',
            example: 'Internal server error'
          }
        }
      }
    })
  );
}
