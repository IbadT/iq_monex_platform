import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { CacheService } from '@/cache/cacheService.service';
import { Module } from '@nestjs/common';
import { FavoriteController } from './favorites.controller';
import { FavoriteService } from './favorites.service';

@Module({
  imports: [JwtAuthModule],
  controllers: [FavoriteController],
  providers: [FavoriteService, CacheService],
})
export class FavoritesModule {}
