import { Module } from '@nestjs/common';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { CacheService } from '@/cache/cacheService.service';
import { FavoriteService } from '@/favorite/favorite.service';
import { ReviewsService } from '@/reviews/reviews.service';
import { ListingLikesService } from './listing-likes.service';

@Module({
  imports: [JwtAuthModule],
  controllers: [ListingsController],
  providers: [ListingsService, FavoriteService, ReviewsService, CacheService, ListingLikesService],
})
export class ListingsModule {}
