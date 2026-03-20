import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateWorkerDto } from './update-worker.dto';

export class UpdateWorkersDto {
  @ApiProperty({
    description: 'Массив ID работников для обновления',
    type: [String],
    required: true,
  })
  @IsArray()
  workerIds!: string[];

  @ApiProperty({
    description: 'Данные для обновления',
    type: UpdateWorkerDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => UpdateWorkerDto)
  data!: UpdateWorkerDto;
}
