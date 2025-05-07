// src/app/debug-api-users/debug-api-users.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-debug-api-users',
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
export class DebugApiUsersComponent {
  loading = false;
  error: string | null = null;
  errorStatus: number | null = null;
  errorDetails: any = null;
  result: any = null;
  requestDetails: any = null;

  page = 0;
  size = 10;
  customPath = 'test'; // Valor predeterminado para pruebas personalizadas
  showAdvanced = false;

  constructor(private http: HttpClient) {}

  private resetState() {
    this.loading = true;
    this.error = null;
    this.errorStatus = null;
    this.errorDetails = null;
    this.result = null;
    this.requestDetails = null;
  }

  private logRequestDetails(url: string, method: string, headers: any, params: any) {
    this.requestDetails = {
      url,
      method,
      headers,
      params
    };
    console.log('Request details:', this.requestDetails);
  }

  testUsersWithNetlify() {
    this.resetState();

    const params = new HttpParams()
      .set('page', this.page.toString())
      .set('size', this.size.toString());

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    });

    const url = '/api/api/users';
    this.logRequestDetails(url, 'GET', headers, params);

    this.http.get(url, { params, headers })
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.result = data;
        },
        error: (err) => {
          this.loading = false;
          this.errorStatus = err.status;
          this.error = err.message;
          this.errorDetails = err.error;
          console.error('Full error:', err);
        }
      });
  }

  testUsersDirectNgrok() {
    this.resetState();

    const params = new HttpParams()
      .set('page', this.page.toString())
      .set('size', this.size.toString());

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    });

    const url = 'https://b0f3-186-189-95-84.ngrok-free.app/api/users';
    this.logRequestDetails(url, 'GET', headers, params);

    this.http.get(url, { params, headers })
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.result = data;
        },
        error: (err) => {
          this.loading = false;
          this.errorStatus = err.status;
          this.error = err.message;
          this.errorDetails = err.error;
          console.error('Full error:', err);
        }
      });
  }

  testUsersSingleEndpoint() {
    this.resetState();

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    });

    // Intenta obtener el usuario con ID 1 (asumiendo que existe)
    const url = 'https://b0f3-186-189-95-84.ngrok-free.app/api/users/1';
    this.logRequestDetails(url, 'GET', headers, {});

    this.http.get(url, { headers })
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.result = data;
        },
        error: (err) => {
          this.loading = false;
          this.errorStatus = err.status;
          this.error = err.message;
          this.errorDetails = err.error;
          console.error('Full error:', err);
        }
      });
  }

  testCustomEndpoint() {
    this.resetState();

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    });

    // URL personalizada usando el path proporcionado por el usuario
    const url = `https://b0f3-186-189-95-84.ngrok-free.app/api/users/${this.customPath}`;
    this.logRequestDetails(url, 'GET', headers, {});

    this.http.get(url, { headers })
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.result = data;
        },
        error: (err) => {
          this.loading = false;
          this.errorStatus = err.status;
          this.error = err.message;
          this.errorDetails = err.error;
          console.error('Full error:', err);
        }
      });
  }
}
