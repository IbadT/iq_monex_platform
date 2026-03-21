import { Controller, Get, Delete, Param, Post, UseInterceptors, UploadedFile, Query, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Admin } from './common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { PaginationDto } from './common/dto/pagintation.dto';
import { UploadImageResponseDto, UploadImageErrorDto } from './common/dto/upload-image-response.dto';

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

@ApiTags("System")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Returns Pong' })
  getHello(): string {
    return this.appService.ping();
  }

  @Get('debug-sentry')
  @ApiOperation({ summary: 'Test Sentry error reporting' })
  @ApiResponse({ status: 500, description: 'Throws error for testing' })
  getError() {
    throw new Error('My first Sentry error!');
  }

  @Get("suggestions")
  @ApiOperation({ summary: 'Get user suggestions with pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated suggestions' })
  async userSuggestions(@Query() query: PaginationDto) {
    return await this.appService.userSuggestions(query.limit, query.offset);
  }

  @Get("images")
  @ApiOperation({ summary: 'Get all images from S3 storage' })
  @ApiResponse({ status: 200, description: 'Returns list of images with keys and URLs' })
  async getImages() {
    return await this.appService.getImages();
  }

  @Post("images")
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload image to S3 storage' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload'
        }
      }
    }
  })
  @ApiResponse({ status: 200, type: UploadImageResponseDto, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 400, type: UploadImageErrorDto, description: 'No file provided' })
  @ApiResponse({ status: 500, type: UploadImageErrorDto, description: 'Failed to upload image' })
  async uploadImage(@UploadedFile() file: MulterFile): Promise<UploadImageResponseDto | UploadImageErrorDto> {
    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    const result = await this.appService.uploadImage(file.buffer, file.originalname, file.mimetype);
    
    if (!result) {
      return { success: false, message: 'Failed to upload image' };
    }

    return {
      success: true,
      message: 'Image uploaded successfully',
      data: result
    };
  }

  @Post("suggestions")
  @ApiOperation({ summary: 'Create new user suggestion' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        text: {
          type: 'string',
          description: 'User suggestion text'
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Suggestion created successfully' })
  async createUserSuggestion(@Body() body: { text: string }) {
    return await this.appService.createUserSuggestion(body.text);
  }

  @Get("banners/:key")
  @ApiOperation({ summary: 'Get banner by key from S3 storage' })
  @ApiResponse({ status: 200, description: 'Banner found successfully' })
  @ApiResponse({ status: 404, description: 'Banner not found' })
  async getBanner(@Param('key') key: string) {
    const result = await this.appService.getBannerByKey(key);
    
    if (!result) {
      return { success: false, message: 'Banner not found' };
    }

    return {
      success: true,
      message: 'Banner found successfully',
      data: result
    };
  }

  @Delete("images/:key")
  @ApiOperation({ summary: 'Delete specific image from S3 storage' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 404, description: 'Image not found' })
  async deleteImage(@Param('key') key: string) {
    const success = await this.appService.deleteImage(key);
    return { success, message: success ? 'Image deleted successfully' : 'Failed to delete image' };
  }

  @Delete("images")
  @ApiOperation({ summary: 'Delete all images from S3 storage' })
  @ApiResponse({ status: 200, description: 'All images deleted successfully' })
  @ApiResponse({ status: 500, description: 'Failed to delete images' })
  async deleteAllImages() {
    const result = await this.appService.deleteAllImages();
    return { 
      success: true, 
      message: `Delete operation completed: ${result.success} deleted, ${result.failed} failed`,
      details: result 
    };
  }

  @Get('seed')
  @Admin()
  async seedDefaultData() {
    return await this.appService.seedDefaultData();
  }
}
