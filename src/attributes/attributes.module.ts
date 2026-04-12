import { Module } from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { AttributesController } from './attributes.controller';
import { CacheService } from '@/cache/cacheService.service';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [AttributesController],
  providers: [AttributesService, CacheService],
})
export class AttributesModule {}
