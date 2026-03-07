/**
 * Базовая схема ответа об ошибке
 */
export const ErrorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: 'Error message' },
    error: { type: 'string', example: 'Error Type' },
    statusCode: { type: 'number', example: 400 },
    path: { type: 'string', example: '/api/route' },
    timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
  },
};

/**
 * Схема ответа с массивом сообщений (для ошибок валидации)
 */
export const ValidationErrorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { 
      type: 'array', 
      items: { type: 'string' },
      example: ['Некорректный email', 'Пароль не может быть пустым']
    },
    error: { type: 'string', example: 'Bad Request' },
    statusCode: { type: 'number', example: 400 },
    path: { type: 'string', example: '/api/route' },
    timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
  },
};

/**
 * Схема успешного ответа
 */
export const SuccessResponseSchema = (dataExample: any, description = 'Successful operation') => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    data: { example: dataExample },
    statusCode: { type: 'number', example: 200 },
    path: { type: 'string', example: '/api/route' },
    timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
  },
});

/**
 * Фабрика для создания схем ответов об ошибках
 */
export const createErrorResponseSchema = (
  statusCode: number,
  errorType: string,
  messageExample: string
) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: false },
    message: { type: 'string', example: messageExample },
    error: { type: 'string', example: errorType },
    statusCode: { type: 'number', example: statusCode },
    path: { type: 'string', example: '/api/route' },
    timestamp: { type: 'string', example: '2024-01-01T12:00:00.000Z' },
  },
});

/**
 * Преднастроенные схемы для常见 HTTP статусов
 */
export const ErrorSchemas = {
  badRequest: createErrorResponseSchema(400, 'Bad Request', 'Invalid request data'),
  unauthorized: createErrorResponseSchema(401, 'Unauthorized', 'Access token is required'),
  forbidden: createErrorResponseSchema(403, 'Forbidden', 'Access denied'),
  notFound: createErrorResponseSchema(404, 'Not Found', 'Resource not found'),
  conflict: createErrorResponseSchema(409, 'Conflict', 'Resource already exists'),
  tooManyRequests: createErrorResponseSchema(429, 'Too Many Requests', 'Rate limit exceeded'),
  internalServerError: createErrorResponseSchema(500, 'Internal Server Error', 'Internal server error'),
};
