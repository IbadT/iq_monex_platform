import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { MakeComplaintToUserDto } from '../dto/make-complaint-to-user.dto';
import { ComplaintReasonType } from '../enums/complaint-reason-type.enum';
import { ComplaintType } from '../enums/complaint-type.enum';

export function ApiMakeComplaintToUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Подать жалобу на пользователя',
      description: 'Создает жалобу на указанного пользователя',
    }),
    ApiBody({
      description: 'Данные для создания жалобы на пользователя',
      type: MakeComplaintToUserDto
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
          complaintType: {
            type: 'string',
            description: 'Тип объекта жалобы',
            example: ComplaintType.USER,
            enum: [ComplaintType.USER, ComplaintType.LISTING]
          },
          type: {
            type: 'string',
            description: 'Тип жалобы',
            example: ComplaintReasonType.SPAM,
            enum: Object.values(ComplaintReasonType)
          },
          text: {
            type: 'string',
            description: 'Текст жалобы',
            example: 'Пользователь размещает спам'
          },
          authorId: {
            type: 'string',
            format: 'uuid',
            description: 'ID автора жалобы',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          targetUserId: {
            type: 'string',
            format: 'uuid',
            description: 'ID пользователя, на которого подана жалоба',
            example: '456e7890-f12a-34b5-c678-532614174111'
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
            example: 'Вы уже подали жалобу на этот профиль'
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
