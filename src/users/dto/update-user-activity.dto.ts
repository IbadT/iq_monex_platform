import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum UpdateActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  IGNORE = 'IGNORE',
}

export class UpdateUserActivityDto {
  @ApiProperty({
    description: 'ID существующей активности',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  id?: number;

  @ApiProperty({
    description: 'Действие с активностью',
    example: UpdateActivityAction.CREATE,
    required: true,
  })
  @IsEnum(UpdateActivityAction)
  action: UpdateActivityAction;

  constructor(action: UpdateActivityAction, id?: number) {
    this.action = action;
    if (id !== undefined) {
      this.id = id;
    }
  }
}
