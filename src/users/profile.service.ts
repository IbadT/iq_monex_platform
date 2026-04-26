import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '../../prisma/generated/client';

@Injectable()
export class ProfileService {
  async upsertProfile(userId: string, body: UpdateUserDto, tx: PrismaClient) {
    return tx.profile.upsert({
      where: { userId },
      update: {
        legalEntityTypeId: body.legalEntityId,
        currencyId: body.currencyId,
        avatarUrl: body.avatar,
        phone: body.companyPhone,
        email: body.companyEmail,
        siteUrl: body.siteUrl,
        description: body.description,
      },
      create: {
        userId,
        legalEntityTypeId: body.legalEntityId,
        currencyId: body.currencyId,
        avatarUrl: body.avatar,
        phone: body.companyPhone,
        email: body.companyEmail,
        siteUrl: body.siteUrl,
        description: body.description,
      },
    });
  }
}
