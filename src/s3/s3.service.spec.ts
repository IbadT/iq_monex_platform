import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { ConfigService } from '@nestjs/config';

describe('S3Service', () => {
  let service: S3Service;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn()
        .mockReturnValue('test-value')
        .mockImplementation((key: string) => {
          const config: Record<string, string> = {
            AWS_ACCESS_KEY_ID: 'test-key',
            AWS_SECRET_ACCESS_KEY: 'test-secret',
            S3_BUCKET_NAME: 'test-bucket',
            S3_PATH_STYLE: 'https://test-endpoint.com',
          };
          return config[key] || null;
        }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
