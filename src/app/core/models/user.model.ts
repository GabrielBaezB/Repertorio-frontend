// src/app/core/models/user.model.ts
export interface User {
  id: number;
  username: string;
  email?: string;
  fullName?: string;
  enabled: boolean;
  roles: any[];
  createdAt?: string;
  lastLogin?: string;
}
