import { IsString, IsUUID, Length } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  chatId: string;

  @IsString()
  @Length(1, 1000)
  message: string;

  constructor(chatId: string, message: string) {
    this.chatId = chatId;
    this.message = message;
  }
}
