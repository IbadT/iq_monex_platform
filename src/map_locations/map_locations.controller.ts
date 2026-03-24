import { Controller, Post, Body } from '@nestjs/common';
import { MapLocationsService } from './map_locations.service';
import { EnterpriceQueryDto } from './dto/request/enterprice-query.dto';
import { ApiEnterprisesDocs } from './decorators/api-enterprises-docs.decorator';
import { MapLocationResponseDto } from './dto/response/map-enterprice.response.dto';

@Controller('map-locations')
export class MapLocationsController {
  constructor(private readonly mapLocationsService: MapLocationsService) {}

  // TODO: добавить limit, offset
  @Post('enterprises')
  @ApiEnterprisesDocs()
  async enterprisesList(
    @Body() body: EnterpriceQueryDto,
  ): Promise<MapLocationResponseDto[]> {
    return await this.mapLocationsService.enterprisesList(body);
  }
}
