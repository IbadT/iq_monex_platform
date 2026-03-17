import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class MakeComplaintToUser {
  @ApiProperty({
    description: '',
    example: '',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({
    description: '',
    example: '',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  text: string;

  @ApiProperty({
    description: '',
    example: '',
    required: true,
  })
  @IsString()
  @IsUUID()
  userId: string;

  constructor(type: string, text: string, userId: string) {
    this.type = type;
    this.text = text;
    this.userId = userId;
  }
}
