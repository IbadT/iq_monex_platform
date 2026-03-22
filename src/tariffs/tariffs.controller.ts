import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TariffsService } from './tariffs.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { Admin } from '@/common/decorators';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiGetAllTariffsDocs } from './decorators/api-get-all-tariffs-docs.decorator';
import { ApiCreateTariffDocs } from './decorators/api-create-tariff-docs.decorator';
import { ApiSeedTariffsDocs } from './decorators/api-seed-tariffs-docs.decorator';
import { ApiUpdateTariffDocs } from './decorators/api-update-tariff-docs.decorator';
import { ApiGetTariffByIdDocs } from './decorators/api-get-tariff-by-id-docs.decorator';

@ApiTags('Tariffs')
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Get()
  @ApiGetAllTariffsDocs()
  async getAllTariffs() {
    return await this.tariffsService.getAllTariffs();
  }

  @Post()
  @Admin()
  @ApiCreateTariffDocs()
  async createTariff(@Body() body: CreateTariffDto) {
    return await this.tariffsService.createTariff(body);
  }

  @Post('seed')
  @Admin()
  @ApiSeedTariffsDocs()
  async seedTariffs() {
    return await this.tariffsService.seedTariffsFromData();
  }

  @Patch(':id')
  @Admin()
  @ApiUpdateTariffDocs()
  async updateTariff(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTariffDto,
  ) {
    return await this.tariffsService.updateTariff(id, body);
  }

  @Get(':id')
  @ApiGetTariffByIdDocs()
  async getTariffById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tariffsService.getTariffById(id);
  }
}
