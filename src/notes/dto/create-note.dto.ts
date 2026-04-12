import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { NoteTargetType } from '../enums/note-target-type.enum';

export class CreateNoteDto {
  @ApiProperty({
    example: 'USER',
    description: 'Тип цели заметки (USER или LISTING)',
    enum: NoteTargetType,
  })
  @IsEnum(NoteTargetType)
  @IsNotEmpty()
  targetType: NoteTargetType;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description:
      'ID цели (пользователя или объявления, в зависимости от targetType)',
  })
  @IsUUID()
  @IsNotEmpty()
  targetId: string;

  @ApiProperty({
    example: 'Хороший поставщик, рекомендую',
    description: 'Текст заметки (максимум 100 символов)',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  content: string;

  constructor(targetType: NoteTargetType, targetId: string, content: string) {
    this.targetType = targetType;
    this.targetId = targetId;
    this.content = content;
  }
}
