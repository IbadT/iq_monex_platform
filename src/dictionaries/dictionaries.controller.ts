import { Controller, Get, Post, Query } from '@nestjs/common';
import { DictionariesService } from './dictionaries.service';
import { Public } from '@/common/decorators';
import { GetCurrencyDto, Language } from './dto/request/get-currency.dto';
import { ApiQuery } from '@nestjs/swagger';

// валюты и единицы изменения
// TODO: добавить redis
// TODO: добавить объединения с категориями (combined)
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @Post('seed')
  async addSeedDatas(): Promise<string> {
    return await this.dictionariesService.seedDictionariesData();
  }

  @Get('currencies')
  @Public()
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Язык (ru, en, kz)',
    example: Language.RU,
  })
  async getCurrencies(@Query() query: GetCurrencyDto) {
    const lang = query.lang ?? Language.RU;
    return await this.dictionariesService.currenciesList(lang);
  }

  @Get('units')
  @Public()
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Язык (ru, en, kz)',
    example: Language.RU,
  })
  async getUnitMeasurements(@Query() query: GetCurrencyDto) {
    const lang = query.lang ?? Language.RU;
    return await this.dictionariesService.unitMeasurements(lang);
  }
}
