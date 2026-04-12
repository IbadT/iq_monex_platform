export interface FileUploadMessage {
  listingId?: string; // Опционально для обратной совместимости
  userId?: string; // ID пользователя для аватаров
  complaintId?: string; // ID жалобы
  workerId?: string; // ID сотрудника для аватаров
  suggestionId?: number; // ID предложения для фото
  fileType: 'photo' | 'document' | 'avatar';
  fileIndex: number;
  fileData: string; // base64
  fileName: string;
  contentType: string;
  fileSize: number;
  s3Key: string;
}

export interface AvatarUploadMessage {
  userId: string;
  fileType: 'photo';
  fileIndex: number;
  fileData: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}
