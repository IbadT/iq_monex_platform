import { ApiProperty } from '@nestjs/swagger';
import { RoleResponseDto } from './role-response.dto';

export class UserWorkerResponseDto {
  @ApiProperty({
    description: 'ID сотрудника',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Имя сотрудника',
    example: 'Иванов Иван Иванович',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Email сотрудника',
    example: 'ivanov@example.com',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    description: 'Телефон сотрудника',
    example: '+79991234567',
    type: 'string',
  })
  phone: string;

  @ApiProperty({
    description: 'ID роли сотрудника',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  roleId: string;

  @ApiProperty({
    description: 'ID пользователя',
    example: '456e7890-f12a-34b5-c678-532614174111',
    type: 'string',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'Активен ли сотрудник',
    example: true,
    type: 'boolean',
  })
  isActitve: boolean;

  @ApiProperty({
    description: 'Роль сотрудника',
    type: () => RoleResponseDto,
  })
  role: RoleResponseDto;

  @ApiProperty({
    description: 'URL аватара сотрудника',
    example: 'https://s3.example.com/workers/123/avatar/avatar.jpg',
    type: 'string',
    nullable: true,
  })
  avatar: string | null;

  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    roleId: string,
    userId: string,
    isActive: boolean,
    role: RoleResponseDto,
    avatar?: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.roleId = roleId;
    this.userId = userId;
    this.isActitve = isActive;
    this.role = role;
    this.avatar = avatar ?? null;
  }
}
