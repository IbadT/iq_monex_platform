export interface MailtrapResponse {
  message_id: string;
  status: string;
  created_at: string;
  from: {
    email: string;
    name: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
}
