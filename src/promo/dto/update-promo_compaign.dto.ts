import { PartialType } from '@nestjs/swagger';
import { CreatePromoCompaignDto } from './create-promo_compaign.dto';

export class UpdatePromoCompaignDto extends PartialType(
  CreatePromoCompaignDto,
) {}
