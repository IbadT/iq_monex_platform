import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { MakeComplaintToListing } from '../dto/request/make-complaint-to-listing.dto';
import { CreateListingComplaintResponseDto } from '../dto/response/create-listing-complaint-response.dto';

export function ApiComplaintDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'Подать жалобу на объявление',
      description: 'Создает жалобу на указанное объявление',
    }),
    ApiBody({
      description: 'Данные для создания жалобы',
      type: MakeComplaintToListing,
    }),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: 'Жалоба успешно создана',
      type: CreateListingComplaintResponseDto,
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
            example: 'Вы уже подали жалобу на это объявление',
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
