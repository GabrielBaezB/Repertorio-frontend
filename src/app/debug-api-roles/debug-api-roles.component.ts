// src/app/debug-api-roles/debug-api-roles.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  selector: 'app-debug-api-roles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; border: 1px solid #ccc; margin: 20px;">
      <h2>Roles API Debugging</h2>

      <div>
        <button (click)="testWithNetlify()">Test Roles with Netlify</button>
        <button (click)="testDirectNgrok()">Test Roles Direct Ngrok</button>
        <button (click)="testSingleRole()">Test Single Role</button>
      </div>

      <div *ngIf="loading" style="margin-top: 15px; color: blue;">
        <p>Loading... Please wait...</p>
      </div>

      <div *ngIf="error" style="margin-top: 15px; color: red; border: 1px solid #ffcccc; padding: 10px; background-color: #fff5f5;">
        <h3>Error</h3>
        <p><strong>Status:</strong> {{ errorStatus }}</p>
        <p><strong>Message:</strong> {{ error }}</p>
        <div *ngIf="errorDetails">
          <h4>Error Details:</h4>
          <pre style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 4px;">{{ errorDetails | json }}</pre>
        </div>
      </div>

      <div *ngIf="result" style="margin-top: 15px; border: 1px solid #ccffcc; padding: 10px; background-color: #f5fff5;">
        <h3>Result</h3>
        <pre style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 4px; max-height: 400px; overflow: auto;">{{ result | json }}</pre>
      </div>

      <div *ngIf="requestDetails" style="margin-top: 15px; border: 1px solid #e0e0e0; padding: 10px; background-color: #f9f9f9;">
        <h3>Request Details</h3>
        <p><strong>URL:</strong> {{ requestDetails.url }}</p>
        <p><strong>Method:</strong> {{ requestDetails.method }}</p>
        <p><strong>Headers:</strong></p>
        <pre style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 4px;">{{ requestDetails.headers | json }}</pre>
        <p><strong>Params:</strong></p>
        <pre style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 4px;">{{ requestDetails.params | json }}</pre>
      </div>
    </div>
  `
})
export class DebugApiRolesComponent extends DebugBaseComponent {
  constructor(protected override debugService: DebugService) {
    super(debugService);
  }

  testWithNetlify() {
    this.resetState();
    const endpoint = 'api/roles';
    const url = `/api/${endpoint}`;
    const headers = this.debugService.getHeaders(true); // Con autenticación

    // Convert headers to a plain object
    const headersObj: Record<string, string | string[]> = {};
    headers.keys().forEach(key => {
      const value = headers.getAll(key) || headers.get(key);
      if (value !== null) {
        headersObj[key] = value;
      }
    });
    this.logRequestDetails(url, 'GET', headersObj, {});

    this.debugService.get(endpoint, undefined, true) // Con autenticación
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }

  testDirectNgrok() {
    this.resetState();
    const endpoint = 'roles';
    const url = this.debugService.getApiUrl(endpoint);
    const headers = this.debugService.getHeaders(true); // Con autenticación

    const headersObj: Record<string, string | string[]> = {};
    headers.keys().forEach(key => {
      const value = headers.getAll(key) || headers.get(key);
      if (value !== null) {
        headersObj[key] = value;
      }
    });
    this.logRequestDetails(url, 'GET', headersObj, {});

    this.debugService.get(endpoint, undefined, true) // Con autenticación
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }

  testSingleRole() {
    this.resetState();
    const endpoint = 'roles/1';
    const url = this.debugService.getApiUrl(endpoint);
    const headers = this.debugService.getHeaders(true); // Con autenticación

    // Convert headers to a plain object
    const headersObj: Record<string, string | string[]> = {};
    headers.keys().forEach(key => {
      const value = headers.getAll(key) || headers.get(key);
      if (value !== null) {
        headersObj[key] = value;
      }
    });
    this.logRequestDetails(url, 'GET', headersObj, {});

    this.debugService.get(endpoint, undefined, true) // Con autenticación
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }
}
