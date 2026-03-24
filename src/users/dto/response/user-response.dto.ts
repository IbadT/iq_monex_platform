import { RoleResponseDto } from '@/workers/dto/response/role-response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: '',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'example@example.com',
    type: 'string',
  })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иванов Иван Иванович',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Номер аккаунта пользователя',
    example: '1234567890',
    type: 'string',
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Описание роли пользователя',
    type: () => OmitType(RoleResponseDto, ['type']),
  })
  role: Omit<RoleResponseDto, 'type'>;

  constructor(
    id: string,
    email: string,
    name: string,
    accountNumber: string,
    role: Omit<RoleResponseDto, 'type'>,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.accountNumber = accountNumber;
    this.role = role;
  }
}
