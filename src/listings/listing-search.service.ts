// src/search/services/listings-search.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  IndexRequest,
  IndexResponse,
  SearchRequest,
  // SearchResponse,
  DeleteRequest,
  DeleteResponse,
  UpdateRequest,
  UpdateResponse,
  BulkRequest,
  BulkResponse,
  QueryDslQueryContainer,
  SortCombinations,
} from '@elastic/elasticsearch/lib/api/types';
import {
  IListingSearchBody,
  // IListingSearchResult,
  IListingSearchResponse,
  ISearchListingsParams,
} from '@/search/interfaces/listing.search.interface';

@Injectable()
export class ListingsSearchService {
  private readonly logger = new Logger(ListingsSearchService.name);
  private readonly index = 'listings';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  /**
   * Индексация нового объявления
   */
  async indexListing(listing: IListingSearchBody): Promise<IndexResponse> {
    const params: IndexRequest<IListingSearchBody> = {
      index: this.index,
      id: listing.id,
      document: listing,
    };

    try {
      const response = await this.elasticsearchService.index(params);
      this.logger.log(`Listing indexed: ${listing.id}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to index listing ${listing.id}:`, error);
      throw error;
    }
  }

  /**
   * Поиск объявлений с фильтрами
   */
  async search(params: ISearchListingsParams): Promise<IListingSearchResponse> {
    const {
      text,
      subcategoryId,
      authorId,
      status = 'active',
      minPrice,
      maxPrice,
      location,
      tags,
      sort = [{ field: '_score', order: 'desc' }],
      pagination = { from: 0, size: 20 },
    } = params;

    // Строим bool query с правильной типизацией
    const must: QueryDslQueryContainer[] = [];
    const filter: QueryDslQueryContainer[] = [];

    // Текстовый поиск
    if (text?.trim()) {
      must.push({
        multi_match: {
          query: text,
          fields: ['title^3', 'content', 'tags'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    }

    // Фильтры
    filter.push({ term: { status } });

    if (subcategoryId) {
      filter.push({ term: { subcategoryId } });
    }

    if (authorId) {
      filter.push({ term: { authorId } });
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const range: Record<string, number> = {};
      if (minPrice !== undefined) range.gte = minPrice;
      if (maxPrice !== undefined) range.lte = maxPrice;
      filter.push({ range: { price: range } });
    }

    if (location) {
      filter.push({
        geo_distance: {
          distance: location.distance,
          location: {
            lat: location.lat,
            lon: location.lon,
          },
        },
      });
    }

    if (tags?.length) {
      filter.push({ terms: { tags } });
    }

    // Формируем sort с правильным типом
    const sortOptions: SortCombinations[] = sort.map((s) => ({
      [s.field]: s.order,
    }));

    const searchParams: SearchRequest = {
      index: this.index,
      from: pagination.from,
      size: pagination.size,
      query: {
        bool: {
          must: must.length > 0 ? must : [{ match_all: {} }],
          filter,
        },
      },
      sort: sortOptions,
    };

    try {
      const response =
        await this.elasticsearchService.search<IListingSearchBody>(
          searchParams,
        );

      // Приводим max_score к правильному типу (number | null)
      const maxScore: number | null = response.hits.max_score ?? null;

      return {
        hits: {
          total: response.hits.total as {
            value: number;
            relation: 'eq' | 'gte';
          },
          max_score: maxScore,
          hits: response.hits.hits.map((hit) => ({
            _index: hit._index,
            _id: hit._id!,
            _score: hit._score!,
            _source: hit._source as IListingSearchBody,
          })),
        },
        took: response.took,
        timed_out: response.timed_out,
      };
    } catch (error) {
      this.logger.error('Search failed:', error);
      throw error;
    }
  }

  /**
   * Обновление документа
   */
  async updateListing(
    id: string,
    partialDoc: Partial<IListingSearchBody>,
  ): Promise<UpdateResponse> {
    const params: UpdateRequest<
      IListingSearchBody,
      Partial<IListingSearchBody>
    > = {
      index: this.index,
      id,
      doc: partialDoc,
    };

    try {
      const response = await this.elasticsearchService.update(params);
      this.logger.log(`Listing updated: ${id}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to update listing ${id}:`, error);
      throw error;
    }
  }

  /**
   * Удаление документа из индекса
   */
  async removeListing(id: string): Promise<DeleteResponse> {
    const params: DeleteRequest = {
      index: this.index,
      id,
    };

    try {
      const response = await this.elasticsearchService.delete(params);
      this.logger.log(`Listing removed from index: ${id}`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to remove listing ${id}:`, error);
      throw error;
    }
  }

  /**
   * Массовая индексация
   */
  async bulkIndex(listings: IListingSearchBody[]): Promise<BulkResponse> {
    const operations = listings.flatMap((listing) => [
      { index: { _index: this.index, _id: listing.id } },
      listing,
    ]);

    const params: BulkRequest = {
      operations,
    };

    try {
      const response = await this.elasticsearchService.bulk(params);
      this.logger.log(`Bulk indexed ${listings.length} listings`);
      return response;
    } catch (error) {
      this.logger.error('Bulk indexing failed:', error);
      throw error;
    }
  }

  /**
   * Проверка существования индекса
   */
  async indexExists(): Promise<boolean> {
    return this.elasticsearchService.indices.exists({ index: this.index });
  }

  /**
   * Создание индекса с маппингом
   */
  async createIndex(): Promise<void> {
    const exists = await this.indexExists();
    if (exists) {
      this.logger.log(`Index ${this.index} already exists`);
      return;
    }

    await this.elasticsearchService.indices.create({
      index: this.index,
      mappings: {
        properties: {
          id: { type: 'keyword' },
          title: {
            type: 'text',
            analyzer: 'standard',
            fields: {
              keyword: { type: 'keyword' },
            },
          },
          content: { type: 'text', analyzer: 'standard' },
          authorId: { type: 'keyword' },
          categoryId: { type: 'keyword' },
          status: { type: 'keyword' },
          price: { type: 'float' },
          createdAt: { type: 'date' },
          updatedAt: { type: 'date' },
          location: { type: 'geo_point' },
          tags: { type: 'keyword' },
        },
      },
      settings: {
        number_of_shards: 1,
        number_of_replicas: 1,
      },
    });

    this.logger.log(`Index ${this.index} created`);
  }

  /**
   * Удаление индекса
   */
  async deleteIndex(): Promise<void> {
    const exists = await this.indexExists();
    if (!exists) return;

    await this.elasticsearchService.indices.delete({ index: this.index });
    this.logger.log(`Index ${this.index} deleted`);
  }
}
