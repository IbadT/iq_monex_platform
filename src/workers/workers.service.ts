import { prisma } from '@/lib/prisma';
import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleType } from '@/users/enums/role-type.enum';
import { UpdateWorkerDto } from './dto/update-worker.dto';

@Injectable()
export class WorkersService {
    constructor(){}

    async getUserWorkers(userId: string) {
        return prisma.worker.findMany({
            where: {
                userId: userId  // Прямая связь с пользователем
            },
            include: {
                role: true
            }
        });
    }

    async createWorker(userId: string, body: CreateWorkerDto[]) {
        return prisma.worker.createMany({
            data: body.map(worker => ({
                ...worker,
                userId: userId,  // Привязываем worker к авторизованному пользователю
                isAcitve: true
            }))
        });
    }

    async changeWorkerActiveStatus(workerId: string) {
        return prisma.worker.update({
            where: {
                id: workerId
            },
            data: {
                isAcitve: false,
            }
        })
    }

    async updateWorkers(userId: string, body: UpdateWorkerDto) {
        return await prisma.worker.updateMany({
            where: {
                userId
            },
            data: body
        })
    }

    async getRoles() {
        return prisma.role.findMany({
            where: {
                type: RoleType.WORKER
            },
            select: {
                id: true,
                role: true,
            }
        });
    }

    async createRole(body: CreateRoleDto) {
        // TODO: добавить роли в redis
        const roleExist = await prisma.role.findFirst({
            where: {
                role: body.role
            }
        });

        if (roleExist) {
            throw new ConflictException(`Роль с названием ${body.role} уже существует`);
        };

        return prisma.role.create({
            data: body
        });
    }
}
