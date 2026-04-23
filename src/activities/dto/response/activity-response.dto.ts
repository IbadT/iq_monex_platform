import { ApiProperty } from '@nestjs/swagger';

export class ActivityResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор сферы деятельности',
    example: 101,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Название сферы деятельности',
    example: 'Юридическое сопровождение бизнеса',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'ID группы активностей',
    example: 1,
    type: 'integer',
  })
  groupId: number;

  @ApiProperty({
    description: 'Название группы активностей',
    example: 'ЮРИДИЧЕСКИЕ И РЕГУЛЯТОРНЫЕ УСЛУГИ',
    type: 'string',
    nullable: true,
  })
  groupName?: string | undefined;

  constructor(
    id: number,
    name: string,
    groupId: number,
    groupName?: string | undefined,
  ) {
    this.id = id;
    this.name = name;
    this.groupId = groupId;
    if (groupName !== undefined) {
      this.groupName = groupName;
    }
  }
}
