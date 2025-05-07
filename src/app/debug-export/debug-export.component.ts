// src/app/debug-export/debug-export.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-debug-export',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; border: 1px solid #ccc; margin: 20px;">
      <h2>Export API Debugging</h2>

      <div>
        <label>
          ID del registro:
          <input type="number" [(ngModel)]="registroId" style="margin-left: 10px;">
        </label>

        <button (click)="testPdfExport()" style="margin-left: 15px;">
          Probar Exportación PDF
        </button>
      </div>

      <div *ngIf="loading" style="margin-top: 15px;">Cargando...</div>

      <div *ngIf="error" style="color: red; margin-top: 15px;">
        <p><strong>Error:</strong> {{ error }}</p>
      </div>

      <div *ngIf="success" style="color: green; margin-top: 15px;">
        <p>¡PDF generado correctamente! Tamaño: {{ fileSize }} bytes</p>
        <button (click)="downloadFile()">Descargar PDF</button>
      </div>
    </div>
  `
})
export class DebugExportComponent {
  registroId = 39532; // ID por defecto para probar
  loading = false;
  error: string | null = null;
  success = false;
  fileSize = 0;
  pdfBlob: Blob | null = null;

  constructor(private http: HttpClient) {}

  testPdfExport() {
    this.loading = true;
    this.error = null;
    this.success = false;
    this.pdfBlob = null;

    // Probar diferentes rutas para identificar cuál funciona
    this.testUrl(`https://b0f3-186-189-95-84.ngrok-free.app/api/registros/${this.registroId}/pdf`);
  }

  testUrl(url: string) {
    console.log(`Probando URL: ${url}`);

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
    });

    this.http.get(url, {
      headers,
      responseType: 'blob'
    }).subscribe({
      next: (data: Blob) => {
        this.loading = false;
        this.success = true;
        this.pdfBlob = data;
        this.fileSize = data.size;
        console.log('PDF descargado correctamente:', data);
      },
      error: (err) => {
        this.loading = false;
        this.error = `Error (${err.status}): ${err.message}`;
        console.error('Error al exportar PDF:', err);

        // Si este método falla, probar con la siguiente URL
        if (url.includes('/registros/')) {
          this.testUrl(`https://b0f3-186-189-95-84.ngrok-free.app/api/export/pdf/${this.registroId}`);
        }
      }
    });
  }

  downloadFile() {
    if (this.pdfBlob) {
      const url = window.URL.createObjectURL(this.pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registro_${this.registroId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  }
}
