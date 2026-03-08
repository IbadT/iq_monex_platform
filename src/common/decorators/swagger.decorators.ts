import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginResponseDto } from '@/auth/dto/login-response.dto';
import { RegisterResponseDto } from '@/auth/dto/register-response.dto';

// Декоратор для успешного ответа
export const ApiSuccessResponse = (
  type: any,
  description = 'Successful operation',
) => {
  return ApiResponse({
    status: 200,
    description,
    type,
  });
};

// Декоратор для ошибки 400 (Bad Request)
export const ApiBadRequestResponse = (description = 'Bad Request') => {
  return ApiResponse({
    status: 400,
    description,
  });
};

// Декоратор для ошибки 401 (Unauthorized)
export const ApiUnauthorizedResponse = (description = 'Unauthorized') => {
  return ApiResponse({
    status: 401,
    description,
  });
};

// Декоратор для ошибки 404 (Not Found)
export const ApiNotFoundResponse = (description = 'Not Found') => {
  return ApiResponse({
    status: 404,
    description,
  });
};

// Декоратор для ошибки 409 (Conflict)
export const ApiConflictResponse = (description = 'Conflict') => {
  return ApiResponse({
    status: 409,
    description,
  });
};

// Декоратор для ошибки 500 (Internal Server Error)
export const ApiInternalServerErrorResponse = (
  description = 'Internal Server Error',
) => {
  return ApiResponse({
    status: 500,
    description,
  });
};

// Декоратор для операции входа (login)
export const ApiLoginOperation = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description: 'Authenticate user and return JWT tokens',
    }),
    ApiSuccessResponse(LoginResponseDto, 'Successful login'),
    ApiNotFoundResponse('User not found'),
    ApiUnauthorizedResponse('Invalid password'),
    ApiBadRequestResponse('Invalid request body'),
  );
};

// Декоратор для операции регистрации (register)
export const ApiRegisterOperation = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User register',
      description: 'Create new user account and return JWT tokens',
    }),
    ApiSuccessResponse(RegisterResponseDto, 'User successfully registered'),
    ApiConflictResponse('User with this email already exists'),
    ApiBadRequestResponse('Invalid request body'),
  );
};

// Декоратор для получения пользователя
export const ApiGetUserOperation = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get user information',
      description: 'Get current user information',
    }),
    ApiSuccessResponse(LoginResponseDto, 'User information retrieved'),
    ApiNotFoundResponse('User not found'),
    ApiUnauthorizedResponse('Access token is invalid or expired'),
  );
};

// Декоратор для обновления токена
export const ApiRefreshTokenOperation = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh access token',
      description: 'Generate new access token using refresh token',
    }),
    ApiSuccessResponse(LoginResponseDto, 'Token successfully refreshed'),
    ApiUnauthorizedResponse('Refresh token is invalid or expired'),
    ApiBadRequestResponse('Invalid request body'),
  );
};

// Декоратор для выхода (logout)
export const ApiLogoutOperation = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User logout',
      description: 'Invalidate user tokens',
    }),
    ApiSuccessResponse(null, 'Successfully logged out'),
    ApiUnauthorizedResponse('Access token is invalid or expired'),
  );
};

// Универсальный декоратор для CRUD операций
export const ApiCrudOperations = (entityName: string, responseType: any) => {
  return {
    create: applyDecorators(
      ApiOperation({
        summary: `Create ${entityName}`,
        description: `Create new ${entityName}`,
      }),
      ApiSuccessResponse(responseType, `${entityName} successfully created`),
      ApiBadRequestResponse('Invalid request body'),
      ApiConflictResponse(`${entityName} already exists`),
    ),
    findAll: applyDecorators(
      ApiOperation({
        summary: `Get all ${entityName}s`,
        description: `Retrieve list of ${entityName}s`,
      }),
      ApiSuccessResponse([responseType], `List of ${entityName}s retrieved`),
    ),
    findOne: applyDecorators(
      ApiOperation({
        summary: `Get ${entityName}`,
        description: `Retrieve ${entityName} by ID`,
      }),
      ApiSuccessResponse(responseType, `${entityName} retrieved`),
      ApiNotFoundResponse(`${entityName} not found`),
    ),
    update: applyDecorators(
      ApiOperation({
        summary: `Update ${entityName}`,
        description: `Update ${entityName} by ID`,
      }),
      ApiSuccessResponse(responseType, `${entityName} successfully updated`),
      ApiNotFoundResponse(`${entityName} not found`),
      ApiBadRequestResponse('Invalid request body'),
    ),
    remove: applyDecorators(
      ApiOperation({
        summary: `Delete ${entityName}`,
        description: `Delete ${entityName} by ID`,
      }),
      ApiSuccessResponse(null, `${entityName} successfully deleted`),
      ApiNotFoundResponse(`${entityName} not found`),
    ),
  };
};
