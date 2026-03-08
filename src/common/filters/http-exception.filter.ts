import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

export interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  statusCode: number;
  path: string;
  timestamp: string;
  developerInfo?: {
    stack?: string;
    cause?: any;
  };
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.createErrorResponse(exception, request);

    // Логируем ошибку
    this.logError(exception, errorResponse);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private createErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    const isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development';

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message = 'Internal server error';
      let error = 'INTERNAL_SERVER_ERROR';

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || responseObj.error || message;
        error = responseObj.error || error;
      }

      return {
        success: false,
        message,
        error,
        statusCode: status,
        path: request.url,
        timestamp: new Date().toISOString(),
        ...(isDevelopment && {
          developerInfo: {
            stack: exception.stack || '',
            cause: exception.cause,
          },
        }),
      };
    }

    // Обработка нестандартных ошибок
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    return {
      success: false,
      message,
      error,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      ...(isDevelopment && {
        developerInfo: {
          stack: (exception as any)?.stack,
          cause: (exception as any)?.cause,
        },
      }),
    };
  }

  private logError(exception: unknown, errorResponse: ErrorResponse): void {
    const isDevelopment =
      this.configService.get<string>('NODE_ENV') === 'development';

    if (exception instanceof HttpException) {
      // HTTP ошибки (4xx, 5xx)
      if (errorResponse.statusCode >= 500) {
        this.logger.error(
          `Server Error: ${errorResponse.message}`,
          exception instanceof Error ? exception.stack : exception,
        );
      } else {
        this.logger.warn(`Client Error: ${errorResponse.message}`);
      }
    } else {
      // Неожиданные ошибки
      this.logger.error(
        `Unexpected Error: ${errorResponse.message}`,
        exception instanceof Error ? exception.stack : exception,
      );
    }

    // В development логируем полную информацию
    if (isDevelopment) {
      console.error('Development Error Details:', {
        exception,
        errorResponse,
        stack: (exception as any)?.stack,
      });
    }
  }
}
