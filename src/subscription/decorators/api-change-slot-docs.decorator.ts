import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ChangeListingSlotDto } from '../dto/change-listing-slot.dto';

export function ApiChangeSlotDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Переместить объявление в другой слот',
      description: 'Перемещает объявление из текущего слота в указанный свободный слот',
    }),
    ApiBody({
      description: 'Данные для перемещения объявления между слотами',
      type: ChangeListingSlotDto
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Объявление успешно перемещено',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Статус операции',
            example: 'Объявление успешно перемещено'
          },
          fromSlotId: {
            type: 'string',
            format: 'uuid',
            description: 'ID исходного слота',
            example: '456e7890-f12a-34b5-c678-532614174111'
          },
          toSlotId: {
            type: 'string',
            format: 'uuid',
            description: 'ID целевого слота',
            example: '789e0123-g45b-67c8-d901-642514174222'
          },
          listingId: {
            type: 'string',
            format: 'uuid',
            description: 'ID перемещенного объявления',
            example: '123e4567-e89b-12d3-a456-426614174000'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Ресурс не найден',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404
          },
          message: {
            type: 'string',
            example: 'Объявление не найдено или не принадлежит пользователю'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуется аутентификация',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 401
          },
          message: {
            type: 'string',
            example: 'Unauthorized'
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
