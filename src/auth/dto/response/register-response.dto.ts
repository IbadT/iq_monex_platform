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

  constructor(status: number, message?: string) {
    this.status = status;
    if (message !== undefined) {
      this.message = message;
    }
  }
}
