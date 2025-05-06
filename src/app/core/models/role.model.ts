// src/app/core/models/role.model.ts
import { Permission } from './permission.model';

export interface Role {
  id?: number;
  name: string;
  description?: string;
  permissions?: any[];
}
