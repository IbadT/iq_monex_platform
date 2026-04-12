import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export enum WorkerAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  IGNORE = 'IGNORE',
  DELETE = 'DELETE',
  ACTIVITY = 'ACTIVITY',
}

export class CreateWorkerDto {
  @ApiProperty({
    description: 'ID сотрудника (если action: CREATE, то id не передавать)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @ValidateIf(
    (object: CreateWorkerDto) =>
      object.action === WorkerAction.UPDATE ||
      object.action === WorkerAction.DELETE ||
      object.action === WorkerAction.ACTIVITY,
  )
  @IsOptional()
  @IsUUID()
  id?: string | null;

  @ApiProperty({
    description: 'Worker name',
    example: 'Иванов Иван Иванович',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Worker email',
    example: 'ivanov@example.com',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Worker phone',
    example: '+79991234567',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    description: 'Worker role ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  roleId: string;

  @ApiProperty({
    description:
      'Действие с сотрудником (CREATE - создать нового, UPDATE - обновить существующего, IGNORE - не трогать, DELETE - удалить)',
    enum: WorkerAction,
    example: WorkerAction.CREATE,
    required: true,
  })
  @IsEnum(WorkerAction, {
    message: 'Неверное действие с сотрудником',
  })
  action: WorkerAction;

  @ApiProperty({
    description: 'Аватар сотрудника (base64 строка или null)',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...',
    required: true,
    type: 'string',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  avatar?: string | null;

  constructor(
    id: string | null,
    name: string,
    email: string,
    phone: string,
    roleId: string,
    action: WorkerAction,
    avatar?: string | null,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.roleId = roleId;
    this.action = action;
    this.avatar = avatar ?? null;
  }
}
