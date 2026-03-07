import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoryResponseDto } from '../dto/response/categories-response.dto';

export const CategoriesApiDocs = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Список категорий для объявлений',
      description: '',
    }),
    ApiResponse({
      status: HttpStatus.OK,
      description: '',
      type: Array<CategoryResponseDto>,
    }),
  );
};
