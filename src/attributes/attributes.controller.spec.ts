import { Test, TestingModule } from '@nestjs/testing';
import { AttributesController } from './attributes.controller';
import { AttributesService } from './attributes.service';
import { Language } from '@/dictionaries/dto/request/get-currency.dto';
import { JwtTokenService } from '@/auth/jwt/jwt.service';

describe('AttributesController', () => {
  let controller: AttributesController;
  let attributesService: jest.Mocked<AttributesService>;

  beforeEach(async () => {
    const mockAttributeService = {
      list: jest.fn(),
      seedSpecifications: jest.fn(),
    };

    const mockJwtTokenService = {
      issueTokens: jest.fn(),
      verifyToken: jest.fn(),
      decodeToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttributesController],
      providers: [
        {
          provide: AttributesService,
          useValue: mockAttributeService,
        },
        {
          provide: JwtTokenService,
          useValue: mockJwtTokenService,
        },
      ],
    }).compile();

    controller = module.get<AttributesController>(AttributesController);
    attributesService = module.get(AttributesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('specificationList', () => {
    it('should return specification list', async () => {
      const lang = Language.RU;
      const mockSpecificationList = [
        {
          id: 1,
          name: 'Название',
          isCustom: false,
        },
      ];

      attributesService.list.mockResolvedValue(mockSpecificationList);

      const result = await controller.specificationList({ lang });
      expect(result).toEqual(mockSpecificationList);
    });
  });
});
