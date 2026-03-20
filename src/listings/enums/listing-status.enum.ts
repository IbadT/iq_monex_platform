export enum ListingStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  TEMPLATE = 'TEMPLATE',
}

export enum FILE_OWNER_TYPE {
  USER = 'USER',
  LISTING = 'LISTING',
  COMPLAINT = 'COMPLAINT',
}

export enum FILE_KIND {
  AVATAR = 'AVATAR',
  PHOTO = 'PHOTO',
  DOCUMENT = 'DOCUMENT',
  COMPLAINT_PHOTO = 'COMPLAINT_PHOTO',
}

// Enum для состояния
export enum ListingCondition {
  NEW = 'NEW',
  USED = 'USED',
}
