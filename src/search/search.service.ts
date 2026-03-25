import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { AppLogger } from '@/common/logger/logger.service';
import { PrismaClient } from 'prisma/generated/client';

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
    range?: Record<
      string,
      { gte?: number; lte?: number; gt?: number; lt?: number }
    >;
  };
  sort?: Record<string, { order: 'asc' | 'desc' }>;
  from?: number;
  size?: number;
  highlight?: {
    fields: Record<string, {}>;
  };
  aggs?: Record<
    string,
    {
      terms?: { field: string; size?: number };
      avg?: { field: string };
      sum?: { field: string };
      min?: { field: string };
      max?: { field: string };
    }
  >;
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
  aggregations?: Record<
    string,
    {
      buckets?: Array<{
        key: string;
        doc_count: number;
      }>;
      value?: number;
    }
  >;
}

interface ElasticsearchIndexParams<T extends Record<string, any>> {
  index: string;
  id: string;
  body: T;
  refresh?: boolean;
}

@Injectable()
export class SearchService {
  private readonly logger: AppLogger;

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    logger: AppLogger,
  ) {
    this.logger = logger;
  }

  /**
   * Поиск документов с полной типизацией
   */
  async search<T extends Record<string, any>>(
    index: string,
    query: ElasticsearchQuery,
  ): Promise<ElasticsearchResponse<T>> {
    try {
      const result = await this.elasticsearchService.search<
        ElasticsearchResponse<T>
      >({
        index,
        body: query as any,
      });

      const total =
        typeof result.hits?.total === 'object'
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
    document: T,
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

  /**
   * Индексация профиля пользователя в Elasticsearch
   */
  async indexProfile(profile: any, tx: PrismaClient) {
    try {
      // Получаем данные через User (проще и логичнее)
      const userWithProfile = await tx.user.findUnique({
        where: { id: profile.userId },
        include: {
          profile: {
            include: {
              legalEntityType: true,
              currency: true,
            },
          },
          receivedReviews: {
            select: {
              rating: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 10,
          },
        },
      });

      if (!userWithProfile) {
        this.logger.warn(`User ${profile.userId} not found for indexing`);
        return;
      }

      // Получаем активности пользователя через UserActivity
      const userActivities = await tx.userActivity.findMany({
        where: { userId: userWithProfile.id },
        include: {
          activity: true,
        },
      });

      // Подготавливаем документ для индексации
      const profileDocument = {
        id: profile.id,
        userId: userWithProfile.id,
        name: userWithProfile.name,
        description: userWithProfile.profile?.description,
        phone: userWithProfile.profile?.phone || '',
        email: userWithProfile.profile?.email || '',
        telegram: userWithProfile.profile?.telegram || '',
        siteUrl: userWithProfile.profile?.siteUrl || '',
        legalEntityTypeId: userWithProfile.profile?.legalEntityTypeId,
        currencyId: userWithProfile.profile?.currencyId,
        avatarUrl: userWithProfile.profile?.avatarUrl || '',
        averageRating: userWithProfile.rating || 0,
        reviewsCount: userWithProfile.reviewsCount || 0,
        activities: userActivities.map((ua: any) => ({
          id: ua.activityId,
          name: ua.activity.name,
        })),
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      };

      // Индексируем в Elasticsearch
      await this.indexDocument('profiles', profile.id, profileDocument);

      this.logger.log(`✅ Profile ${profile.id} indexed in Elasticsearch`);
    } catch (error) {
      this.logger.error(`❌ Failed to index profile ${profile.id}:`, error);
    }
  }
}
