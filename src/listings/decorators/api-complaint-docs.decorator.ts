import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { MakeComplaintToListing } from '../dto/request/make-complaint-to-listing.dto';

export function ApiComplaintDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Подать жалобу на объявление',
      description: 'Создает жалобу на указанное объявление',
    }),
    ApiBody({
      description: 'Данные для создания жалобы',
      type: MakeComplaintToListing
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Жалоба успешно создана',
      schema: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'ID созданной жалобы',
            example: '550e8400-e29b-41d4-a716-446655440000'
          },
          type: {
            type: 'string',
            description: 'Тип жалобы',
            example: 'SCAM'
          },
          text: {
            type: 'string',
            description: 'Текст жалобы',
            example: 'Мошенничество'
          },
          complaintType: {
            type: 'string',
            description: 'Тип объекта жалобы',
            example: 'LISTING'
          },
          authorId: {
            type: 'string',
            format: 'uuid',
            description: 'ID автора жалобы',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          listingId: {
            type: 'string',
            format: 'uuid',
            description: 'ID объявления',
            example: '123e4567-e89b-12d3-a456-426614174001'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Дата создания жалобы',
            example: '2024-01-01T00:00:00.000Z'
          }
        }
      }
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Жалоба уже существует',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 409
          },
          message: {
            type: 'string',
            example: 'Вы уже подали жалобу на это объявление'
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
