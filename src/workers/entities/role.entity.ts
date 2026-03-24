export class RoleEntity {
  id: string;
  role: string;
  code: string;
  type: string; // TODO: заменить на enum
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    role: string,
    code: string,
    type: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.role = role;
    this.code = code;
    this.type = type;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
