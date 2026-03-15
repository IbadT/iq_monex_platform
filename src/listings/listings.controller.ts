import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingQueryDto } from './dto/request/listing-query.dto';
import { CreateListingDto } from './dto/request/create-listing.dto';
import { UpdateListingDto } from './dto/request/update-listing.dto';
// import { AddFavoriteListingDto } from './dto/request/add-favorite-listing.dto';
import { Protected } from '@/common/decorators/protected.decorator';
// import {
//   ApiToggleFavoriteDocs,
//   // ApiGetFavoritesDocs,
// } from './decorators/api-toggle-favorite-docs.decorator';
import { StatusQueryDto } from './dto/request/status-query.dto';
import { ApiChangeStatusDocs } from './decorators/api-change-status-docs.decorator';
import { ChangeListingStatusDto } from './dto/request/change-listing-status.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { CreateListingApiDocs } from './decorators/api-create-listing-docs.decorator';
import { ApiListingQueryDocs } from './decorators/api-listing-query-docs.decorator';
import { ApiListingByIdDocs } from './decorators/api-listing-by-id-docs.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { MakeComplaintToListing } from './dto/request/make-complaint-to-listing.dto';
// import { GetFavoritesQueryDto } from './dto/request/get-favorites-query.dto';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get('')
  @ApiListingQueryDocs()
  async listingList(@Query() query: ListingQueryDto) {
    // if (query.search) {
    //   return this.listingsService.searchListing(query.search);
    // }
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

  // @Get('favorites')
  // // @ApiGetFavoritesDocs()
  // @Protected()
  // async getFavoritesUserListings(
  //   @CurrentUser() user: JwtPayload,
  //   @Query() query: GetFavoritesQueryDto,
  // ) {
  //   return await this.listingsService.getFavoritesUserListings(user.id, query);
  // }

  // @Post('favorites')
  // @Protected()
  // @ApiToggleFavoriteDocs()
  // async addListingToFavorite(
  //   @Body() body: AddFavoriteListingDto,
  //   @CurrentUser() user: JwtPayload,
  // ) {
  //   return await this.listingsService.addListingToFavorite(user.id, body);
  // }

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
  async changeListingStatus(@Body() body: ChangeListingStatusDto) {
    return await this.listingsService.listingPublishFromDraft(body);
  }

  @Post('complaint')
  @Protected()
  async makeComplaintToListing(
    @CurrentUser() user: JwtPayload,
    @Body() body: MakeComplaintToListing,
  ) {
    return await this.listingsService.makeComplaintToListing(user.id, body);
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
