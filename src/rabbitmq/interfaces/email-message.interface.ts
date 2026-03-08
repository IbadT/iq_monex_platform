export interface EmailMessage {
  to: string;
  subject: string;
  template?: string;
  data?: {
    verificationCode: string;
    userName?: string;
  };
}
