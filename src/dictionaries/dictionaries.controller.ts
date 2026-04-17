import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { DictionariesService } from './dictionaries.service';
import { GetCurrencyDto } from './dto/request/get-currency.dto';
import { GetConvertValueFromAmountDto } from './dto/request/get-convert-valut-from-amount.dto';
import { Language } from './dto/request/get-currency.dto';
import { Public } from '@/common/decorators/public.decorator';
import {
  ApiGetMeasurementsGroupsOperation,
  ApiGetValutesDocs,
  ApiPostConvertValutDocs,
  ApiGetCurrenciesDocs,
  ApiGetUnitsDocs,
} from './decorators';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MeasurementsGroupsResponseDto } from './dto/response/measurements-groups-response.dto';
import { UnitMeasurementResponseDto } from './dto/response/user-measurement-response.dto';
import { CurrenciesResponseDto } from './dto/response/currencies-response.dto';
import { CurrencyRateResponseDto } from './dto/response/currency-rate-response.dto';

// валюты и единицы изменения
// TODO: добавить redis
@ApiTags('Dictionaries')
@Controller('dictionaries')
export class DictionariesController {
  constructor(private readonly dictionariesService: DictionariesService) {}

  @Cron(CronExpression.EVERY_DAY_AT_8PM)
  @Get('valutes') // ДЛЯ ЗАПУСКА ВРУЧНУЮ
  @ApiGetValutesDocs()
  async categoryRates() {
    return await this.dictionariesService.categoryRates();
  }

  @Post('valutes/convert')
  @ApiPostConvertValutDocs()
  async convertValutFromAmount(
    @Body() body: GetConvertValueFromAmountDto,
  ): Promise<CurrencyRateResponseDto[]> {
    return await this.dictionariesService.convertValutFromAmount(body);
  }

  @Get('valutes')
  async getCategoryRates(): Promise<CurrencyRateResponseDto[]> {
    return await this.dictionariesService.getCategoryRates();
  }

  @Get('currencies')
  @Public()
  @ApiGetCurrenciesDocs()
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Язык (ru, en, kz)',
    example: Language.RU,
  })
  async getCurrencies(
    @Query() query: GetCurrencyDto,
  ): Promise<CurrenciesResponseDto[]> {
    const lang = query.lang ?? Language.RU;
    return await this.dictionariesService.currenciesList(lang);
  }

  @Get('units')
  @Public()
  @ApiGetUnitsDocs()
  @ApiQuery({
    name: 'lang',
    enum: Language,
    required: false,
    description: 'Язык (ru, en, kz)',
    example: Language.RU,
  })
  async getUnitMeasurements(
    @Query() query: GetCurrencyDto,
  ): Promise<UnitMeasurementResponseDto[]> {
    const lang = query.lang ?? Language.RU;
    return await this.dictionariesService.unitMeasurements(lang);
  }

  @Get('groups')
  @Public()
  @ApiGetMeasurementsGroupsOperation()
  async getMeasurementsGroups(
    @Query() query: GetCurrencyDto,
  ): Promise<MeasurementsGroupsResponseDto> {
    const lang = query.lang ?? Language.RU;
    return await this.dictionariesService.getMeasurementsGroups(lang);
  }
}
