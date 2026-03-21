import { IsString, IsNotEmpty, Matches } from 'class-validator';

export class ResetBackupDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}(T\d{2}-\d{2}-\d{2})?$/, {
    message: 'Дата должна быть в формате YYYY-MM-DD или YYYY-MM-DDTHH-MM-SS',
  })
  date!: string;
}
