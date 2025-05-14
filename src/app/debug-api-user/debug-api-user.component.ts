// src/app/debug-api-user/debug-api-user.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DebugService } from '../core/services/debug.service';
import { DebugBaseComponent } from '../shared/components/debug-base/debug-base.component';

@Component({
  selector: 'app-debug-api-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; border: 1px solid #ccc; margin: 20px;">
      <h2>Users API Debugging</h2>

      <div style="margin-bottom: 20px;">
        <h3>Test Configuration</h3>
        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
          <div>
            <label>Page:
              <input type="number" [(ngModel)]="page" min="0" style="width: 50px;">
            </label>
          </div>
          <div>
            <label>Size:
              <input type="number" [(ngModel)]="size" min="1" style="width: 50px;">
            </label>
          </div>
          <div *ngIf="showAdvanced">
            <label>Custom Path:
              <input type="text" [(ngModel)]="customPath" style="width: 150px;">
            </label>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <label>
            <input type="checkbox" [(ngModel)]="showAdvanced">
            Show Advanced Options
          </label>
        </div>
      </div>

      <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px;">
        <button (click)="testUsersWithNetlify()">Test Users with Netlify</button>
        <button (click)="testUsersDirectNgrok()">Test Users Direct Ngrok</button>
        <button (click)="testUsersSingleEndpoint()">Test Get Single User</button>
        <button *ngIf="showAdvanced" (click)="testCustomEndpoint()">Test Custom Endpoint</button>
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
export class DebugApiUserComponent extends DebugBaseComponent {
  customPath = '';

  constructor(protected override debugService: DebugService) {
    super(debugService);
  }

  testUsersWithNetlify() {
    this.resetState();
    const params = this.createPaginationParams(this.page, this.size);
    const endpoint = 'api/users';

    this.logRequestDetails(`/api/${endpoint}`, 'GET', this.debugService.getHeaders(true), params);

    this.debugService.get(endpoint, params, true)
      .subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
  }

  testUsersDirectNgrok() {
    this.resetState();
    const params = this.createPaginationParams(this.page, this.size);
    const endpoint = 'users';

    const url = this.debugService.getApiUrl(endpoint);
    const headers = this.debugService.getHeaders(true);

    this.logRequestDetails(url, 'GET', headers, params);

    this.debugService.get(endpoint, params, true)
      .subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
  }

  testUsersSingleEndpoint() {
    this.resetState();
    const endpoint = 'users/1';

    const url = this.debugService.getApiUrl(endpoint);
    const headers = this.debugService.getHeaders(true);

    this.logRequestDetails(url, 'GET', headers, {});

    this.debugService.get(endpoint, undefined, true)
      .subscribe({
        next: (data) => this.handleSuccess(data),
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

    this.logRequestDetails(url, 'GET', headers, params);

    this.debugService.get(endpoint, params, true)
      .subscribe({
        next: (data) => this.handleSuccess(data),
        error: (err) => this.handleError(err)
      });
  }
}
