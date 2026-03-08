import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class JoinChatDto {
  @IsUUID()
  chatId: string;

  @IsUUID()
  userId: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  limit?: number = 25;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  offset?: number = 0;

  constructor(
    chatId: string,
    userId: string,
    limit: number = 25,
    offset: number = 0,
  ) {
    this.chatId = chatId;
    this.userId = userId;
    this.limit = limit;
    this.offset = offset;
  }
}
