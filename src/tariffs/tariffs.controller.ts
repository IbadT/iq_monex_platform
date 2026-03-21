import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TariffsService } from './tariffs.service';
import { CreateTariffDto } from './dto/create-tariff.dto';
import { UpdateTariffDto } from './dto/update-tariff.dto';
import { Admin } from '@/common/decorators';
import { ParseUUIDPipe } from '@nestjs/common';

@ApiTags('Tariffs')
@Controller('tariffs')
export class TariffsController {
  constructor(private readonly tariffsService: TariffsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить все тарифы' })
  @ApiResponse({ status: 200, description: 'Список тарифов получен' })
  async getAllTariffs() {
    return await this.tariffsService.getAllTariffs();
  }

  @Post()
  @Admin()
  @ApiOperation({ summary: 'Создать новый тариф' })
  @ApiResponse({ status: 201, description: 'Тариф создан' })
  async createTariff(@Body() body: CreateTariffDto) {
    return await this.tariffsService.createTariff(body);
  }

  @Post('seed')
  @Admin()
  @ApiOperation({ summary: 'Создать тарифы из дефолтных данных' })
  @ApiResponse({ status: 201, description: 'Тарифы созданы из дефолтных данных' })
  async seedTariffs() {
    return await this.tariffsService.seedTariffsFromData();
  }

  @Patch(':id')
  @Admin()
  @ApiOperation({ summary: 'Обновить тариф по ID' })
  @ApiResponse({ status: 200, description: 'Тариф обновлен' })
  async updateTariff(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateTariffDto,
  ) {
    return await this.tariffsService.updateTariff(id, body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить тариф по ID' })
  @ApiResponse({ status: 200, description: 'Тариф получен' })
  async getTariffById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.tariffsService.getTariffById(id);
  }
}
