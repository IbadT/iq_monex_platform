import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import { AppLogger } from '@/common/logger/logger.service';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService, logger: AppLogger) => {
        const username = configService.get('ELASTICSEARCH_USERNAME');
        const password = configService.get('ELASTICSEARCH_PASSWORD');

        const config: any = {
          node: configService.getOrThrow<string>('ELASTICSEARCH_NODE'),
        };

        if (username && password) {
          config.auth = {
            username,
            password,
          };
        }
        logger.log(`Elasticsearch успешно подключен к: ${config.node}`);
        return config;
      },
      inject: [ConfigService, AppLogger],
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
