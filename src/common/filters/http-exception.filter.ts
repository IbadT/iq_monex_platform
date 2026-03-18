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
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';

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

    // Асинхронно записываем в файл
    this.logErrorToFile(exception, errorResponse, request);

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

  private async logErrorToFile(
    exception: unknown,
    errorResponse: ErrorResponse,
    request: Request,
  ): Promise<void> {
    try {
      // Всегда проверяем и создаем папку logs если она не существует
      const logsDir = join(process.cwd(), 'logs');
      try {
        await access(logsDir);
      } catch {
        await mkdir(logsDir, { recursive: true });
      }

      // Всегда проверяем и создаем файл errors.log если он не существует
      const errorFile = join(logsDir, 'errors.log');
      try {
        await access(errorFile);
      } catch {
        // Создаем файл с заголовком
        await writeFile(errorFile, '# Error Log File\n# Format: [TIMESTAMP] [LEVEL] [STATUS] MESSAGE\n\n', { flag: 'w' });
      }

      // Формируем читаемую запись в лог
      const timestamp = new Date().toLocaleString('ru-RU', { 
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const level = errorResponse.statusCode >= 500 ? 'ERROR' : 'WARN';
      const user = (request as any).user;

      // Формируем секцию с параметрами
      const paramsSection = [];
      
      if (request.query && Object.keys(request.query).length > 0) {
        paramsSection.push(`Query: ${JSON.stringify(request.query, null, 2)}`);
      }
      
      if (request.params && Object.keys(request.params).length > 0) {
        paramsSection.push(`Params: ${JSON.stringify(request.params, null, 2)}`);
      }
      
      if (request.body && Object.keys(request.body).length > 0) {
        // Для body ограничиваем размер и скрываем чувствительные данные
        const sanitizedBody = this.sanitizeRequestBody(request.body);
        paramsSection.push(`Body: ${JSON.stringify(sanitizedBody, null, 2)}`);
      }

      // Проверяем на ошибки валидации
      const validationErrors = this.extractValidationErrors(exception);
      if (validationErrors.length > 0) {
        paramsSection.push(`Validation Errors: ${validationErrors.join(', ')}`);
      }

      const logMessage = [
        `[${timestamp}] [${level}] [${errorResponse.statusCode}] ${errorResponse.message}`,
        `Path: ${request.method} ${errorResponse.path}`,
        `IP: ${request.ip}`,
        ...(user ? [`User: ${user.name} (${user.email}, role: ${user.role})`] : []),
        `Exception: ${(exception as any)?.name || 'Unknown'} - ${(exception as any)?.message || 'No message'}`,
        ...(paramsSection.length > 0 ? ['', 'Request Parameters:', ...paramsSection] : []),
        '---'
      ].join('\n');

      // Добавляем stack trace только для критических ошибок (500+) и только в development
      const isDevelopment = this.configService.get<string>('NODE_ENV') === 'development';
      const shouldIncludeStack = isDevelopment && errorResponse.statusCode >= 500 && (exception as any)?.stack;
      
      const fullLogMessage = shouldIncludeStack 
        ? logMessage + `\nStack Trace:\n${(exception as any).stack}\n---\n`
        : logMessage + '\n';

      // Записываем в файл асинхронно
      await writeFile(errorFile, fullLogMessage, { flag: 'a' });
    } catch (logError) {
      // Если не удалось записать в файл, логируем в консоль
      this.logger.error('Failed to write error to file:', logError);
    }
  }

  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') return body;

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    // Ограничиваем размер объекта
    const jsonString = JSON.stringify(sanitized);
    if (jsonString.length > 1000) {
      return { ...sanitized, _note: '[TRUNCATED - too large]' };
    }

    return sanitized;
  }

  private extractValidationErrors(exception: unknown): string[] {
    const errors: string[] = [];

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      
      if (typeof response === 'object' && response !== null) {
        const responseObj = response as any;
        
        // Обработка ошибок валидации class-validator
        if (responseObj.message && Array.isArray(responseObj.message)) {
          errors.push(...responseObj.message);
        }
        
        // Обработка ошибок из ValidationPipe
        if (responseObj.errors && Array.isArray(responseObj.errors)) {
          responseObj.errors.forEach((error: any) => {
            if (error.constraints) {
              errors.push(...Object.values(error.constraints).filter((err): err is string => typeof err === 'string'));
            }
            if (error.children && Array.isArray(error.children)) {
              error.children.forEach((child: any) => {
                if (child.constraints) {
                  errors.push(...Object.values(child.constraints).filter((err): err is string => typeof err === 'string'));
                }
              });
            }
          });
        }
      }
    }

    return errors.filter(error => error && typeof error === 'string');
  }
}
