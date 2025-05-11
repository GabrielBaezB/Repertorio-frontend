// src/app/debug-api/debug-api.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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

      <div *ngIf="loading">Loading...</div>

      <div *ngIf="error" style="color: red; margin-top: 15px;">
        <p><strong>Error:</strong> {{ error }}</p>
      </div>

      <div *ngIf="result" style="margin-top: 15px;">
        <pre>{{ result | json }}</pre>
      </div>
    </div>
  `
})
export class DebugApiComponent {
  loading = false;
  error: string | null = null;
  result: any = null;

  constructor(private http: HttpClient) {}

  testWithNetlify() {
    this.loading = true;
    this.error = null;
    this.result = null;

    const params = new HttpParams()
      .set('page', '0')
      .set('size', '5')
      .set('sort', 'createdAt,desc');

    this.http.get('/api/api/registros', { params })
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.result = data;
        },
        error: (err) => {
          this.loading = false;
          this.error = `Status: ${err.status}. Message: ${err.message}`;
          console.error('Full error:', err);
        }
      });
  }

  testDirectNgrok() {
    this.loading = true;
    this.error = null;
    this.result = null;

    const params = new HttpParams()
      .set('page', '0')
      .set('size', '5')
      .set('sort', 'createdAt,desc');

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });;

    this.http.get('https://50fa-201-219-233-176.ngrok-free.app/api/registros', { params, headers })
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.result = data;
        },
        error: (err) => {
          this.loading = false;
          this.error = `Status: ${err.status}. Message: ${err.message}`;
          console.error('Full error:', err);
        }
      });
  }

  testWithParams() {
    this.loading = true;
    this.error = null;
    this.result = null;

    // Probar un formato diferente para los parámetros
    const params = new HttpParams()
      .set('page', '0')
      .set('size', '5');

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    this.http.get('https://50fa-201-219-233-176.ngrok-free.app/api/registros', { params, headers })
      .subscribe({
        next: (data) => {
          this.loading = false;
          this.result = data;
        },
        error: (err) => {
          this.loading = false;
          this.error = `Status: ${err.status}. Message: ${err.message}`;
          console.error('Full error:', err);
        }
      });
  }
}
