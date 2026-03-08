export interface ChatParticipant {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  chatId: string;
  joinedAt: Date;
}
