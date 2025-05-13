// src/app/debug-api-roles/debug-api-roles.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

      <div *ngIf="loading">Loading...</div>

      <div *ngIf="error" style="color: red; margin-top: 15px;">
        <p><strong>Error:</strong> {{ error }}</p>
        <pre *ngIf="errorDetails">{{ errorDetails | json }}</pre>
      </div>

      <div *ngIf="result" style="margin-top: 15px;">
        <pre>{{ result | json }}</pre>
      </div>
    </div>
  `
})
export class DebugApiRolesComponent {
  loading = false;
  error: string | null = null;
  errorDetails: any = null;
  result: any = null;

  constructor(private http: HttpClient) {}

  testWithNetlify() {
    this.loading = true;
    this.error = null;
    this.errorDetails = null;
    this.result = null;

    // Prueba usando la URL de Netlify con redirección
    this.http.get('/api/api/roles', {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    }).subscribe({
      next: (data) => {
        this.loading = false;
        this.result = data;
      },
      error: (err) => {
        this.loading = false;
        this.error = `Status: ${err.status}. Message: ${err.message}`;
        this.errorDetails = err.error;
        console.error('Full error:', err);
      }
    });
  }

  testDirectNgrok() {
    this.loading = true;
    this.error = null;
    this.errorDetails = null;
    this.result = null;

    // Prueba directamente a Ngrok
    this.http.get('https://50fa-201-219-233-176.ngrok-free.app/api/roles', {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    }).subscribe({
      next: (data) => {
        this.loading = false;
        this.result = data;
      },
      error: (err) => {
        this.loading = false;
        this.error = `Status: ${err.status}. Message: ${err.message}`;
        this.errorDetails = err.error;
        console.error('Full error:', err);
      }
    });
  }

  testSingleRole() {
    this.loading = true;
    this.error = null;
    this.errorDetails = null;
    this.result = null;

    // Prueba un rol específico (ID 1)
    this.http.get('https://50fa-201-219-233-176.ngrok-free.app/api/roles/1', {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
      }
    }).subscribe({
      next: (data) => {
        this.loading = false;
        this.result = data;
      },
      error: (err) => {
        this.loading = false;
        this.error = `Status: ${err.status}. Message: ${err.message}`;
        this.errorDetails = err.error;
        console.error('Full error:', err);
      }
    });
  }
}
