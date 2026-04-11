import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { AppLogger } from '@/common/logger/logger.service';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [NotesController],
  providers: [NotesService, AppLogger],
  exports: [NotesService],
})
export class NotesModule {}
