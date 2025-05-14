// src/app/debug-api-user/debug-api-user.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebugService } from '../core/services/debug.service';
import { DebugBaseComponent } from '../shared/components/debug-base/debug-base.component';

// Define ApiResponse interface if not already defined elsewhere
interface ApiResponse<T = unknown> {
  data: T;
  status?: number;
  statusText?: string;
  [key: string]: unknown;
}

@Component({
  selector: 'app-debug-api-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Template remains the same -->
  `
})
export class DebugApiUserComponent extends DebugBaseComponent {
  customPath = '';

  constructor(protected override debugService: DebugService) {
    super(debugService);
  }

  testUsersWithNetlify() {
    this.resetState();
    const params = this.createPaginationParams(this.page, this.size);
    const endpoint = 'api/users';

    // Convert headers to a plain object
    const headers = this.debugService.getHeaders(true);
    const headersObj: Record<string, string | string[]> = {};
    headers.keys().forEach(key => {
      const value = headers.getAll(key) || headers.get(key);
      if (value !== null) {
        headersObj[key] = value;
      }
    });

    // Convert params to a plain object
    const paramsObj: Record<string, string | string[]> = {};
    params.keys().forEach(key => {
      const value = params.getAll(key) || params.get(key);
      if (value !== null) {
        paramsObj[key] = value;
      }
    });

    this.logRequestDetails(`/api/${endpoint}`, 'GET', headersObj, paramsObj);

    this.debugService.get(endpoint, params, true)
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }

  testUsersDirectNgrok() {
    this.resetState();
    const params = this.createPaginationParams(this.page, this.size);
    const endpoint = 'users';

    const url = this.debugService.getApiUrl(endpoint);
    const headers = this.debugService.getHeaders(true);

    // Convert headers to a plain object
    const headersObj: Record<string, string | string[]> = {};
    headers.keys().forEach(key => {
      const value = headers.getAll(key) || headers.get(key);
      if (value !== null) {
        headersObj[key] = value;
      }
    });

    // Convert params to a plain object
    const paramsObj: Record<string, string | string[]> = {};
    params.keys().forEach(key => {
      const value = params.getAll(key) || params.get(key);
      if (value !== null) {
        paramsObj[key] = value;
      }
    });

    this.logRequestDetails(url, 'GET', headersObj, paramsObj);

    this.debugService.get(endpoint, params, true)
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }

  testUsersSingleEndpoint() {
    this.resetState();
    const endpoint = 'users/1';

    const url = this.debugService.getApiUrl(endpoint);
    const headers = this.debugService.getHeaders(true);

    // Convert headers to a plain object
    const headersObj: Record<string, string | string[]> = {};
    headers.keys().forEach(key => {
      const value = headers.getAll(key) || headers.get(key);
      if (value !== null) {
        headersObj[key] = value;
      }
    });

    this.logRequestDetails(url, 'GET', headersObj, {});

    this.debugService.get(endpoint, undefined, true)
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }

  testCustomEndpoint() {
    if (!this.customPath) {
      this.error = 'Por favor, ingrese una ruta personalizada';
      return;
    }

    this.resetState();
    const endpoint = this.customPath.startsWith('/') ? this.customPath.substring(1) : this.customPath;
    const params = this.createPaginationParams(this.page, this.size);

    const url = this.debugService.getApiUrl(endpoint);
    const headers = this.debugService.getHeaders(true);

    // Convert headers to a plain object
    const headersObj: Record<string, string | string[]> = {};
    headers.keys().forEach(key => {
      const value = headers.getAll(key) || headers.get(key);
      if (value !== null) {
        headersObj[key] = value;
      }
    });

    // Convert params to a plain object
    const paramsObj: Record<string, string | string[]> = {};
    params.keys().forEach(key => {
      const value = params.getAll(key) || params.get(key);
      if (value !== null) {
        paramsObj[key] = value;
      }
    });

    this.logRequestDetails(url, 'GET', headersObj, paramsObj);

    this.debugService.get(endpoint, params, true)
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }
}
