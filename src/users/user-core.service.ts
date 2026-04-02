import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaClient } from "prisma/generated/client";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserCoreService {
    async updateUserCore(id: string, body: UpdateUserDto, tx: PrismaClient) {
        const existing = await tx.user.findUnique({
            where: {
                id
            }
        });

        if (!existing) {
            throw new NotFoundException(`Пользователь ${id} не найден`);
        };

        return tx.user.update({
            where: {
                id,
            },
            data: {
                name: body.name
            }
        })
    }
}