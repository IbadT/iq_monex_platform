import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Admin } from './common/decorators';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  getHello(): string {
    return this.appService.ping();
  }

  @Get('debug-sentry')
  getError() {
    throw new Error('My first Sentry error!');
  }

  @Get('seed')
  @Admin()
  async seedDefaultData() {
    return await this.appService.seedDefaultData();
  }
}
