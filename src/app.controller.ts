import {
  Controller,
  Get,
  Delete,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
// import { Admin } from './common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from './common/dto/pagintation.dto';
import {
  UploadImageResponseDto,
  UploadImageErrorDto,
} from './common/dto/upload-image-response.dto';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename: string;
  path?: string;
  buffer: Buffer;
}

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  @ApiOperation({ summary: 'Проверка работоспособности системы' })
  @ApiResponse({ status: 200, description: 'Возвращает Pong' })
  getHello(): string {
    return this.appService.ping();
  }

  @Get('debug-sentry')
  @ApiOperation({ summary: 'Тестирование отчетов об ошибках Sentry' })
  @ApiResponse({ status: 500, description: 'Вызывает ошибку для тестирования' })
  getError() {
    throw new Error('My first Sentry error!');
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Получение предложений пользователей с пагинацией' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает пагинированные предложения',
  })
  async userSuggestions(@Query() query: PaginationDto) {
    return await this.appService.userSuggestions(query.limit, query.offset);
  }

  @Get('images')
  @ApiOperation({ summary: 'Получение всех изображений из S3 хранилища' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает список изображений с ключами и URL',
  })
  async getImages() {
    return await this.appService.getImages();
  }

  @Post('images')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Загрузка изображения в S3 хранилище' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Загрузка файла',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Файл изображения для загрузки',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    type: UploadImageResponseDto,
    description: 'Изображение успешно загружено',
  })
  @ApiResponse({
    status: 400,
    type: UploadImageErrorDto,
    description: 'Файл не предоставлен',
  })
  @ApiResponse({
    status: 500,
    type: UploadImageErrorDto,
    description: 'Не удалось загрузить изображение',
  })
  async uploadImage(
    @UploadedFile() file: MulterFile,
  ): Promise<UploadImageResponseDto | UploadImageErrorDto> {
    if (!file) {
      return { success: false, message: 'Файл не предоставлен' };
    }

    const result = await this.appService.uploadImage(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    if (!result) {
      return { success: false, message: 'Не удалось загрузить изображение' };
    }

    return {
      success: true,
      message: 'Изображение успешно загружено',
      data: result,
    };
  }

  @Post('suggestions')
  @ApiOperation({ summary: 'Создание нового предложения пользователя' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'Текст предложения пользователя',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Предложение успешно создано' })
  async createUserSuggestion(@Body() body: { text: string }) {
    return await this.appService.createUserSuggestion(body.text);
  }

  @Get('banners/:key')
  @ApiOperation({ summary: 'Получение баннера по ключу из S3 хранилища' })
  @ApiResponse({ status: 200, description: 'Баннер успешно найден' })
  @ApiResponse({ status: 404, description: 'Баннер не найден' })
  async getBanner(@Param('key') key: string) {
    const result = await this.appService.getBannerByKey(key);

    if (!result) {
      return { success: false, message: 'Баннер не найден' };
    }

    return {
      success: true,
      message: 'Баннер успешно найден',
      data: result,
    };
  }

  @Delete('images/:key')
  @ApiOperation({ summary: 'Удаление конкретного изображения из S3 хранилища' })
  @ApiResponse({ status: 200, description: 'Изображение успешно удалено' })
  @ApiResponse({ status: 404, description: 'Изображение не найдено' })
  async deleteImage(@Param('key') key: string) {
    const success = await this.appService.deleteImage(key);
    return {
      success,
      message: success
        ? 'Изображение успешно удалено'
        : 'Не удалось удалить изображение',
    };
  }

  @Delete('images')
  @ApiOperation({ summary: 'Удаление всех изображений из S3 хранилища' })
  @ApiResponse({ status: 200, description: 'Все изображения успешно удалены' })
  @ApiResponse({ status: 500, description: 'Не удалось удалить изображения' })
  async deleteAllImages() {
    const result = await this.appService.deleteAllImages();
    return {
      success: true,
      message: `Операция удаления завершена: ${result.success} удалено, ${result.failed} не удалось`,
      details: result,
    };
  }

  @Get('seed')
  // @Admin()
  async seedDefaultData() {
    return await this.appService.seedDefaultData();
  }
}
