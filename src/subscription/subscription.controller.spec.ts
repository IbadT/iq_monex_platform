import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionServiceController } from './subscription.controller';
import { SubscriptionServiceService } from './subscription.service';

describe('SubscriptionServiceController', () => {
  let controller: SubscriptionServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionServiceController],
      providers: [SubscriptionServiceService],
    }).compile();

    controller = module.get<SubscriptionServiceController>(
      SubscriptionServiceController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
