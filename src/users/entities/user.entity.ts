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

  @ApiProperty({ example: '12345678', description: 'User account number' })
  accountNumber: string;

  @ApiProperty({ 
    example: false, 
    description: 'Whether user email is verified',
    default: false,
  })
  isVerified: boolean;

  constructor(id: string, email: string, name: string, accountNumber: string, isVerified: boolean = false) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.accountNumber = accountNumber;
    this.isVerified = isVerified;
  }
}
