import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import {
  ErrorResponseSchema,
  ValidationErrorResponseSchema,
  SuccessResponseSchema,
  ErrorSchemas,
} from '../schemas/error-response.schema';

/**
 * Декоратор для успешного ответа
 */
export const ApiSuccessResponse = (
  type?: any,
  description = 'Successful operation',
) => {
  if (type) {
    return ApiResponse({
      status: HttpStatus.OK,
      description,
      type,
    });
  }

  return ApiResponse({
    status: HttpStatus.OK,
    description,
    schema: SuccessResponseSchema({
      message: 'Operation completed successfully',
    }),
  });
};

/**
 * Декоратор для ошибки 400 (Bad Request)
 */
export const ApiBadRequestResponse = (description = 'Bad Request') => {
  return ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description,
    schema: ValidationErrorResponseSchema,
  });
};

/**
 * Декоратор для ошибки 401 (Unauthorized)
 */
export const ApiUnauthorizedResponse = (description = 'Unauthorized') => {
  return ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description,
    schema: ErrorSchemas.unauthorized,
  });
};

/**
 * Декоратор для ошибки 403 (Forbidden)
 */
export const ApiForbiddenResponse = (description = 'Forbidden') => {
  return ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description,
    schema: ErrorSchemas.forbidden,
  });
};

/**
 * Декоратор для ошибки 404 (Not Found)
 */
export const ApiNotFoundResponse = (description = 'Not Found') => {
  return ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description,
    schema: ErrorSchemas.notFound,
  });
};

/**
 * Декоратор для ошибки 409 (Conflict)
 */
export const ApiConflictResponse = (description = 'Conflict') => {
  return ApiResponse({
    status: HttpStatus.CONFLICT,
    description,
    schema: ErrorSchemas.conflict,
  });
};

/**
 * Декоратор для ошибки 429 (Too Many Requests)
 */
export const ApiTooManyRequestsResponse = (
  description = 'Too Many Requests',
) => {
  return ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description,
    schema: ErrorSchemas.tooManyRequests,
  });
};

/**
 * Декоратор для ошибки 500 (Internal Server Error)
 */
export const ApiInternalServerErrorResponse = (
  description = 'Internal Server Error',
) => {
  return ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description,
    schema: ErrorSchemas.internalServerError,
  });
};

/**
 * Комбинированный декоратор для стандартных CRUD ответов
 */
export const ApiCrudResponses = (entityType: any) => {
  return applyDecorators(
    ApiSuccessResponse(entityType, 'Operation completed successfully'),
    ApiBadRequestResponse('Invalid request data'),
    ApiUnauthorizedResponse('Access token is required'),
    ApiForbiddenResponse('Insufficient permissions'),
    ApiNotFoundResponse('Resource not found'),
    ApiConflictResponse('Resource already exists'),
    ApiInternalServerErrorResponse('Internal server error'),
  );
};

/**
 * Комбинированный декоратор для аутентификации
 */
export const ApiAuthResponses = () => {
  return applyDecorators(
    ApiBadRequestResponse('Invalid credentials'),
    ApiUnauthorizedResponse('Invalid or expired token'),
    ApiForbiddenResponse('Account disabled or banned'),
    ApiTooManyRequestsResponse('Too many login attempts'),
    ApiInternalServerErrorResponse('Authentication service error'),
  );
};
