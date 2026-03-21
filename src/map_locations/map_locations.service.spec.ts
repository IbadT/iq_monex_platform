import { Test, TestingModule } from '@nestjs/testing';
import { MapLocationsService } from './map_locations.service';

describe('MapLocationsService', () => {
  let service: MapLocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MapLocationsService],
    }).compile();

    service = module.get<MapLocationsService>(MapLocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
