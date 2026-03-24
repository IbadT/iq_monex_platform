import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { UserResponseDto } from '../dto/response/user-response.dto';

export function ApiGetUserByAccountNumberDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить пользователя по номеру счета',
      description:
        'Возвращает информацию о пользователе по указанному номеру счета',
    }),
    ApiParam({
      name: 'account_number',
      description: 'Номер счета пользователя',
      required: true,
      example: '1234567890',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Пользователь успешно получен',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Пользователь не найден',
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'integer',
            example: 404,
          },
          message: {
            type: 'string',
            example: 'Пользователь не найден',
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
