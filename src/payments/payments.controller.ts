import { Controller, Post, Body, Headers } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AppLogger } from '@/common/logger/logger.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly logger: AppLogger,
  ) {}

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
  // @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCronExpired() {
    this.logger.debug('Check expired in payment');
    return await this.paymentsService.handleCronExpired();
  }

  // @Post()
  // create(@Body() createPaymentDto: CreatePaymentDto) {
  //   return this.paymentsService.create(createPaymentDto);
  // }

  // @Get()
  // findAll() {
  //   return this.paymentsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
  //   return this.paymentsService.update(+id, updatePaymentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.paymentsService.remove(+id);
  // }
}
