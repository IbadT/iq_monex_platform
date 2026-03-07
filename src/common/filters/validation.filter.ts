import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch()
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);
  private readonly configService = new ConfigService();

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = HttpStatus.BAD_REQUEST;
    
    const errorResponse = {
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      details: this.extractValidationErrors(exception),
      ...(this.configService.get<string>('NODE_ENV') === 'development' && {
        developerInfo: {
          stack: exception.stack,
        },
      }),
    };

    this.logger.error(`Validation Error: ${exception.message}`, exception.stack);

    response.status(status).json(errorResponse);
  }

  private extractValidationErrors(exception: any): any[] {
    if (exception.response && Array.isArray(exception.response.message)) {
      return exception.response.message.map((error: any) => {
        if (typeof error === 'string') {
          return { field: 'general', message: error };
        }
        return error;
      });
    }

    return [{
      field: 'general',
      message: exception.message || 'Validation failed',
    }];
  }
}
