import { Module } from '@nestjs/common';
import { TariffsService } from './tariffs.service';
import { TariffsController } from './tariffs.controller';
import { LoggerModule } from '@/common/logger/logger.module';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [LoggerModule, JwtAuthModule],
  controllers: [TariffsController],
  providers: [TariffsService],
  exports: [TariffsService],
})
export class TariffsModule {}
