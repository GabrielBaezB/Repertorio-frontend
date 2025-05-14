// src/app/core/services/debug.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

// Se define la interface for request details
interface RequestDetails {
  url: string;
  method: string;
  headers: Record<string, string | string[]>;
  params: Record<string, string | string[]>;
}

@Injectable({
  providedIn: 'root'
})
export class DebugService {
  // Configuración centralizada
  private readonly API_BASE_URL = environment.production
    ? environment.apiBaseUrl  // Usar variable de entorno
    : '/api';

  // Headers comunes
  private readonly COMMON_HEADERS = {
    'ngrok-skip-browser-warning': 'true'
  };

  constructor(private http: HttpClient) { }

  // Método para obtener la URL completa
  getApiUrl(endpoint: string): string {
    return `${this.API_BASE_URL}/${endpoint}`;
  }

  // Método para obtener headers con autenticación opcional
  getHeaders(includeAuth = false): HttpHeaders {
    let headers = new HttpHeaders(this.COMMON_HEADERS);

    if (includeAuth) {
      const token = localStorage.getItem('token') || '';
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Método genérico para realizar solicitudes GET
  get<T>(endpoint: string, params?: HttpParams, includeAuth = false): Observable<T> {
    const url = this.getApiUrl(endpoint);
    const headers = this.getHeaders(includeAuth);

    return this.http.get<T>(url, { headers, params }).pipe(
      catchError(error => {
        console.error(`Error en solicitud GET a ${url}:`, error);
        return throwError(() => error);
      })
    );
  }

  // Método para obtener detalles de la solicitud (para mostrar en UI)
  getRequestDetails(url: string, method: string, headers: Record<string, string | string[]>, params: Record<string, string | string[]>): RequestDetails {
    return {
      url,
      method,
      headers,
      params
    };
  }

  // Método específico para obtener blobs (PDF, Excel, etc.)
  getBlobResponse(endpoint: string, params?: HttpParams, includeAuth = false): Observable<Blob> {
    const url = this.getApiUrl(endpoint);
    const headers = this.getHeaders(includeAuth);

    return this.http.get(url, {
      headers,
      params,
      responseType: 'blob'
    }).pipe(
      catchError(error => {
        console.error(`Error en solicitud de blob a ${url}:`, error);
        return throwError(() => error);
      })
    );
  }

}
