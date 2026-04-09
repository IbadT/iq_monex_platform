import { ApiProperty } from '@nestjs/swagger';

export class ChangeWorkerStatusResponseDto {
  @ApiProperty({
    description: 'ID объявления',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Новый статус объявления',
    example: 'DRAFT',
    enum: ['DRAFT', 'PUBLISHED', 'TEMPLATE', 'ARCHIVED'],
    type: 'string',
  })
  status: string;

  @ApiProperty({
    description: 'Дата публикации (только для PUBLISHED)',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  publishedAt: Date | null;

  @ApiProperty({
    description: 'Дата архивации (только для ARCHIVED)',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  archivedAt: Date | null;

  @ApiProperty({
    description: 'Дата авто-удаления (только для ARCHIVED)',
    example: '2024-01-15T10:30:00Z',
    type: 'string',
    format: 'date-time',
  })
  autoDeleteAt: Date | null;

  constructor(
    id: string,
    status: string,
    publishedAt: Date | null,
    archivedAt: Date | null,
    autoDeleteAt: Date | null,
  ) {
    this.id = id;
    this.status = status;
    this.publishedAt = publishedAt;
    this.archivedAt = archivedAt;
    this.autoDeleteAt = autoDeleteAt;
  }
}
