// src/app/core/models/system-config.model.ts
export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  description: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'DATE';
}
