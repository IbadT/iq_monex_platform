import { Module } from '@nestjs/common';
import { PromoCompaignService } from './promo_compaign.service';
import { PromoController } from './promo.controller';
import { PromoParticipantService } from './promo_participant.service';
import { JwtAuthModule } from '@/auth/jwt/jwt.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [PromoController],
  providers: [PromoCompaignService, PromoParticipantService],
  exports: [PromoParticipantService],
})
export class PromoModule {}
