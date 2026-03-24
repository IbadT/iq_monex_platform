import { ApiProperty, OmitType } from '@nestjs/swagger';

export class RoleResponseDto {
  @ApiProperty({
    description: 'ID роли',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Код роли',
    example: 'MANAGER', // TODO: добавить enum
    type: 'string',
  })
  code: string;

  @ApiProperty({
    description: 'Название роли',
    example: 'Менеджер',
    type: 'string',
  })
  role: string;

  @ApiProperty({
    description: 'Тип роли',
    example: 'WORKER',
    type: 'string',
    enum: ['USER', 'WORKER'],
  })
  type: string;

  constructor(id: string, code: string, role: string, type: string) {
    this.id = id;
    this.code = code;
    this.role = role;
    this.type = type;
  }
}

export class RoleBriefResponseDto extends OmitType(RoleResponseDto, [
  'code',
  'type',
]) {}
