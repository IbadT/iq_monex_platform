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
  NotFoundException,
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
import { SendLikeDto } from './dto/request/send-like.dto';
import { ListingLikesService } from './listing-likes.service';
import { ApiToggleLikeDocs } from './decorators/api-toggle-like-docs.decorator';
import { ApiRemoveLikeDocs } from './decorators/api-remove-like-docs.decorator';
import { ApiGetListingLikesDocs } from './decorators/api-get-listing-likes-docs.decorator';
import { ApiCheckUserLikeDocs } from './decorators/api-check-user-like-docs.decorator';
import { ApiGetUserLikesDocs } from './decorators/api-get-user-likes-docs.decorator';
import { ApiChangeStatusDocs } from './decorators/api-change-status-docs.decorator';
import { ChangeListingStatusDto } from './dto/request/change-listing-status.dto';
import { ListingStatus } from './enums/listing-status.enum';

@Controller('listings')
export class ListingsController {
  constructor(
    private readonly listingsService: ListingsService,
    private readonly favoritesService: FavoriteService,
    private readonly reviewsService: ReviewsService,
    private readonly listingLikesService: ListingLikesService,
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

  @Post('publish')
  async listingPublishFromDraft(@Param('id', ParseUUIDPipe) id: string) {
    return await this.listingsService.listingPublishFromDraft(id);
  }

  // добавить в избранное
  // изменить статус объявления
  @Post('change-status')
  @ApiChangeStatusDocs()
  @Protected()
  async addListingToFavorite(@Body() body: ChangeListingStatusDto) {
    return await this.favoritesService.create(body);
  }

  @Post('likes')
  @ApiToggleLikeDocs()
  @Protected()
  async toggleLike(@Body() body: SendLikeDto, @CurrentUser() user: JwtPayload) {
    return await this.listingLikesService.toggleLike(body.listing_id, user.id);
  }

  @Delete('likes/:listingId')
  @ApiRemoveLikeDocs()
  @Protected()
  async removeLike(
    @Param('listingId', ParseUUIDPipe) listingId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.listingLikesService.removeLike(listingId, user.id);
  }

  @Get('likes/:listingId')
  @ApiGetListingLikesDocs()
  async getListingLikes(@Param('listingId', ParseUUIDPipe) listingId: string) {
    return await this.listingLikesService.getListingLikes(listingId);
  }

  // TODO: limit, offset, has_photo, new_first, positive_rate_first
  @Get(':listingId/comments')
  async getListingComments(
    @Param('listingId', ParseUUIDPipe) listingId: string,
  ) {
    return await this.reviewsService.findByListingId(listingId);
  }

  // TODO: можно убрать
  @Get('likes/:listingId/check')
  @ApiCheckUserLikeDocs()
  @Protected()
  async checkUserLike(
    @Param('listingId', ParseUUIDPipe) listingId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.listingLikesService.hasUserLiked(listingId, user.id);
  }

  @Get('users/:userId/likes')
  @ApiGetUserLikesDocs()
  async getUserLikes(@Param('userId', ParseUUIDPipe) userId: string) {
    return await this.listingLikesService.getUserLikes(userId);
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
  async addReview(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateReviewDto,
  ) {
    const hasListing = await this.listingsService.hasListing(
      body.listingId,
      new StatusQueryDto(ListingStatus.PUBLISHED),
    );
    if (!hasListing) {
      throw new NotFoundException(
        `Объявления с id: ${body.listingId} не найдено`,
      );
    }
    return await this.reviewsService.create(user.id, body);
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
