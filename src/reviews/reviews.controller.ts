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
import { ApiCreateReviewToUserDocs } from './decorators/api-create-review-to-user-docs.decorator';
import { ApiGetUserReviewsDocs } from './decorators/api-get-user-reviews-docs.decorator';
// import { AppLogger } from '@/common/logger/logger.service';
import { Admin, Protected } from '@/common/decorators';
import { CreateReviewToUserDto } from '@/reviews/dto/create-review.to-user.dto';
import { GetReviewsDto } from './dto/response/get-reviews.dto';
import { CreateReviesResponseDto } from './dto/response/create-reviews-response.dto';
import { ReviewResponseDto } from './dto/response/review-by-id-response.dto';
import { ListingReviewsQueryDto } from './dto/request/listing-reviews-query.dto';
import { UserReviewsQueryDto } from './dto/request/user-reviews-query.dto';

// TODO: добавить логику для выставления лайков коментариям
// TODO: добавить логику удаления коментария
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    // private readonly logger: AppLogger,
  ) {}

  @Get('users/:id')
  @ApiGetUserReviewsDocs()
  async getUserReviews(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: UserReviewsQueryDto,
    @CurrentUser() user?: JwtPayload,
  ): Promise<GetReviewsDto[]> {
    return await this.reviewsService.getUserReviews(id, query, user?.id);
  }

  @Post('users')
  @Protected()
  @ApiCreateReviewToUserDocs()
  async createReviewToUser(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateReviewToUserDto,
  ): Promise<CreateReviesResponseDto> {
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
  ): Promise<CreateReviesResponseDto> {
    return this.reviewsService.create(user.id, body);
  }

  // получить все коментарии к объявлению
  @Get('listings')
  @ApiGetAllReviewsDocs()
  findAll(
    @Query() query: ListingReviewsQueryDto,
    @CurrentUser() user?: JwtPayload,
  ): Promise<GetReviewsDto[]> {
    return this.reviewsService.findAll(query, user?.id);
  }

  @Get('listings/:id')
  @ApiGetReviewByIdDocs()
  findOne(@Param('id') id: string): Promise<ReviewResponseDto> {
    return this.reviewsService.findOne(id);
  }

  // обновляет текущий коментарий(только для админа)
  @Patch('listings/:id')
  @Admin()
  @ApiUpdateReviewDocs()
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<CreateReviesResponseDto> {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete('listings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteReviewDocs()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(id);
  }
}
