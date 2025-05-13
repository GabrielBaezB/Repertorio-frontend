// src/app/shared/components/debug-base/debug-base.component.ts
import { Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { DebugService } from '../../../core/services/debug.service';

@Component({
  template: ''
})
export class DebugBaseComponent {
  // Estado común
  loading = false;
  error: string | null = null;
  errorStatus: number | null = null;
  errorDetails: any = null;
  result: any = null;
  requestDetails: any = null;

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
  protected handleError(err: any): void {
    this.loading = false;
    this.errorStatus = err.status;
    this.error = `Status: ${err.status}. Message: ${err.message}`;
    this.errorDetails = err.error;
    console.error('Full error:', err);
  }

  // Método para manejar respuestas exitosas
  protected handleSuccess(data: any): void {
    this.loading = false;
    this.result = data;
  }

  // Método para crear parámetros de paginación
  protected createPaginationParams(page: number = this.page, size: number = this.size, sort: string = 'createdAt,desc'): HttpParams {
    return new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
  }

  // Método para registrar detalles de la solicitud
  protected logRequestDetails(url: string, method: string, headers: any, params: any): void {
    this.requestDetails = this.debugService.getRequestDetails(url, method, headers, params);
    console.log('Request details:', this.requestDetails);
  }
}
