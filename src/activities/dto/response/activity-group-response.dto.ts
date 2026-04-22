import { ApiProperty } from '@nestjs/swagger';

export class ActivityInGroupDto {
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

  constructor(id: number, name: string, groupId: number) {
    this.id = id;
    this.name = name;
    this.groupId = groupId;
  }
}

export class ActivityGroupResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор группы',
    example: 1,
    type: 'integer',
  })
  id: number;

  @ApiProperty({
    description: 'Название группы активностей',
    example: 'ЮРИДИЧЕСКИЕ И РЕГУЛЯТОРНЫЕ УСЛУГИ',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Список активностей в группе',
    type: [ActivityInGroupDto],
  })
  activities: ActivityInGroupDto[];

  constructor(id: number, name: string, activities: ActivityInGroupDto[]) {
    this.id = id;
    this.name = name;
    this.activities = activities;
  }
}
