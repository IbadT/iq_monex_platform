export interface ReviewFileUploadMessage {
  reviewId: string;
  fileType: 'photo' | 'document';
  fileIndex: number;
  fileData: string; // base64
  fileName: string;
  contentType: string;
  fileSize: number;
  s3Key: string;
}
