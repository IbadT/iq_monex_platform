import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateNoteDto {
  @ApiProperty({
    example: 'Обновленная заметка о пользователе',
    description: 'Текст заметки (максимум 100 символов)',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  content: string;

  constructor(content: string) {
    this.content = content;
  }
}
