// src/app/debug-api/debug-api.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { DebugService } from '../core/services/debug.service';
import { DebugBaseComponent } from '../shared/components/debug-base/debug-base.component';

// Define ApiResponse interface if not already defined elsewhere
@Component({
  selector: 'app-debug-api',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; border: 1px solid #ccc; margin: 20px;">
      <h2>API Debugging</h2>

      <div>
        <button (click)="testWithNetlify()">Test with Netlify</button>
        <button (click)="testDirectNgrok()">Test Direct Ngrok</button>
        <button (click)="testWithParams()">Test with Custom Params</button>
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
export class DebugApiComponent extends DebugBaseComponent {
  constructor(protected override debugService: DebugService) {
    super(debugService);
  }

  testWithNetlify() {
    this.resetState();
    const params = this.createPaginationParams();
    const endpoint = 'api/registros';

    // Convert params to a plain object
    const paramsObj: Record<string, string | string[]> = {};
    params.keys().forEach(key => {
      const value = params.getAll(key) || params.get(key);
      if (value !== null) {
        paramsObj[key] = value;
      }
    });

    this.logRequestDetails(`/api/${endpoint}`, 'GET', {}, paramsObj);

    this.debugService.get(endpoint, params)
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }

  testDirectNgrok() {
    this.resetState();
    const params = this.createPaginationParams();
    const endpoint = 'registros';

    const url = this.debugService.getApiUrl(endpoint);
    const headers = this.debugService.getHeaders();

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

    this.debugService.get(endpoint, params)
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }

  testWithParams() {
    this.resetState();
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '5');

    const endpoint = 'registros';

    const headers = this.debugService.getHeaders();

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

    this.logRequestDetails(this.debugService.getApiUrl(endpoint), 'GET', headersObj, paramsObj);

    this.debugService.get(endpoint, params)
      .subscribe({
        next: (data) => this.handleSuccess({ data }),
        error: (err) => this.handleError(err)
      });
  }
}
