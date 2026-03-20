import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWorkerDto } from './create-worker.dto';

export class CreateWorkersDto {
  @ApiProperty({
    description: 'Массив работников для создания',
    type: [CreateWorkerDto],
    required: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkerDto)
  workers!: CreateWorkerDto[];
}
