import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

// Строгие типы для Elasticsearch
interface ElasticsearchQuery {
  query?: {
    match?: Record<string, string | number>;
    term?: Record<string, string | number>;
    bool?: {
      must?: ElasticsearchQuery[];
      should?: ElasticsearchQuery[];
      must_not?: ElasticsearchQuery[];
      filter?: ElasticsearchQuery[];
    };
    range?: Record<string, { gte?: number; lte?: number; gt?: number; lt?: number }>;
  };
  sort?: Record<string, { order: 'asc' | 'desc' }>;
  from?: number;
  size?: number;
  highlight?: {
    fields: Record<string, {}>;
  };
  aggs?: Record<string, {
    terms?: { field: string; size?: number };
    avg?: { field: string };
    sum?: { field: string };
    min?: { field: string };
    max?: { field: string };
  }>;
}

interface ElasticsearchResponse<T> {
  hits: {
    total: {
      value: number;
      relation: string;
    };
    hits: Array<{
      _index: string;
      _id: string;
      _score: number;
      _source: T;
      highlight?: Record<string, string[]>;
    }>;
  };
  aggregations?: Record<string, {
    buckets?: Array<{
      key: string;
      doc_count: number;
    }>;
    value?: number;
  }>;
}

interface ElasticsearchIndexParams<T extends Record<string, any>> {
  index: string;
  id: string;
  body: T;
  refresh?: boolean;
}

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  /**
   * Поиск документов с полной типизацией
   */
  async search<T extends Record<string, any>>(
    index: string, 
    query: ElasticsearchQuery
  ): Promise<ElasticsearchResponse<T>> {
    try {
      const result = await this.elasticsearchService.search<ElasticsearchResponse<T>>({
        index,
        body: query as any,
      });

      const total = typeof result.hits?.total === 'object' 
        ? result.hits.total.value 
        : result.hits?.total || 0;

      this.logger.log(`Search in index ${index}: ${total} documents found`);
      return result as unknown as ElasticsearchResponse<T>;
    } catch (error) {
      this.logger.error(`Search error in index ${index}:`, error);
      throw error;
    }
  }

  /**
   * Индексация документа с полной типизацией
   */
  async indexDocument<T extends Record<string, any>>(
    index: string, 
    id: string, 
    document: T
  ): Promise<any> {
    try {
      const params: ElasticsearchIndexParams<T> = {
        index,
        id,
        body: document,
        refresh: true,
      };

      const result = await this.elasticsearchService.index(params as any);

      this.logger.log(`Document indexed: ${index}/${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Indexing error for ${index}/${id}:`, error);
      throw error;
    }
  }
}
