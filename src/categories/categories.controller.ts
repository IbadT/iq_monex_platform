import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Public } from '@/common/decorators';
import {
  CategoryResponseDto,
  SubcategoryResponseDto,
  SubSubcategoryResponseDto,
} from './dto/response/categories-response.dto';
import { 
  CategoriesApiDocs, 
  ApiGetCategoryTreeDocs, 
  ApiGetSubcategoriesDocs, 
  ApiGetSubcategoryTreeDocs, 
  ApiGetSubsubcategoriesDocs, 
  ApiGetLegalEntityTypesDocs, 
  ApiPostLegalEntitySeedDocs, 
  ApiPostCategoriesSeedDocs 
} from './decorators';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { GetLegalEntityTypesDto } from './dto/request/get-legal-entity-types.dto';

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
  @ApiGetCategoryTreeDocs()
  async getCategoryTreeById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getCategoryTreeById(id);
  }

  @Get('subcategories')
  @Public()
  @ApiGetSubcategoriesDocs()
  async getSubCategories(): Promise<SubcategoryResponseDto[]> {
    return await this.categoriesService.subcategoriesList();
  }

  @Get('subcategories/:id/tree')
  @ApiGetSubcategoryTreeDocs()
  async getSubCategoriesTreeById(@Param('id', ParseIntPipe) id: number) {
    return await this.categoriesService.getCategoryTreeById(id);
  }

  @Get('subsubcategories')
  @Public()
  @ApiGetSubsubcategoriesDocs()
  async getSubSubcategories(): Promise<SubSubcategoryResponseDto[]> {
    return await this.categoriesService.subsubcategoriesList();
  }

  @Get('legal-entity-types')
  @Public()
  @ApiGetLegalEntityTypesDocs()
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Язык (ru, en, kz)',
    example: Language.RU,
    default: Language.RU,
  })
  async getLegalEntityTypes(@Query() query: GetLegalEntityTypesDto) {
    const lang = query.lang ?? Language.RU;
    return await this.categoriesService.getLegalEntityTypes(lang);
  }

  @Post('legal-entity-types/seed')
  @Public()
  @ApiPostLegalEntitySeedDocs()
  async addSeedLegalEntityTypes() {
    return await this.categoriesService.addSeedLegalEntityTypes();
  }

  @Post('seed')
  @Public()
  @ApiPostCategoriesSeedDocs()
  async addSeedDatas(): Promise<string> {
    return await this.categoriesService.seedCategories();
  }
}
