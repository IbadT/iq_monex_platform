import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { MakeComplaintToUserDto } from '../dto/make-complaint-to-user.dto';
import { ComplaintResponseDto } from '../dto/response/complaint-response.dto';

export function ApiMakeComplaintToUserDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Подать жалобу на пользователя',
      description: 'Создает жалобу на указанного пользователя',
    }),
    ApiBody({
      description: 'Данные для создания жалобы на пользователя',
      type: MakeComplaintToUserDto,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Жалоба успешно создана',
      type: ComplaintResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'Жалоба уже существует',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 409,
          },
          message: {
            type: 'string',
            example: 'Вы уже подали жалобу на этот профиль',
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
