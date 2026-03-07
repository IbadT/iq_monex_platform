import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from '@/common/decorators';
import {
  CategoryResponseDto,
  SubcategoryResponseDto,
  SubSubcategoryResponseDto,
} from './dto/response/categories-response.dto';
import { CategoriesApiDocs } from './decorators/categories.decorator';
import { ApiTags } from '@nestjs/swagger';

// TODO: добавить документацию в декораторы
// TODO: добавить получение из redis
@ApiTags('Categories / Subcategories / SubSubcategories')
@Controller('')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('categories')
  @Public()
  @CategoriesApiDocs()
  async getCategories(): Promise<CategoryResponseDto[]> {
    return await this.categoriesService.categoriesList();
  }

  @Get('categories/:id/tree')
  async getCategoryTreeById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getCategoryTreeById(id);
  }

  @Get('subcategories')
  @Public()
  async getSubCategories(): Promise<SubcategoryResponseDto[]> {
    return await this.categoriesService.subcategoriesList();
  }

  @Get('subcategories/:id/tree')
  async getSubCategoriesTreeById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getCategoryTreeById(id);
  }

  @Get('subsubcategories')
  @Public()
  async getSubSubcategories(): Promise<SubSubcategoryResponseDto[]> {
    return await this.categoriesService.subsubcategoriesList();
  }

  @Post('seed')
  @Public()
  async addSeedDatas(): Promise<string> {
    return await this.categoriesService.seedCategories();
  }
}
