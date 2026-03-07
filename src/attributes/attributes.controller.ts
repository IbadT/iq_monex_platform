import { Controller, Get, Post, Query } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { GetSpecificationDto } from './dto/request/specification.dto';
import { Public } from '@/common/decorators';
import { ApiQuery } from '@nestjs/swagger';

// Спецификации для объявлений
// TODO: добавить redis
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get('')
  @Public()
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Язык (ru, en, kz)',
    example: Language.RU,
  })
  async specificationList(@Query() query: GetSpecificationDto) {
    const lang = query.lang ?? Language.RU;
    return await this.attributesService.list(lang);
  }

  @Post('seed')
  async seedSpecifications() {
    return await this.attributesService.seedSpecifications();
  }
}
