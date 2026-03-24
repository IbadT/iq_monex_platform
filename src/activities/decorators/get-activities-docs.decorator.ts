import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { ActivityResponseDto } from '../dto/response/activity-response.dto';

export function ApiGetActivitiesDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Получить все сферы деятельности',
      description:
        'Возвращает список всех доступных сфер деятельности из системы',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Список сфер деятельности успешно получен',
      type: ActivityResponseDto,
      isArray: true,
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
