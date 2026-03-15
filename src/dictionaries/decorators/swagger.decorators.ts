import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MeasurementsGroupsResponseDto } from '../dto/response/measurements-groups-response.dto';
import { Language } from '../dto/request/get-currency.dto';

// Декоратор для получения групп измерений
export const ApiGetMeasurementsGroupsOperation = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Get measurements groups',
      description: 'Retrieve grouped measurement units and specifications with language support',
    }),
    ApiQuery({
      name: 'lang',
      enum: Language,
      required: false,
      description: 'Язык (ru, en, kz)',
      example: Language.RU,
    }),
    ApiResponse({
      status: 200,
      description: 'Measurements groups retrieved successfully',
      type: MeasurementsGroupsResponseDto,
    }),
  );
};
