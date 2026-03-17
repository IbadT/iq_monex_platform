import { PaginationDto } from '@/common/dto/pagintation.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GetPayment extends PaginationDto {
  @ApiProperty({
    description: 'ID пользователя (опционально)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID()
  userId?: string;

  constructor(userId?: string, limit: number = 10, offset: number = 0) {
    super(limit, offset);
    if (userId) {
      this.userId = userId;
    }
  }
}
