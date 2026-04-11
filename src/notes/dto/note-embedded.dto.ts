import { ApiProperty } from '@nestjs/swagger';
import { NoteTargetType } from '../enums/note-target-type.enum';

export class NoteEmbeddedDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID заметки',
  })
  id: string;

  @ApiProperty({
    example: 'USER',
    description: 'Тип цели заметки',
    enum: NoteTargetType,
  })
  targetType: NoteTargetType;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID цели (пользователя или объявления)',
  })
  targetId: string;

  constructor(
    id: string,
    targetType: NoteTargetType,
    targetId: string,
  ) {
    this.id = id;
    this.targetType = targetType;
    this.targetId = targetId;
  }
}
