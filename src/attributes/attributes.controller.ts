import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { GetSpecificationDto } from './dto/request/specification.dto';
import { Public } from '@/common/decorators';
import { ApiGetSpecificationsDocs } from './decorators';
import { SpecificationResponseDto } from './dto/response/specification.dto';
import { CreateSpecificationDto } from './dto/request/createSpecification.dto';
import { UpdateSpecificationDto } from './dto/request/updateSpecification.dto';

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

  @Post('')
  async createSpecification(
    @Body() body: CreateSpecificationDto,
  ): Promise<{ id: number }> {
    return await this.attributesService.createSpecification(body);
  }

  @Put(':id')
  async updateSpecification(
    @Param('id') id: number,
    @Body() body: UpdateSpecificationDto,
  ) {
    const result = await this.attributesService.updateSpecification(id, body);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  async deleteSpecification(@Param('id') id: number) {
    const result = await this.attributesService.deleteSpecification(id);
    return {
      success: true,
      data: result,
    };
  }

  // TODO: проверить, нужен ли?
  @Post('seed')
  async seedSpecifications() {
    return await this.attributesService.seedSpecifications();
  }
}
