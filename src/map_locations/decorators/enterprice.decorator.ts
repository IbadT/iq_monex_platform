import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { MapLocationResponseDto } from '../dto/response/map-enterprice.response.dto';
import { MapLocationType } from '@/listings/dto/request/create-map-location.dto';
// import { EnterpriceQueryDto } from '../dto/enterprice-query.dto';
// import { MapLocationResponseDto } from '../dto/response/map-location-response.dto';

export const ApiFindEnterprisesOperation = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Поиск предприятий по геолокации и фильтрам',
      description: `
        Поиск локаций пользователей (офисов, складов) по заданным критериям:
        - Географический поиск по населённому пункту и радиусу
        - Фильтрация по типу локации (OFFICE, WAREHOUSE, OTHER)
        - Фильтрация по активностям пользователя
        - Фильтрация по рейтингу пользователя (> 4 звёзд)
        
        Возвращает список локаций с данными пользователей и их активностями.
      `,
    }),
    ApiBearerAuth(),
    // ApiQuery({
    //   name: 'locality',
    //   description: 'Населённый пункт для поиска (город, посёлок, деревня)',
    //   example: 'Москва',
    //   required: true,
    //   type: String,
    // }),
    ApiQuery({
      name: 'latitude',
      description: 'Широта центральной точки для поиска по геохешу',
      example: 55.7558,
      required: true,
      type: Number,
    }),
    ApiQuery({
      name: 'longitude',
      description: 'Долгота центральной точки для поиска по геохешу',
      example: 37.6173,
      required: true,
      type: Number,
    }),
    ApiQuery({
      name: 'radius',
      description: 'Радиус поиска в километрах от центра населённого пункта',
      example: 50,
      required: true,
      type: Number,
    }),
    // 🔥 filter - массив enum с выбором значений
    ApiQuery({
      name: 'filter',
      description: 'Типы локаций для фильтрации (можно выбрать несколько)',
      required: true,
      isArray: true,
      enum: MapLocationType, // ← Используем enum напрямую
      type: 'array', // ← Важно: type как строка 'array'
      items: {
        type: 'string',
        enum: Object.values(MapLocationType), // ← Для отображения в Swagger
      },
    }),

    // 🔥 activityIds - массив строк с примерами ID
    ApiQuery({
      name: 'activityIds',
      description:
        'ID активностей пользователей для фильтрации (пустой массив = все активности)',
      required: true,
      isArray: true,
      type: 'array',
      items: {
        type: 'string',
        example: '1', // ← Пример одного элемента
      },
      example: ['1', '5', '12'], // ← Пример всего массива
    }),

    ApiQuery({
      name: 'rating',
      description: 'Показывать только пользователей с рейтингом выше 4 звёзд',
      example: false,
      required: true,
      type: Boolean,
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Успешный поиск предприятий',
      type: [MapLocationResponseDto],
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/MapLocationResponseDto' },
            description: 'Список найденных локаций',
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number', example: 15 },
              radius: { type: 'number', example: 50 },
              locality: { type: 'string', example: 'Москва' },
            },
          },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Ошибка валидации параметров запроса',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'array',
            items: { type: 'string' },
            example: [
              'locality не должен быть пустым',
              'radius не может быть меньше 1',
              'filter должен содержать хотя бы один тип локации',
            ],
          },
          error: { type: 'string', example: 'Bad Request' },
          statusCode: { type: 'number', example: 400 },
          path: { type: 'string', example: '/enterprises/search' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Не авторизован — требуется JWT токен',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Unauthorized' },
          error: { type: 'string', example: 'Unauthorized' },
          statusCode: { type: 'number', example: 401 },
          path: { type: 'string', example: '/enterprises/search' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Населённый пункт не найден в геокодере',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Населённый пункт "НесуществующийГород" не найден',
          },
          error: { type: 'string', example: 'Not Found' },
          statusCode: { type: 'number', example: 404 },
          path: { type: 'string', example: '/enterprises/search' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
    ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Внутренняя ошибка сервера (ошибка геокодера, БД и т.д.)',
      schema: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: {
            type: 'string',
            example: 'Ошибка при получении координат',
          },
          error: { type: 'string', example: 'Internal Server Error' },
          statusCode: { type: 'number', example: 500 },
          path: { type: 'string', example: '/enterprises/search' },
          timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
        },
      },
    }),
  );
};
