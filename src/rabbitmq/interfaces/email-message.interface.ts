export interface EmailMessage {
  to: string;
  subject: string;
  template?: string;
  data?: {
    userId?: string;
    verificationCode: string;
    userName?: string;
  };
}
