import { Test, TestingModule } from '@nestjs/testing';
import { MapLocationsController } from './map_locations.controller';
import { MapLocationsService } from './map_locations.service';

describe('MapLocationsController', () => {
  let controller: MapLocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MapLocationsController],
      providers: [MapLocationsService],
    }).compile();

    controller = module.get<MapLocationsController>(MapLocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
