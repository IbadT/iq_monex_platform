import { RoleEntity } from './role.entity';

export class WorkerEntity {
  id: string;
  name: string;
  phone: string;
  email: string;
  isActive: boolean;
  roleId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;

  role: RoleEntity;

  constructor(
    id: string,
    name: string,
    phone: string,
    email: string,
    isActive: boolean,
    roleId: string,
    userId: string,
    createdAt: Date,
    updatedAt: Date,

    role: RoleEntity,
  ) {
    this.id = id;
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.isActive = isActive;
    this.roleId = roleId;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.role = role;
  }
}
