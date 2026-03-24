import { ApiProperty } from '@nestjs/swagger';
import { ActivityResponseDto } from './activity-response.dto';

export class UserActivityResponseDto {
  @ApiProperty({
    description: 'Уникальный идентификатор связи пользователя с активностью',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'ID пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'ID сферы деятельности',
    example: 1,
    type: 'integer',
  })
  activityId: number;

  @ApiProperty({
    description: 'Информация о сфере деятельности',
    type: () => ActivityResponseDto,
  })
  activity: ActivityResponseDto;

  constructor(
    id: string,
    userId: string,
    activityId: number,
    activity: ActivityResponseDto,
  ) {
    this.id = id;
    this.userId = userId;
    this.activityId = activityId;
    this.activity = activity;
  }
}
