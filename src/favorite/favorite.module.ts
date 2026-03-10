import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';
import { CacheService } from '@/cache/cacheService.service';

@Module({
  imports: [JwtAuthModule],
  controllers: [FavoriteController],
  providers: [FavoriteService, CacheService],
})
export class FavoriteModule {}
