import { IsBoolean, IsUUID } from 'class-validator';

export class TypingDto {
  @IsUUID()
  chatId: string;

  @IsBoolean()
  isTyping: boolean;

  constructor(chatId: string, isTyping: boolean) {
    this.chatId = chatId;
    this.isTyping = isTyping;
  }
}
