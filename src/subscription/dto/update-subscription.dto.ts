import { PartialType } from '@nestjs/swagger';
import { CreateSubscriptionServiceDto } from './create-subscription.dto';

export class UpdateSubscriptionServiceDto extends PartialType(
  CreateSubscriptionServiceDto,
) {}
