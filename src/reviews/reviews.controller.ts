import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ApiCreateReviewDocs } from './decorators/api-create-review-docs.decorator';
import { ApiGetAllReviewsDocs } from './decorators/api-get-all-reviews-docs.decorator';
import { ApiGetReviewByIdDocs } from './decorators/api-get-review-by-id-docs.decorator';
import { ApiUpdateReviewDocs } from './decorators/api-update-review-docs.decorator';
import { ApiDeleteReviewDocs } from './decorators/api-delete-review-docs.decorator';
// import { AppLogger } from '@/common/logger/logger.service';
import { Admin, Protected } from '@/common/decorators';
import { PaginationDto } from '@/common/dto/pagintation.dto';
import { CreateReviewToUserDto } from '@/reviews/dto/create-review.to-user.dto';

// TODO: добавить логику для выставления лайков коментариям
// TODO: добавить логику удаления коментария
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    // private readonly logger: AppLogger,
  ) {}

  @Get('users')
  @Protected()
  async getUserReviews(
    @CurrentUser() user: JwtPayload,
    @Query() query: PaginationDto,
  ) {
    return await this.reviewsService.getUserReviews(user.id, query);
  }

  @Post('users')
  @Protected()
  async createReviewToUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateReviewToUserDto,
  ) {
    return await this.reviewsService.createReviewToUser(user.id, body);
  }

  // оставить комментарий к объявлению
  @Post('listings')
  @ApiCreateReviewDocs()
  @Protected()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, body);
  }

  // получить все коментарии к объявлению
  // TODO: limit, offset, has_photo, new_first, positive_rate_first
  @Get('listings/:listing_id')
  @ApiGetAllReviewsDocs()
  findAll(@Param('listing_id', ParseUUIDPipe) listing_id: string) {
    return this.reviewsService.findAll(listing_id);
  }

  @Get('listings/:id')
  @ApiGetReviewByIdDocs()
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  // обновляет текущий коментарий(только для админа)
  @Patch('listings/:id')
  @Admin()
  @ApiUpdateReviewDocs()
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete('listings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteReviewDocs()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(id);
  }
}
