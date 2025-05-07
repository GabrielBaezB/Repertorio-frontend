// src/app/core/services/system-config.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SystemConfig } from '../models/system-config.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigService {
  private readonly API_URL = `${environment.apiUrl}/config`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<SystemConfig[]> {
    return this.http.get<SystemConfig[]>(this.API_URL);
  }

  update(id: number, config: SystemConfig): Observable<SystemConfig> {
    return this.http.put<SystemConfig>(`${this.API_URL}/${id}`, config);
  }

  getByKey(key: string): Observable<SystemConfig> {
    return this.http.get<SystemConfig>(`${this.API_URL}/key/${key}`);
  }
}
