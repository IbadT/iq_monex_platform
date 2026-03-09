import { Injectable } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { AppLogger } from '@/common/logger/logger.service';
// import { CreateReviewDto } from './dto/create-review.dto';
// import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly logger: AppLogger) {}

  async create(createReviewDto: CreateReviewDto) {
    this.logger.log(`This action adds a new review: BODY: ${createReviewDto}`);
    return 'This action adds a new review';
  }

  async findAll() {
    return `This action returns all reviews`;
  }

  async findOne(id: string) {
    return `This action returns a #${id} review`;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review, DTO: ${updateReviewDto}`;
  }

  async remove(id: string) {
    return `This action removes a #${id} review`;
  }
}
