import { FILE_KIND, FILE_OWNER_TYPE } from '../enums/listing-status.enum';

export class FileEntity {
  id: string;
  ownerType: FILE_OWNER_TYPE;

  s3Key: string;
  s3Bucket: string;
  url: string;

  fileType: string;
  fileName: string;
  fileSize: number;

  kind: FILE_KIND;

  isPrimary: boolean;
  sortOrder: number;

  uploadStatus: string;

  expiresAt: Date;
  createdAt: Date;

  userId?: string | null;
  listingId?: string | null;
  complaintId?: string | null;

  constructor(
    id: string,
    ownerType: FILE_OWNER_TYPE,
    kind: FILE_KIND,
    s3Key: string,
    s3Bucket: string,
    url: string,
    fileType: string,
    fileName: string,
    fileSize: number,
    isPrimary: boolean,
    sortOrder: number,
    uploadStatus: string,
    expiresAt: Date,
    createdAt: Date,
    userId?: string | null,
    listingId?: string | null,
    complaintId?: string | null,
  ) {
    this.id = id;
    this.ownerType = ownerType;
    this.kind = kind;
    this.s3Key = s3Key;
    this.s3Bucket = s3Bucket;
    this.url = url;
    this.fileType = fileType;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.isPrimary = isPrimary;
    this.sortOrder = sortOrder;
    this.uploadStatus = uploadStatus;
    this.expiresAt = expiresAt;
    this.createdAt = createdAt;
    this.userId = userId ?? null;
    this.listingId = listingId ?? null;
    this.complaintId = complaintId ?? null;
  }
}
