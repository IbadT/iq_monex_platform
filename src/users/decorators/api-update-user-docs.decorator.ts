import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/response/user-response.dto';

/**
 * Декоратор для документации эндпоинта обновления профиля пользователя
 * Используйте этот декоратор для метода, который обновляет данные пользователя
 */
export const ApiUpdateUserDocs = () =>
  applyDecorators(
    ApiTags('Users'),
    ApiOperation({
      summary: 'Обновить профиль пользователя',
      description: `
        Обновляет профиль пользователя с возможностью добавления/редактирования:
        - Основных данных (имя)
        - Профиля (юридическое лицо, валюта, контакты)
        - Сфер деятельности (активностей)
        - Сотрудников
        - Фотографий и файлов
        - Локаций на карте

        **Важные моменты по полям профиля:**
        - Все поля профиля (avatar, companyPhone, companyEmail, telegram, siteUrl, description) обязательны
        - Для обновления поля передайте новое значение
        - Для сохранения текущего значения передайте текущее значение

        **Логика работы с активностями:**
        - \`action: 'CREATE'\` - создать новую активность (требуется \`activity\`)
        - \`action: 'UPDATE'\` - обновить существующую активность (требуется \`id\`)
        - \`action: 'DELETE'\` - удалить связь пользователя с активностью (требуется \`id\`)
        - \`action: 'IGNORE'\` - пропустить обработку

        **Логика работы с сотрудниками:**
        - \`action: 'CREATE'\` - создать нового сотрудника (не требует \`id\`)
        - \`action: 'UPDATE'\` - обновить существующего сотрудника (требуется \`id\`)
        - \`action: 'DELETE'\` - удалить сотрудника (требуется \`id\`)
        - \`action: 'ACTIVITY'\` - инвертировать статус \`isActive\` сотрудника (требуется \`id\`)
        - \`action: 'IGNORE'\` - пропустить обработку

        **Логика работы с локациями:**
        - \`action: 'CREATE'\` - создать новую локацию (не требует \`id\`)
        - \`action: 'UPDATE'\` - обновить существующую локацию (требуется \`id\`)
        - \`action: 'DELETE'\` - удалить локацию (требуется \`id\`)
        - \`action: 'IGNORE'\` - пропустить обработку

        **Пример запроса:**
        \`\`\`json
        {
          "avatar": "data:image/png;base64,iVBORw0KGgoAAAANS...",
          "legalEntityId": 1,
          "name": "Иванов Иван Иванович",
          "currencyId": 1,
          "activities": [
            {"id": 1, "action": "UPDATE"},
            {"activity": "Программирование", "action": "CREATE"},
            {"id": 2, "action": "DELETE"}
          ],
          "companyPhone": "+79991234567",
          "companyEmail": "info@company.com",
          "telegram": "@username",
          "siteUrl": "https://company.com",
          "description": "Компания занимается разработкой программного обеспечения",
          "workers": [
            {
              "id": "123e4567-e89b-12d3-a456-426614174000",
              "name": "Петров Петр",
              "phone": "+79991234568",
              "email": "petr@company.com",
              "roleId": "worker-role-id",
              "action": "UPDATE"
            },
            {
              "name": "Иванов Иван",
              "phone": "+79991234569",
              "email": "ivanov@company.com",
              "roleId": "worker-role-id",
              "action": "CREATE"
            },
            {
              "id": "456e7890-e89b-12d3-a456-426614174111",
              "action": "ACTIVITY"
            }
          ],
          "photos": ["data:image/png;base64,iVBORw0KGgo..."],
          "files": ["data:application/pdf;base64,JVBERi0xLjQKJcOk..."],
          "maps": [
            {
              "id": "789e0123-e89b-12d3-a456-426614174222",
              "type": "OFFICE",
              "latitude": 55.7558,
              "longitude": 37.6173,
              "address": "г. Москва, ул. Тверская, д. 1",
              "action": "UPDATE"
            },
            {
              "id": "789e0123-e89b-12d3-a456-426614174222",
              "type": "MAIN_OFFICE",
              "latitude": 55.7558,
              "longitude": 37.6173,
              "address": "г. Москва, ул. Тверская, д. 1",
              "action": "UPDATE"
            }
            {
              "type": "WAREHOUSE",
              "latitude": 55.7600,
              "longitude": 37.6200,
              "address": "г. Москва, ул. Складская, д. 5",
              "action": "CREATE"
            }
          ]
        }
        \`\`\`

        **Важные моменты:**
        - Для действий \`UPDATE\`, \`DELETE\`, \`ACTIVITY\` обязательно указание \`id\`
        - Для действий \`CREATE\` и \`IGNORE\` поле \`id\` не требуется
        - При \`action: 'ACTIVITY'\` для сотрудников инвертируется поле \`isActive\`
        - Все операции выполняются в одной транзакции для атомарности
      `,
    }),
    ApiBody({
      type: UpdateUserDto,
      description: 'Данные для обновления профиля пользователя',
      required: true,
    }),
    ApiConsumes('application/json'),
    ApiResponse({
      status: 200,
      description: 'Профиль пользователя успешно обновлен',
      type: UserResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Ошибка валидации данных',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'ID типа юридического лица обязателен',
          },
          error: {
            type: 'string',
            example: 'BadRequestException',
          },
          statusCode: {
            type: 'number',
            example: 400,
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Пользователь не авторизован',
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
      status: 404,
      description: 'Пользователь не найден',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'User not found',
          },
          error: {
            type: 'string',
            example: 'NotFoundException',
          },
          statusCode: {
            type: 'number',
            example: 404,
          },
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Конфликт данных (например, дубликат активности)',
      schema: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'User already has this activity',
          },
          error: {
            type: 'string',
            example: 'ConflictException',
          },
          statusCode: {
            type: 'number',
            example: 409,
          },
        },
      },
    }),
    ApiResponse({
      status: 500,
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
            example: 'InternalServerError',
          },
          statusCode: {
            type: 'number',
            example: 500,
          },
        },
      },
    }),
  );
