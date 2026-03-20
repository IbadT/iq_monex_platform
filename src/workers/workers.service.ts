import { prisma } from '@/lib/prisma';
import { ConflictException, Injectable, BadRequestException } from '@nestjs/common';
import { CreateWorkerDto, WorkerAction } from './dto/create-worker.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleType } from '@/users/enums/role-type.enum';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { PrismaClient } from 'prisma/generated/client';

@Injectable()
export class WorkersService {
  constructor() {}

  async getUserWorkers(userId: string) {
    return prisma.worker.findMany({
      where: {
        userId: userId, // Прямая связь с пользователем
      },
      include: {
        role: true,
      },
    });
  }

  async createWorker(userId: string, body: CreateWorkerDto[]) {
    return prisma.worker.createMany({
      data: body.map((worker) => ({
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        roleId: worker.roleId,
        userId: userId, // Привязываем worker к авторизованному пользователю
        isAcitve: true,
      })),
    });
  }

  async processWorkers(userId: string, workers: CreateWorkerDto[], tx: PrismaClient) {
    if (!workers || workers.length === 0) {
      return;
    }

    for (const workerDto of workers) {
      switch (workerDto.action) {
        case WorkerAction.CREATE:
          // Создаем нового сотрудника
          // Проверяем существование роли
          const role = await tx.role.findUnique({
            where: { id: workerDto.roleId }
          });
          
          if (!role) {
            throw new BadRequestException(`Role with ID ${workerDto.roleId} not found`);
          }

          await tx.worker.create({
            data: {
              userId: userId,
              name: workerDto.name,
              phone: workerDto.phone,
              email: workerDto.email,
              isAcitve: true, // По умолчанию активный
              roleId: workerDto.roleId
            },
          });
          break;

        case WorkerAction.UPDATE:
          // Обновляем существующего сотрудника
          if (!workerDto.id) {
            throw new BadRequestException('Worker ID is required for UPDATE action');
          }

          await tx.worker.update({
            where: { id: workerDto.id, userId: userId },
            data: {
              name: workerDto.name,
              phone: workerDto.phone,
              email: workerDto.email,
              roleId: workerDto.roleId,
            },
          });
          break;

        case WorkerAction.DELETE:
          // Удаляем сотрудника
          if (!workerDto.id) {
            throw new BadRequestException('Worker ID is required for DELETE action');
          }

          await tx.worker.delete({
            where: { id: workerDto.id, userId: userId },
          });
          break;

        case WorkerAction.ACTIVITY:
          // Меняем статус активности сотрудника
          if (!workerDto.id) {
            throw new BadRequestException('Worker ID is required for ACTIVITY action');
          }

          const existingWorker = await tx.worker.findUnique({
            where: { id: workerDto.id, userId: userId },
          });

          if (!existingWorker) {
            throw new BadRequestException(`Worker with id ${workerDto.id} not found`);
          }

          await tx.worker.update({
            where: { id: workerDto.id, userId: userId },
            data: {
              isAcitve: !existingWorker.isAcitve, // Инвертируем текущий статус
            },
          });
          break;

        case WorkerAction.IGNORE:
          // Пропускаем обработку
          break;

        default:
          throw new BadRequestException(`Unknown worker action: ${workerDto.action}`);
      }
    }
  }

  async changeWorkerActiveStatus(workerId: string) {
    return prisma.worker.update({
      where: {
        id: workerId,
      },
      data: {
        isAcitve: false,
      },
    });
  }

  async updateWorkers(userId: string, body: UpdateWorkerDto) {
    return await prisma.worker.updateMany({
      where: {
        userId,
      },
      data: body,
    });
  }

  async getRoles() {
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

  async createRole(body: CreateRoleDto) {
    // TODO: добавить роли в redis
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
