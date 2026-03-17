import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ApiTags } from '@nestjs/swagger';
import { Protected } from '@/common/decorators';
import { ChangeListingSlotDto } from './dto/change-listing-slot.dto';
// import { SubscriptionServiceService } from './subscription_service.service';
// import { CreateSubscriptionServiceDto } from './dto/create-subscription_service.dto';
// import { UpdateSubscriptionServiceDto } from './dto/update-subscription_service.dto';

@ApiTags('Subscription service')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('change-slot')
  @Protected()
  async changeListingSlot(
    @CurrentUser() user: JwtPayload,
    @Body() body: ChangeListingSlotDto,
  ) {
    return await this.subscriptionService.changeListingSlot(user.id, body);
  }

  @Get('available-slots')
  @Protected()
  async getAvailableSlots(@CurrentUser() user: JwtPayload) {
    return await this.subscriptionService.getUserAvailableSlots(user.id);
  }

  @Get('user-slots')
  @Protected()
  async getUserSlots(@CurrentUser() user: JwtPayload) {
    return await this.subscriptionService.getUserSlots(user.id);
  }

  @Get('user-packages')
  @Protected()
  async getUserPackages(@CurrentUser() user: JwtPayload) {
    return await this.subscriptionService.getUserPackages(user.id);
  }
}
