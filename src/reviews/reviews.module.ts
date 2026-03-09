import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ListingsService } from '@/listings/listings.service';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ListingsService],
})
export class ReviewsModule {}
