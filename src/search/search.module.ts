import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        node: configService.getOrThrow<string>('ELASTICSEARCH_NODE'),
        // auth: {
        //   username: configService.getOrThrow('ELASTICSEARCH_USERNAME'),
        //   password: configService.getOrThrow('ELASTICSEARCH_PASSWORD'),
        // }
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
