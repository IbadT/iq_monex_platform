import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
