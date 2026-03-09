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
import { FavoriteService } from '@/favorite/favorite.service';
import { ReviewsService } from '@/reviews/reviews.service';
import { CreateReviewDto } from '@/reviews/dto/create-review.dto';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly favoritesService: FavoriteService,
    private readonly reviewsService: ReviewsService,
  ) {}

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

  @Post('')
  async listingPublishFromDraft(@Param('id', ParseUUIDPipe) id: string) {
    return await this.listingsService.listingPublishFromDraft(id);
  }

  // добавить в избранное
  @Post('favorite')
  async addListingToFavorite() {
    return await this.favoritesService.create();
  }

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

  // получить все коментарии к объявлению
  @Get('reviews')
  async getReviews() {
    return await this.reviewsService.findAll();
  }

  // оставить комментарий к объявлению
  @Post('reviews')
  async addReview(@Body() body: CreateReviewDto) {
    return await this.reviewsService.create(body);
  }

  // удалить комментрий
  @Delete('reviews/:id')
  async deleteReview(@Param('id', ParseUUIDPipe) id: string) {
    return await this.reviewsService.remove(id);
  }

  // редактировать объявление
  @Patch('edit/:id')
  async editListingById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.listingsService.editListingById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteListingById(
    @Query() query: StatusQueryDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.listingsService.deleteListingById(id, query);
  }

  // объявления по фильтрам + elasticsearch

  // получить рекомендованные объявления при просмотре объявления

  // отправить жалобу на объявление

  //

  // ??? получить подробную информацию по объявлению ???

  // ??? ЗАМЕТКИ ???
}
