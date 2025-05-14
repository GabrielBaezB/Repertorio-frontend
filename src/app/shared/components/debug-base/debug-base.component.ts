// src/app/shared/components/debug-base/debug-base.component.ts
import { Component } from '@angular/core';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { DebugService } from '../../../core/services/debug.service';

// Interfaces para mejorar la seguridad de tipos
interface RequestDetails {
  url: string;
  method: string;
  headers: Record<string, string | string[]>;
  params: Record<string, string | string[]>;
}

interface ApiResponse<T = unknown> {
  data: T;
  status?: number;
  statusText?: string;
  [key: string]: unknown;
}

interface ErrorDetails {
  message?: string;
  status?: number;
  error?: unknown;
  [key: string]: unknown;
}

@Component({
  template: ''
})
export class DebugBaseComponent {
  // Estado común
  loading = false;
  error: string | null = null;
  errorStatus: number | null = null;
  errorDetails: ErrorDetails | null = null;
  result: ApiResponse | null = null;
  requestDetails: RequestDetails | null = null;

  // Configuración común
  page = 0;
  size = 10;
  showAdvanced = false;

  constructor(protected debugService: DebugService) {}

  // Método para resetear el estado
  protected resetState(): void {
    this.loading = true;
    this.error = null;
    this.errorStatus = null;
    this.errorDetails = null;
    this.result = null;
    this.requestDetails = null;
  }

  // Método para manejar errores
  protected handleError(err: HttpErrorResponse): void {
    this.loading = false;
    this.errorStatus = err.status;
    this.error = `Status: ${err.status}. Message: ${err.message}`;
    this.errorDetails = err.error;
    console.error('Full error:', err);
  }

  // Método para manejar respuestas exitosas
  protected handleSuccess(data: ApiResponse): void {
    this.loading = false;
    this.result = data;
  }

  // Método para crear parámetros de paginación
  protected createPaginationParams(page: number = this.page, size: number = this.size, sort = 'createdAt,desc'): HttpParams {
    return new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
  }

  // Método para registrar detalles de la solicitud
  protected logRequestDetails(
    url: string,
    method: string,
    headers: Record<string, string | string[]>,
    params: Record<string, string | string[]>
  ): void {
    this.requestDetails = this.debugService.getRequestDetails(url, method, headers, params);
    console.log('Request details:', this.requestDetails);
  }
}
