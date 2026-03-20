import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class RestoreBackupDto {
  @ApiProperty({
    description: 'Дата бэкапа для восстановления',
    example: '2024-03-18',
    pattern: 'YYYY-MM-DD или YYYY-MM-DDTHH-MM-SS',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}(T\d{2}-\d{2}-\d{2})?$/, {
    message: 'Дата должна быть в формате YYYY-MM-DD или YYYY-MM-DDTHH-MM-SS',
  })
  date!: string;
}
