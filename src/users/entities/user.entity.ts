import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email' })
  email: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'John Doe', description: 'User name' })
  accountNumber: string;

  constructor(id: string, email: string, name: string, accountNumber: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.accountNumber = accountNumber;
  }
}
