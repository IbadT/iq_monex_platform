import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PromoCompaignService } from './promo_compaign.service';
import { PromoParticipantService } from './promo_participant.service';
import { CreatePromoCompaignDto } from './dto/create-promo_compaign.dto';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Cron, CronExpression } from '@nestjs/schedule';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Admin, Protected } from '@/common/decorators';
import { PromoCampaignStatus } from './enums/promo-status.enum';

@Controller('promo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PromoController {
  constructor(
    private readonly promoCompaignService: PromoCompaignService,
    private readonly promoParticipantService: PromoParticipantService,
  ) {}

  // Создание акции (только админ)
  @Post('campaign')
  // @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @Protected()
  @Admin()
  async create(@Body() dto: CreatePromoCompaignDto) {
    return await this.promoCompaignService.create(dto);
  }

  // Список активных акций (только админ)
  @Get('campaign')
  // @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @Protected()
  @Admin()
  async promoCampaignsList() {
    return await this.promoCompaignService.promoCompaignsList();
  }

  // Подсчёт участников (только админ)
  @Get('campaign/count')
  // @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @Protected()
  @Admin()
  async promoCampaignCount() {
    return await this.promoCompaignService.promoCompaignCount();
  }

  // Изменение статуса кампании (только админ)
  @Patch('campaign/:id/status')
  // @Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
  @Protected()
  @Admin()
  async changeStatus(
    @Param('id') id: string,
    @Body() body: { status: PromoCampaignStatus },
  ) {
    return await this.promoCompaignService.changeStatus(id, body.status);
  }

  // Статус пользователя (для авторизованного пользователя)
  @Get('status')
  @Protected()
  async getUserStatus(@CurrentUser() user: JwtPayload) {
    return await this.promoCompaignService.getUserStatus(user.id);
  }

  // Использование скидки 50% на второй год
  @Post('use-discount')
  @Protected()
  async useDiscount(@CurrentUser() user: JwtPayload) {
    return await this.promoParticipantService.useDiscount(user.id);
  }

  // Cron для проверки кампаний (ежедневно)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCampaignSwitch() {
    await this.promoCompaignService.checkAndSwitchCampaigns();
  }

  // Cron для проверки условий участников (ежедневно)
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async checkParticipantConditions() {
    await this.promoParticipantService.checkParticipantConditions();
  }
}
