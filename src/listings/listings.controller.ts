import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/request/create-listing.dto';
import { CreateListingApiDocs } from './decorators/api-create-listing-docs.decorator';
import { ApiListingQueryDocs } from './decorators/api-listing-query-docs.decorator';
import { ApiListingByIdDocs } from './decorators/api-listing-by-id-docs.decorator';
import { Protected } from '@/common/decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ListingQueryDto } from './dto/request/listing-query.dto';
import { StatusQueryDto } from './dto/request/status-query.dto';
import { ApiChangeStatusDocs } from './decorators/api-change-status-docs.decorator';
import { ChangeListingStatusDto } from './dto/request/change-listing-status.dto';
import { UpdateListingDto } from './dto/request/update-listing.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get('')
  @ApiListingQueryDocs()
  async listingList(@Query() query: ListingQueryDto) {
    return await this.listingsService.listingList(query);
  }

  @Get(':id')
  @ApiListingByIdDocs()
  async listingById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: StatusQueryDto,
  ) {
    return await this.listingsService.listingById(id, query);
  }

  @Get('users/:user_id')
  async listingsByUserId(@Param('user_id', ParseUUIDPipe) user_id: string) {
    return await this.listingsService.listingsByUserId(user_id);
  }

  // добавить specifications
  @Post('')
  @CreateListingApiDocs()
  @Protected()
  async createListing(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateListingDto,
  ) {
    return await this.listingsService.createListing(user.id, body);
  }

  // изменить статус объявления
  @Post('change-status')
  @ApiChangeStatusDocs()
  @Protected()
  async addListingToFavorite(@Body() body: ChangeListingStatusDto) {
    return await this.listingsService.listingPublishFromDraft(body);
  }

  // редактировать объявление
  // TODO: имплементировать логику
  // TODO: добавить документацию
  @Patch('edit/:id')
  @Protected()
  async editListingById(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    body: UpdateListingDto,
  ) {
    return await this.listingsService.editListingById(id, user, body);
  }

  @Delete(':id')
  @Protected()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteListingById(
    @CurrentUser() user: JwtPayload,
    @Query() query: StatusQueryDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.listingsService.deleteListingById(id, user, query);
  }

  // объявления по фильтрам + elasticsearch

  // получить рекомендованные объявления при просмотре объявления

  // отправить жалобу на объявление

  //

  // ??? получить подробную информацию по объявлению ???

  // ??? ЗАМЕТКИ ???
}
