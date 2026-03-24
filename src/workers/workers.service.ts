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
import { PrismaClient } from 'prisma/generated/client';
import { UserWorkerResponseDto } from './dto/response/worker-response.dto';
import { UserWorkerMapper } from './mappers/user-worker.mapper';
import {
  RoleBriefResponseDto,
  RoleResponseDto,
} from './dto/response/role-response.dto';
import { CreateWorkerResponseDto } from './dto/response/create-worker.dto';
import { ChangeStatusResponseDto } from './dto/response/change-status.dto';
import { UpdateWorkerResponseDto } from './dto/response/update-worker.dto';

@Injectable()
export class WorkersService {
  constructor() {}

  async getWorkerById(id: string) {
    return prisma.worker.findUnique({
      where: { id },
      include: {
        role: true,
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

    return await db.worker.create({
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
  }

  private async handleUpdateWorker(
    worker: CreateWorkerDto,
    userId: string,
    db: PrismaClient,
  ) {
    if (!worker.id) {
      throw new BadRequestException('Worker ID is required for UPDATE action');
    }

    return await db.worker.update({
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
  ): Promise<ChangeStatusResponseDto> {
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
    return await prisma.$transaction(async (tx) => {
      // Получаем ID записей до обновления
      const workers = await tx.worker.findMany({
        where: { userId },
        select: { id: true },
      });

      // Обновляем
      await tx.worker.updateMany({
        where: { userId },
        data: body,
      });

      // Возвращаем ID
      return workers;
    });
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
}
