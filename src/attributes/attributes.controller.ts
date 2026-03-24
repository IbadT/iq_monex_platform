import { Controller, Get, Post, Query } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { GetSpecificationDto } from './dto/request/specification.dto';
import { Public } from '@/common/decorators';
import { ApiGetSpecificationsDocs } from './decorators';
import { SpecificationResponseDto } from './dto/response/specification.dto';

// Спецификации для объявлений
// TODO: добавить redis
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get('')
  @Public()
  @ApiGetSpecificationsDocs()
  async specificationList(
    @Query() query: GetSpecificationDto,
  ): Promise<SpecificationResponseDto[]> {
    const lang = query.lang ?? Language.RU;
    return await this.attributesService.list(lang);
  }

  // TODO: проверить, нужен ли?
  @Post('seed')
  async seedSpecifications() {
    return await this.attributesService.seedSpecifications();
  }
}
