import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Статус операции',
    example: 200,
  })
  status: number;

  @ApiProperty({
    description: 'Сообщение о результате операции',
    example: 'Код подтверждения отправлен на ваш email',
    required: false,
  })
  message?: string;

  @ApiProperty({
    description: 'ID созданного пользователя',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  userId?: string;

  constructor(status: number, message?: string, userId?: string) {
    this.status = status;
    if (message !== undefined) {
      this.message = message;
    }
    if (userId !== undefined) {
      this.userId = userId;
    }
  }
}
