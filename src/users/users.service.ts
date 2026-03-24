import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { prisma } from '@/lib/prisma';
import { CacheService } from '@/cache/cacheService.service';
import { WorkersService } from '@/workers/workers.service';
import { MapLocationsService } from '@/map_locations/map_locations.service';
import { ActivitiesService } from '@/activities/activities.service';
import { SearchService } from '@/search/search.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { AppLogger } from '@/common/logger/logger.service';
import { RoleType } from './enums/role-type.enum';
import { roles } from './default/roleData';
import { ComplaintType } from './enums/complaint-type.enum';
import { PaginationDto } from '@/common/dto/pagintation.dto';

// Mock for prisma generated client
let FileKind: any;
try {
  const prismaClient = require('prisma/generated/client');
  FileKind = prismaClient.FileKind;
} catch (error) {
  // Mock for tests
  FileKind = {
    DOCUMENT: 'DOCUMENT',
    PHOTO: 'PHOTO',
  };
}

type PrismaClient = any;
import { GetProfilesDto } from './dto/get-profiles.dto';
import { MakeComplaintToUserDto } from './dto/make-complaint-to-user.dto';
import {
  GetAllProfilesResponseDto,
  PaginationResponseDto,
} from './dto/response/profile-response.dto';
import { ProfileMapper } from './mappers/profile.mapper';
import { FullProfileResponseDto } from './dto/response/full-profile-response.dto';
import { FavoriteType } from '@/favorites/enums/favorite-type.enum';
import { UserResponseDto } from './dto/response/user-response.dto';
import { UserMapper } from './mappers/user.mapper';
import { ComplaintResponseDto } from './dto/response/complaint-response.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly cacheService: CacheService,
    private readonly logger: AppLogger,
    private readonly workersService: WorkersService,
    private readonly mapLocationsService: MapLocationsService,
    private readonly activitiesService: ActivitiesService,
    private readonly searchService: SearchService,
  ) {}

  async searchProfiles(
    query: GetProfilesDto,
  ): Promise<GetAllProfilesResponseDto> {
    const startTime = Date.now();
    const {
      limit = 10,
      offset = 0,
      query: search,
      ratingMin,
      activityIds,
    } = query;

    this.logger.log(
      `🔍 Profile search request: ${JSON.stringify({ search, ratingMin, activityIds, limit, offset })}`,
    );

    // Если нет поискового запроса и фильтров, используем обычный поиск из БД
    if (!search && ratingMin === null && !activityIds) {
      this.logger.log('📄 No search query provided, using database search');
      return await this.getProfilesFromDB(query);
    }

    try {
      this.logger.log(
        `🚀 Starting Elasticsearch profile search for: "${search || 'all'}"`,
      );

      // Строим Elasticsearch query
      const esQuery: any = {
        query: {
          bool: {
            must: [],
            filter: [],
          },
        },
        from: offset,
        size: limit,
        sort: [{ createdAt: { order: 'desc' } }, { _score: { order: 'desc' } }],
      };

      // Добавляем полнотекстовый поиск
      if (search) {
        esQuery.query.bool.must.push({
          multi_match: {
            query: search,
            fields: ['user.name^3', 'description^2', 'phone^1.5', 'email^1.5'],
            type: 'best_fields',
            fuzziness: 'AUTO',
            operator: 'and',
          },
        });
        this.logger.log(
          `📝 Multi-match query configured for fields: user.name^3, description^2, phone^1.5, email^1.5`,
        );
      }

      // Добавляем фильтр по рейтингу
      if (ratingMin !== null) {
        esQuery.query.bool.filter.push({
          range: {
            averageRating: {
              gte: ratingMin,
            },
          },
        });
        this.logger.log(`🎯 Rating filter applied: >= ${ratingMin}`);
      }

      // Добавляем фильтр по активностям
      if (activityIds && activityIds.length > 0) {
        esQuery.query.bool.filter.push({
          terms: {
            'activities.activityId': activityIds,
          },
        });
        this.logger.log(
          `🎯 Activities filter applied: ${activityIds.join(', ')}`,
        );
      }

      // Если нет must условий, добавляем match_all
      if (esQuery.query.bool.must.length === 0) {
        esQuery.query.bool.must.push({ match_all: {} });
      }

      this.logger.log(`🔍 Elasticsearch query: ${JSON.stringify(esQuery)}`);

      // Выполняем поиск в Elasticsearch
      const esStartTime = Date.now();
      const result = await this.searchService.search('profiles', esQuery);
      const esDuration = Date.now() - esStartTime;

      this.logger.log(
        `⚡ Elasticsearch search completed in ${esDuration}ms, found ${result.hits.total.value} documents`,
      );

      // Получаем ID найденных документов
      const profileIds = result.hits.hits.map((hit) => hit._source.id);

      if (!profileIds.length) {
        const totalDuration = Date.now() - startTime;
        this.logger.log(`📭 No results found in ${totalDuration}ms`);

        return new GetAllProfilesResponseDto(
          [],
          new PaginationResponseDto(0, limit, offset),
        );
      }

      this.logger.log(
        `📋 Found ${profileIds.length} profile IDs: ${profileIds.slice(0, 5).join(', ')}${profileIds.length > 5 ? '...' : ''}`,
      );

      // Получаем полные данные из Prisma для найденных ID
      const dbStartTime = Date.now();

      const profiles = await prisma.profile.findMany({
        where: {
          id: { in: profileIds },
        },
        include: {
          user: {
            include: {
              userActivities: {
                include: {
                  activity: true,
                },
              },
            },
          },
          legalEntityType: true,
          currency: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const dbDuration = Date.now() - dbStartTime;

      this.logger.log(
        `🗄️ Database query completed in ${dbDuration}ms, retrieved ${profiles.length} full profiles`,
      );

      // Сортируем профили в том же порядке, что и из Elasticsearch
      const sortedProfiles = profileIds
        .map((id) => profiles.find((profile) => profile.id === id))
        .filter(
          (profile): profile is NonNullable<typeof profile> =>
            profile !== undefined,
        );

      const totalDuration = Date.now() - startTime;
      this.logger.log(
        `✅ Profile search completed successfully in ${totalDuration}ms (ES: ${esDuration}ms, DB: ${dbDuration}ms)`,
      );

      // Используем маппер для преобразования в DTO
      return ProfileMapper.toGetAllResponse(
        sortedProfiles,
        result.hits.total.value,
        limit,
        offset,
      );
    } catch (error) {
      const totalDuration = Date.now() - startTime;
      this.logger.error(
        `❌ Elasticsearch profile search error after ${totalDuration}ms:`,
        error,
      );

      // В случае ошибки Elasticsearch, fallback к обычному поиску в БД
      this.logger.warn(
        '🔄 Falling back to database search due to Elasticsearch error',
      );
      return await this.getProfilesFromDB(query);
    }
  }

  async getProfilesFromDB(
    query: GetProfilesDto,
  ): Promise<GetAllProfilesResponseDto> {
    const dbQuery: any = {
      take: query.limit,
      skip: query.offset,
      include: {
        legalEntityType: true,
        currency: true,
        user: {
          include: {
            userActivities: {
              include: {
                activity: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    // Добавляем where условия
    if (query.query) {
      dbQuery.where = {
        ...dbQuery.where,
        user: {
          name: {
            contains: query.query,
            mode: 'insensitive',
          },
        },
      };
    }

    if (query.activityIds && query.activityIds.length > 0) {
      dbQuery.where = {
        ...dbQuery.where,
        user: {
          userActivities: {
            some: {
              activityId: {
                in: query.activityIds,
              },
            },
          },
        },
      };
    }

    const [profiles, total] = await Promise.all([
      prisma.profile.findMany(dbQuery),
      prisma.profile.count({ where: dbQuery.where }),
    ]);

    return ProfileMapper.toGetAllResponse(
      profiles,
      total,
      query.limit,
      query.offset,
    );
  }

  async getUserReviews(userId: string, query: PaginationDto) {
    return await prisma.review.findMany({
      where: {
        targetUserId: userId,
      },
      take: query.limit,
      skip: query.offset,
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    // Сначала пытаемся получить из кэша
    const cachedUser = await this.cacheService.getUserByEmail(email);

    if (cachedUser) {
      return cachedUser;
    }

    // Если нет в кэше, получаем из БД
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Сохраняем в кэш на 1 час
    if (user) {
      const userEntity = User.fromUpdateUserDto(user, null);

      // await this.cacheService.setUserByEmail(email, userEntity, 3600);
      return userEntity;
    }

    return null;
  }

  // Внутренний метод для получения пользователя с паролем (для аутентификации)
  async getUserByEmailWithPassword(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  async getUserById(id: string) {
    return await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async getProfileById(
    userId: string,
    id: string,
  ): Promise<FullProfileResponseDto> {
    // const cachedUser = await this.cacheService.getUserById(id);

    // if (cachedUser) {
    //   return cachedUser;
    // }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            legalEntityType: true,
            currency: true,
          },
        },
        userActivities: {
          include: {
            activity: true,
          },
        },
        files: {
          where: {
            kind: FileKind.AVATAR,
            uploadStatus: 'completed',
          },
        },
        workers: {
          include: {
            role: true,
          },
          where: {
            isActive: true,
          },
        },
        locations: {
          where: {
            userId: id,
          },
        },
        receivedReviews: {
          where: {
            status: 'APPROVED',
          },
          select: {
            rating: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        // favorites: {
        //   where: {
        //     // userId: currentUserId,
        //     userId: id,
        //     targetUserId: id,
        //     type: FavoriteType.USER,
        //   },
        // },
        favorites: id
          ? {
              where: {
                userId: id,
                targetUserId: id,
                type: FavoriteType.USER,
              },
              take: 1, // Добавляем take, чтобы не получать массив
            }
          : false, // Используем false вместо undefined
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с id: ${id} не найден`);
    }

    // Преобразуем в DTO
    const fullProfile = ProfileMapper.toFullResponse(user, userId);

    // Кешируем
    // await this.cacheService.setUserById(id, fullProfile, 3600);
    // await this.cacheService.setUserById(id, fullProfile, 3600);

    return fullProfile;
  }

  async getUserByAccountNumber(
    accountNumber: string,
  ): Promise<UserResponseDto> {
    const user = await prisma.user.findUnique({
      where: {
        accountNumber,
      },
      include: {
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        `Пользователь с номером аккаунта ${accountNumber} не найден`,
      );
    }

    return UserMapper.toUserResponse(user);
  }

  // async getUserFavoritesProfiles(userId: string) {
  //   return await prisma.favorite.findMany({
  //     where: {
  //       userId,
  //       type: FavoriteType.USER,
  //     },
  //   });
  // }

  async makeComplaintToUser(
    userId: string,
    body: MakeComplaintToUserDto,
  ): Promise<ComplaintResponseDto> {
    const checkComplaintAlreadyExist = await prisma.complaint.findFirst({
      where: {
        authorId: userId,
      },
    });

    if (checkComplaintAlreadyExist) {
      throw new ConflictException('Вы уже подали жалобу на этот профиль');
    }

    return await prisma.complaint.create({
      data: {
        complaintType: ComplaintType.USER,
        type: body.type,
        text: body.text,
        authorId: userId,
        targetUserId: body.userId,
      },
      select: {
        id: true,
      },
    });
  }

  async createUser(data: {
    email: string;
    accountNumber: string;
    password: string;
    name: string;
    isVerified?: boolean;
  }): Promise<User> {
    const { email } = data;
    const role =
      email === 'admin@admin.com' ? RoleType.SUPER_ADMIN : RoleType.USER;

    const userRole = await prisma.role.findFirst({
      where: {
        code: role,
      },
    });

    if (!userRole) {
      throw new Error(`Role ${role} not found. Run seed first`);
    }

    const user = await prisma.user.create({
      data: {
        ...data,
        roleId: userRole.id,
      },
    });

    const userEntity = User.fromUpdateUserDto(user, null);

    // Кэшируем нового пользователя
    await this.cacheService.setUserById(user.id, userEntity, 3600);
    // await this.cacheService.setUserByEmail(user.email, userEntity, 3600);

    return userEntity;
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Обновление пользователя id: ${id}, body: ${body}`);

    try {
      // Начинаем транзакцию для атомарности операций
      const result = await prisma.$transaction(async (tx: PrismaClient) => {
        // TODO: вынести по отдельным запосам для скорости
        // 1. Обновляем основные данные пользователя
        const updatedUser = await tx.user.update({
          where: { id },
          data: {
            name: body.name,
          },
          include: {
            workers: true,
            profile: {
              include: {
                legalEntityType: true,
                currency: true,
              },
            },
          },
        });

        // 2. Обрабатываем профиль
        const existingProfile = await tx.profile.findUnique({
          where: { userId: id },
        });

        if (existingProfile) {
          // TODO: вынести по отдельным запосам для скорости
          // Обновляем существующий профиль
          const updatedProfile = await tx.profile.update({
            where: { userId: id },
            data: {
              legalEntityTypeId: body.legalEntityId,
              currencyId: body.currencyId,
              avatarUrl: body.avatar,
              phone: body.companyPhone,
              email: body.companyEmail,
              telegram: body.telegram,
              siteUrl: body.siteUrl,
              description: body.description,
            },
            include: {
              user: {
                include: {
                  workers: true,
                  receivedReviews: {
                    select: {
                      rating: true,
                      createdAt: true,
                    },
                    orderBy: {
                      createdAt: 'desc',
                    },
                  },
                },
              },
              legalEntityType: true,
              currency: true,
            },
          });

          // Индексируем обновленный профиль в Elasticsearch
          await this.searchService.indexProfile(updatedProfile, tx);
        } else {
          // TODO: вынести по отдельным запосам для скорости
          // Создаем новый профиль
          const newProfile = await tx.profile.create({
            data: {
              userId: id,
              legalEntityTypeId: body.legalEntityId,
              currencyId: body.currencyId,
              avatarUrl: body.avatar,
              phone: body.companyPhone,
              email: body.companyEmail,
              telegram: body.telegram,
              siteUrl: body.siteUrl,
              description: body.description,
            },
            include: {
              user: {
                include: {
                  workers: true,
                  receivedReviews: {
                    select: {
                      rating: true,
                      createdAt: true,
                    },
                    orderBy: {
                      createdAt: 'desc',
                    },
                  },
                },
              },
              legalEntityType: true,
              currency: true,
            },
          });

          // Индексируем новый профиль в Elasticsearch
          await this.searchService.indexProfile(newProfile, tx);
        }

        // 3. Обрабатываем активности
        await this.activitiesService.processActivities({
          userId: id,
          activities: body.activities,
          tx: tx,
        });

        // 4. Обрабатываем сотрудников (workers)
        if (body.workers && body.workers.length > 0) {
          await this.workersService.processWorkers(id, body.workers, tx);
        }

        // 5. Обрабатываем локации (maps)
        if (body.maps && body.maps.length > 0) {
          await this.mapLocationsService.processMapLocations({
            userId: id,
            maps: body.maps,
            tx: tx,
          });
        }

        // 6. Очищаем кэш
        await this.cacheService.del(`activities/users:${id}`);
        await this.cacheService.del(`activities`);

        // 7. Создаем User entity без поля password
        // return User.fromUpdateUserDto(updatedUser, updatedUser.profile);
        return UserMapper.toUserResponse(updatedUser);
      });

      return UserMapper.toUserResponse(result);
    } catch (error) {
      this.logger.error(`Ошибка при обновлении пользователя: ${error.message}`);
      throw error;
    }
  }

  async seedRoles() {
    for (const role of roles) {
      const existingRole = await prisma.role.findFirst({
        where: { code: role.code },
      });

      if (!existingRole) {
        await prisma.role.create({
          data: role,
        });
      } else {
        await prisma.role.update({
          where: { id: existingRole.id },
          data: {
            role: role.role,
            // обновляем только название, не трогаем связи
          },
        });
      }
    }
  }
}
