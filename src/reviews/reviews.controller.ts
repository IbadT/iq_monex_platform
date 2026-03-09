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
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
// import { ListingsService } from '@/listings/listings.service';
// import { ListingStatus } from '@/listings/enums/listing-status.enum';
// import { StatusQueryDto } from '@/listings/dto/request/status-query.dto';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ApiCreateReviewDocs } from './decorators/api-create-review-docs.decorator';
import { ApiGetAllReviewsDocs } from './decorators/api-get-all-reviews-docs.decorator';
import { ApiGetReviewByIdDocs } from './decorators/api-get-review-by-id-docs.decorator';
import { ApiUpdateReviewDocs } from './decorators/api-update-review-docs.decorator';
import { ApiDeleteReviewDocs } from './decorators/api-delete-review-docs.decorator';
// import { AppLogger } from '@/common/logger/logger.service';
import { Admin, Protected } from '@/common/decorators';

@Controller('reviews')
export class ReviewsController {
  constructor(
    // private readonly listingsService: ListingsService,
    private readonly reviewsService: ReviewsService,
    // private readonly logger: AppLogger,
  ) {}

  // добавить комментарий к объявлению
  @Post()
  @ApiCreateReviewDocs()
  @Protected()
  async create(
    @CurrentUser() user: JwtPayload,
    @Body()
    body: CreateReviewDto,
  ) {
    return this.reviewsService.create(user.id, body);
  }

  @Get()
  @ApiGetAllReviewsDocs()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiGetReviewByIdDocs()
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @Admin()
  @ApiUpdateReviewDocs()
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteReviewDocs()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(id);
  }
}
