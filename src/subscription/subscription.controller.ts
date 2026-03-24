import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { ApiTags } from '@nestjs/swagger';
import { Protected } from '@/common/decorators';
import { ChangeListingSlotDto } from './dto/change-listing-slot.dto';
import { ApiChangeSlotDocs } from './decorators/api-change-slot-docs.decorator';
import { ApiGetAvailableSlotsDocs } from './decorators/api-get-available-slots-docs.decorator';
import { ApiGetUserSlotsDocs } from './decorators/api-get-user-slots-docs.decorator';
import { ApiGetUserPackagesDocs } from './decorators/api-get-user-packages-docs.decorator';
import { ChangeSlotResponseDto } from './dto/response/change-slot-response.dto';
import { GetAvailableSlotResponseDto } from './dto/response/get-available-slot-response.dto';
import { SlotPackageResponseDto } from './dto/response/slot-package-response.dto';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('change-slot')
  @Protected()
  @ApiChangeSlotDocs()
  async changeListingSlot(
    @CurrentUser() user: JwtPayload,
    @Body() body: ChangeListingSlotDto,
  ): Promise<ChangeSlotResponseDto> {
    return await this.subscriptionService.changeListingSlot(user.id, body);
  }

  @Get('available-slots')
  @Protected()
  @ApiGetAvailableSlotsDocs()
  async getAvailableSlots(
    @CurrentUser() user: JwtPayload,
  ): Promise<GetAvailableSlotResponseDto[]> {
    return await this.subscriptionService.getUserAvailableSlots(user.id);
  }

  @Get('user-slots')
  @Protected()
  @ApiGetUserSlotsDocs()
  async getUserSlots(
    @CurrentUser() user: JwtPayload,
  ): Promise<GetAvailableSlotResponseDto[]> {
    return await this.subscriptionService.getUserSlots(user.id);
  }

  @Get('user-packages')
  @Protected()
  @ApiGetUserPackagesDocs()
  async getUserPackages(
    @CurrentUser() user: JwtPayload,
  ): Promise<SlotPackageResponseDto[]> {
    return await this.subscriptionService.getUserPackages(user.id);
  }
}
