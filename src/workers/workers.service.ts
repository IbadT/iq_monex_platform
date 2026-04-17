import { prisma } from '@/lib/prisma';
import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { CreateWorkerDto, WorkerAction } from './dto/create-worker.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleType } from '@/users/enums/role-type.enum';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PrismaClient } from '../../prisma/generated/client';
import { UserWorkerResponseDto } from './dto/response/worker-response.dto';
import { UserWorkerMapper } from './mappers/user-worker.mapper';
import {
  RoleBriefResponseDto,
  RoleResponseDto,
} from './dto/response/role-response.dto';
import { CreateWorkerResponseDto } from './dto/response/create-worker.dto';
import { ChangeWorkerStatusResponseDto } from './dto/response/change-status.dto';
import { UpdateWorkerResponseDto } from './dto/response/update-worker.dto';
import { S3Service } from '@/s3/s3.service';
import { RabbitmqService } from '@/rabbitmq/rabbitmq.service';
import { FileOwnerType, FileKind } from '../../prisma/generated/enums';

@Injectable()
export class WorkersService {
  constructor(
    private readonly s3Service: S3Service,
    private readonly rabbitmqService: RabbitmqService,
  ) {}

  /**
   * Проверяет, является ли значение HTTPS URL (уже загруженным файлом)
   */
  private isHttpsUrl(value: string): boolean {
    if (!value || typeof value !== 'string') return false;
    return value.trim().startsWith('https://');
  }

  async getWorkerById(id: string) {
    return prisma.worker.findUnique({
      where: { id },
      include: {
        role: true,
        files: true,
      },
    });
  }

  // TODO: добавить redis
  async getUserWorkers(userId: string): Promise<UserWorkerResponseDto[]> {
    const userWorkers = await prisma.worker.findMany({
      where: {
        userId: userId, // Прямая связь с пользователем
      },
      include: {
        role: true,
        files: true,
      },
    });

    const response = UserWorkerMapper.toResponse(userWorkers);
    return response;
  }

  private async processWorkerAction(
    worker: CreateWorkerDto,
    userId: string,
    tx: PrismaClient,
  ): Promise<any> {
    switch (worker.action) {
      case WorkerAction.CREATE:
        return await this.handleCreateWorker(worker, userId, tx);

      case WorkerAction.UPDATE:
        return await this.handleUpdateWorker(worker, userId, tx);

      case WorkerAction.DELETE:
        return await this.handleDeleteWorker(worker, userId, tx);

      case WorkerAction.ACTIVITY:
        return await this.handleActivityWorker(worker, userId, tx);

      case WorkerAction.IGNORE:
        return null;

      default:
        throw new BadRequestException(
          `Unknown worker action: ${worker.action}`,
        );
    }
  }

  async updateRole(id: string, role: string) {
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new BadRequestException(`Role with id ${id} not found`);
    }

    const roleWithSameName = await prisma.role.findFirst({
      where: {
        role: role,
        id: { not: id },
        type: RoleType.WORKER,
      },
    });

    if (roleWithSameName) {
      throw new ConflictException(`Role with name ${role} already exists`);
    }

    return await prisma.role.update({
      where: { id },
      data: { role },
    });
  }

  async deleteWorkerRole(id: string) {
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new BadRequestException(`Role with id ${id} not found`);
    }

    const workersWithRole = await prisma.worker.findFirst({
      where: {
        roleId: id,
        // type: RoleType.WORKER,
        // role: RoleType.WORKER,
        role: {
          type: RoleType.WORKER,
        },
      },
    });

    if (workersWithRole) {
      throw new ConflictException(
        `Cannot delete role with id ${id} because it is assigned to one or more workers`,
      );
    }

    return await prisma.role.delete({
      where: { id },
    });
  }

  private async handleCreateWorker(
    worker: CreateWorkerDto,
    userId: string,
    db: PrismaClient,
  ) {
    // Проверяем существование роли
    const role = await db.role.findUnique({
      where: { id: worker.roleId },
    });

    if (!role) {
      throw new BadRequestException(`Role with id ${worker.roleId} not found`);
    }

    // Проверяем, что email не занят
    const existingWorker = await db.worker.findFirst({
      where: {
        email: worker.email,
        userId: userId,
      },
    });

    if (existingWorker) {
      throw new ConflictException(
        `Worker with email ${worker.email} already exists`,
      );
    }

    const createdWorker = await db.worker.create({
      data: {
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        roleId: worker.roleId,
        userId: userId,
        isActive: true,
      },
      include: {
        role: true,
      },
    });

    // Обрабатываем аватар если передан (не null и не пустая строка)
    if (
      worker.avatar &&
      typeof worker.avatar === 'string' &&
      worker.avatar.trim() !== ''
    ) {
      await this.handleWorkerAvatar(
        createdWorker.id,
        userId,
        worker.avatar,
        db,
      );
    }

    return createdWorker;
  }

  private async handleUpdateWorker(
    worker: CreateWorkerDto,
    userId: string,
    db: PrismaClient,
  ) {
    if (!worker.id) {
      throw new BadRequestException('Worker ID is required for UPDATE action');
    }

    const updatedWorker = await db.worker.update({
      where: { id: worker.id, userId: userId },
      data: {
        name: worker.name,
        phone: worker.phone,
        email: worker.email,
        roleId: worker.roleId,
      },
      include: {
        role: true,
      },
    });

    // Обрабатываем аватар если передан
    if (worker.avatar !== undefined) {
      // Пустая строка обрабатывается как null (удаление)
      if (
        worker.avatar === null ||
        (typeof worker.avatar === 'string' && worker.avatar.trim() === '')
      ) {
        // Удаляем существующий аватар
        await this.deleteWorkerAvatar(worker.id, db);
      } else {
        // Создаем или обновляем аватар
        await this.handleWorkerAvatar(worker.id, userId, worker.avatar, db);
      }
    }

    return updatedWorker;
  }

  private async handleDeleteWorker(
    worker: CreateWorkerDto,
    userId: string,
    tx: PrismaClient,
  ) {
    if (!worker.id) {
      throw new BadRequestException('Worker ID is required for DELETE action');
    }

    return await tx.worker.delete({
      where: { id: worker.id, userId: userId },
    });
  }

  private async handleActivityWorker(
    worker: CreateWorkerDto,
    userId: string,
    tx: PrismaClient,
  ) {
    if (!worker.id) {
      throw new BadRequestException(
        'Worker ID is required for ACTIVITY action',
      );
    }

    const existingWorker = await tx.worker.findUnique({
      where: { id: worker.id, userId: userId },
    });

    if (!existingWorker) {
      throw new BadRequestException(`Worker with id ${worker.id} not found`);
    }

    return await tx.worker.update({
      where: { id: worker.id, userId: userId },
      data: {
        isActive: !existingWorker.isActive,
      },
      include: {
        role: true,
      },
    });
  }

  async createWorker(
    userId: string,
    body: CreateWorkerDto[],
  ): Promise<CreateWorkerResponseDto[]> {
    const results = [];

    for (const worker of body) {
      if (
        worker.action === WorkerAction.CREATE ||
        worker.action === WorkerAction.IGNORE
      ) {
        const result = await this.processWorkerAction(worker, userId, prisma);
        if (result) {
          results.push(result);
        }
      } else {
        throw new BadRequestException(
          `Invalid action ${worker.action} for createWorker method. Only CREATE and IGNORE are allowed.`,
        );
      }
    }

    return results.map((i) => i.id);
  }

  async processWorkers(
    userId: string,
    workers: CreateWorkerDto[],
    tx: PrismaClient,
  ) {
    if (!workers || workers.length === 0) {
      return;
    }

    for (const worker of workers) {
      await this.processWorkerAction(worker, userId, tx);
    }
  }

  async changeWorkerActiveStatus(
    workerId: string,
    userId: string,
  ): Promise<ChangeWorkerStatusResponseDto> {
    // Проверяем, что worker принадлежит текущему пользователю
    const worker = await this.getWorkerById(workerId);
    if (!worker || worker.userId !== userId) {
      throw new BadRequestException('Worker not found or access denied');
    }

    return await prisma.worker.update({
      where: { id: workerId },
      data: { isActive: false },
      select: {
        id: true,
      },
    });
  }

  async updateWorkers(
    userId: string,
    body: UpdateWorkerDto,
  ): Promise<UpdateWorkerResponseDto[]> {
    // Получаем ID записей до обработки
    const workers = await prisma.worker.findMany({
      where: { userId },
      select: { id: true },
    });

    // Обрабатываем каждого работника из массива
    if (body.workers && body.workers.length > 0) {
      await this.processWorkers(userId, body.workers, prisma);
    }

    // Возвращаем ID
    return workers;
  }

  async getRoles(): Promise<RoleBriefResponseDto[]> {
    return prisma.role.findMany({
      where: {
        type: RoleType.WORKER,
      },
      select: {
        id: true,
        role: true,
      },
    });
  }

  // TODO: добавить роли в redis
  async createRole(body: CreateRoleDto): Promise<RoleResponseDto> {
    const roleExist = await prisma.role.findFirst({
      where: {
        role: body.role,
      },
    });

    if (roleExist) {
      throw new ConflictException(
        `Роль с названием ${body.role} уже существует`,
      );
    }

    return prisma.role.create({
      data: body,
    });
  }

  /**
   * Обработка аватара сотрудника (создание или обновление)
   */
  private async handleWorkerAvatar(
    workerId: string,
    userId: string,
    avatar: string,
    db: PrismaClient,
  ): Promise<void> {
    // Если передан HTTPS URL - проверяем, совпадает ли он с существующим
    if (this.isHttpsUrl(avatar)) {
      const trimmedUrl = avatar.trim();
      const existingAvatar = await db.file.findFirst({
        where: {
          workerId,
          kind: FileKind.AVATAR,
        },
      });

      // Если URL совпадает с существующим - ничего не меняем
      if (existingAvatar && existingAvatar.url === trimmedUrl) {
        console.log(
          `[WorkerAvatar] HTTPS URL matches existing avatar, no changes needed (workerId=${workerId})`,
        );
        return;
      }

      // Если URL не совпадает - логируем warning и возвращаем
      if (existingAvatar) {
        console.warn(
          `[WorkerAvatar] Different HTTPS URL provided, keeping existing. Provided: ${trimmedUrl.slice(0, 50)}..., Existing: ${existingAvatar.url?.slice(0, 50)}...`,
        );
        return;
      }

      // Если аватара нет в БД, но пришел HTTPS URL - неконсистентное состояние
      console.warn(
        `[WorkerAvatar] HTTPS URL provided but no existing avatar in DB (workerId=${workerId}): ${trimmedUrl.slice(0, 50)}...`,
      );
      return;
    }

    // Обработка base64 (новый файл для загрузки)
    const fileName = this.s3Service.generateFileNameFromBase64(
      avatar,
      0,
      'avatar',
    );
    const s3Key = this.s3Service.generateWorkerAvatarKey(workerId);
    const contentType = this.s3Service.getContentTypeFromBase64(avatar);
    const fileSize = this.s3Service.getFileSizeFromBase64(avatar);

    // Проверяем существующий аватар
    const existingAvatar = await db.file.findFirst({
      where: {
        workerId,
        kind: FileKind.AVATAR,
      },
    });

    if (existingAvatar) {
      // Обновляем существующий аватар
      await db.file.update({
        where: { id: existingAvatar.id },
        data: {
          url: avatar,
          fileType: contentType,
          fileName,
          fileSize,
          s3Key,
          s3Bucket: '',
          uploadStatus: 'pending',
        },
      });
    } else {
      // Создаем новый аватар
      await db.file.create({
        data: {
          ownerType: FileOwnerType.WORKER,
          workerId,
          url: avatar,
          fileType: contentType,
          fileName,
          fileSize,
          kind: FileKind.AVATAR,
          sortOrder: 0,
          s3Key,
          s3Bucket: '',
          uploadStatus: 'pending',
        },
      });
    }

    // Отправляем задачу в RabbitMQ для асинхронной загрузки в S3
    await this.rabbitmqService.sendFileUpload({
      workerId,
      userId,
      fileType: 'avatar',
      fileIndex: 0,
      fileData: avatar,
      fileName,
      contentType,
      fileSize,
      s3Key,
    });
  }

  /**
   * Удаление аватара сотрудника
   */
  private async deleteWorkerAvatar(
    workerId: string,
    db: PrismaClient,
  ): Promise<void> {
    const existingAvatar = await db.file.findFirst({
      where: {
        workerId,
        kind: FileKind.AVATAR,
      },
    });

    if (existingAvatar) {
      await db.file.delete({
        where: { id: existingAvatar.id },
      });
    }
  }
}
