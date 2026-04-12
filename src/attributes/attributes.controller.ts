import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { GetSpecificationDto } from './dto/request/specification.dto';
import { CurrentUser, Protected } from '@/common/decorators';
import { ApiGetSpecificationsDocs } from './decorators';
import { SpecificationResponseDto } from './dto/response/specification.dto';
import { UserSpecificationResponseDto } from './dto/response/user-specification.dto';
import { CreateSpecificationDto } from './dto/request/createSpecification.dto';
import { CreateUserSpecificationDto } from './dto/request/create-user-specification.dto';
import { UpdateSpecificationDto } from './dto/request/updateSpecification.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { OptionalJwtAuthGuard } from '@/common/guards/optional-jwt-auth.guard';

// Спецификации для объявлений
// TODO: добавить redis
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @Get('')
  // @Public()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiGetSpecificationsDocs()
  async specificationList(
    @Query() query: GetSpecificationDto,
    @CurrentUser() user?: JwtPayload,
  ): Promise<SpecificationResponseDto[]> {
    const lang = query.lang ?? Language.RU;
    return await this.attributesService.list(lang, user?.id);
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

  // ============ USER SPECIFICATIONS (пользовательские характеристики) ============

  @Get('custom')
  @Protected()
  async getMySpecifications(
    @CurrentUser() user: JwtPayload,
    @Query() query: GetSpecificationDto,
  ): Promise<UserSpecificationResponseDto[]> {
    const lang = query.lang ?? Language.RU;
    return await this.attributesService.listUserSpecifications(user.id, lang);
  }

  @Post('custom')
  @Protected()
  async createMySpecification(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateUserSpecificationDto,
  ): Promise<{ id: number }> {
    return await this.attributesService.createUserSpecification(user.id, body);
  }

  @Delete('custom/:id')
  @Protected()
  async deleteMySpecification(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: number,
  ): Promise<{ success: boolean; data: { id: number } }> {
    const result = await this.attributesService.deleteUserSpecification(user.id, id);
    return {
      success: true,
      data: result,
    };
  }
}
