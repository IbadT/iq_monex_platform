import { Controller, Post, Body, Headers, Get, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AppLogger } from '@/common/logger/logger.service';
import { Cron, CronExpression } from '@nestjs/schedule';
// import { Admin } from '@/common/decorators';
import { PaginationDto } from '@/common/dto/pagintation.dto';
import { Protected } from '@/common/decorators';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { JwtPayload } from '@/common/interfaces/jwt-payload.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateDonationDto } from './dto/create-donation.dto';
import { CreatePaymentApiDocs } from './docs/create-payment.api-docs';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly logger: AppLogger,
  ) {}

  @Post('create')
  @Protected()
  @CreatePaymentApiDocs
  async createPayment(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreatePaymentDto,
  ) {
    return await this.paymentsService.createPayment(user.id, body);
  }

  @Post('donate')
  @Protected()
  async createDonation(
    @CurrentUser() user: JwtPayload,
    @Body() body: CreateDonationDto,
  ) {
    return await this.paymentsService.createDonation(user.id, body);
  }

  @Get('donations')
  // @Admin()
  async donationList(@Query() query: PaginationDto) {
    return await this.paymentsService.donationList(query.limit, query.offset);
  }

  @Get('payments')
  async paymentList(@Query() query: PaginationDto) {
    const { limit, offset } = query;
    return await this.paymentsService.paymentList(limit, offset);
  }

  @Get('tariffs')
  @Protected()
  async tariffList(@CurrentUser() user: JwtPayload) {
    return await this.paymentsService.tariffList(user.id);
  }

  @Get('subscriptions')
  @Protected()
  async subscriptionList(@CurrentUser() user: JwtPayload) {
    return await this.paymentsService.subscriptionList(user.id);
  }

  @Get('subscription-period')
  @Protected()
  async subscriptionPeriodList(@CurrentUser() user: JwtPayload) {
    return await this.paymentsService.subscriptionPeriodList(user.id);
  }

  @Get('payment-item')
  @Protected()
  async paymentItemList(@CurrentUser() user: JwtPayload) {
    return await this.paymentsService.paymentItemList(user.id);
  }

  @Get('slot-package')
  @Protected()
  async slotPackageList(@CurrentUser() user: JwtPayload) {
    return await this.paymentsService.slotPackageList(user.id);
  }

  @Get('user-slot')
  @Protected()
  async userSlotList(@CurrentUser() user: JwtPayload) {
    return await this.paymentsService.userSlotList(user.id);
  }

  @Get('listing-slot')
  @Protected()
  async listingSlotList(@CurrentUser() user: JwtPayload) {
    return await this.paymentsService.listingSlotList(user.id);
  }

  //

  @Post('seed')
  @Protected()
  async seedData(@CurrentUser() user: JwtPayload) {
    return await this.paymentsService.seedData(user.id);
  }

  @Post('yookassa/webhook')
  async handleYookassaWebhook(
    @Headers('authorization') auth: string,
    @Body() payload: any,
  ) {
    // Проверка подписи(опционально)
    this.paymentsService.validateYookassaAuth(auth);
    return this.paymentsService.processWebhook(payload);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCronExpired() {
    this.logger.debug('Check expired in payment');
    return await this.paymentsService.handleCronExpired();
  }
}
