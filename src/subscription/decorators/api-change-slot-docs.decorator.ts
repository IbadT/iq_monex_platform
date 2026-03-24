import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ChangeListingSlotDto } from '../dto/change-listing-slot.dto';
import { ChangeSlotResponseDto } from '../dto/response/change-slot-response.dto';

export function ApiChangeSlotDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Переместить объявление в другой слот',
      description:
        'Перемещает объявление из текущего слота в указанный свободный слот',
    }),
    ApiBody({
      description: 'Данные для перемещения объявления между слотами',
      type: ChangeListingSlotDto,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Объявление успешно перемещено',
      type: ChangeSlotResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Ресурс не найден',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Объявление не найдено или не принадлежит пользователю',
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуется аутентификация',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 401,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
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
