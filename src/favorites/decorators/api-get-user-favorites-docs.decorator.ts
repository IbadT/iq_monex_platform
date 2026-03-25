import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { FavoriteUserProfileResponseDto } from '../dto/response/favorite-user-profile-response.dto';

export const ApiGetUserFavoritesDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить избранные профили пользователей',
      description:
        'Возвращает список избранных профилей пользователей с полной информацией о каждом профиле',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список избранных профилей успешно получен',
      type: FavoriteUserProfileResponseDto,
      isArray: true,
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Требуется аутентификация',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Unauthorized',
          },
          error: {
            type: 'string',
            example: 'Unauthorized',
          },
          statusCode: {
            type: 'number',
            example: 401,
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
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Internal server error',
          },
          error: {
            type: 'string',
            example: 'Server Error',
          },
          statusCode: {
            type: 'number',
            example: 500,
          },
        },
      },
    }),
  );
};
