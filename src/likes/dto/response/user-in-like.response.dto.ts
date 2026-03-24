import { ApiProperty } from '@nestjs/swagger';

export class UserInLike {
  @ApiProperty({
    description: 'ID пользователя, который поставил лайк',
    example: 'bcea00ce-0a3b-4063-9289-1fd63662cbd3',
    type: 'string',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иванов Иван Иванович',
    type: 'string',
  })
  name: string;

  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    type: 'string',
  })
  email: string;

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
