// src/app/debug-export/debug-export.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DebugService } from '../core/services/debug.service';
import { DebugBaseComponent } from '../shared/components/debug-base/debug-base.component';

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
          <input type="number" [(ngModel)]="registroId" style="margin-left: 10px;" min="1">
        </label>
        <button (click)="testPdfExport()" style="margin-left: 10px;">Exportar PDF</button>
      </div>

      <div *ngIf="loading" style="margin-top: 15px; color: blue;">
        <p>Loading... Please wait...</p>
      </div>

      <div *ngIf="error" style="margin-top: 15px; color: red; border: 1px solid #ffcccc; padding: 10px; background-color: #fff5f5;">
        <h3>Error</h3>
        <p>{{ error }}</p>
      </div>

      <div *ngIf="success" style="margin-top: 15px; color: green; border: 1px solid #ccffcc; padding: 10px; background-color: #f5fff5;">
        <h3>Success</h3>
        <p>PDF generado correctamente ({{ fileSize }} bytes)</p>
        <button (click)="downloadFile()">Descargar PDF</button>
      </div>

      <div *ngIf="requestDetails" style="margin-top: 15px; border: 1px solid #e0e0e0; padding: 10px; background-color: #f9f9f9;">
        <h3>Request Details</h3>
        <p><strong>URL:</strong> {{ requestDetails.url }}</p>
        <p><strong>Method:</strong> {{ requestDetails.method }}</p>
        <p><strong>Headers:</strong></p>
        <pre style="white-space: pre-wrap; background-color: #f8f8f8; padding: 10px; border-radius: 4px;">{{ requestDetails.headers | json }}</pre>
      </div>
    </div>
  `
})
export class DebugExportComponent extends DebugBaseComponent {
  registroId = 39532; // ID por defecto para probar
  success = false;
  fileSize = 0;
  pdfBlob: Blob | null = null;

  constructor(
    protected override debugService: DebugService,
    private http: HttpClient
  ) {
    super(debugService);
  }

  testPdfExport() {
    // Validar que el ID sea un número válido
    if (!this.registroId || this.registroId <= 0) {
      this.error = 'Por favor, ingrese un ID de registro válido';
      return;
    }

    this.resetState();
    this.success = false;
    this.pdfBlob = null;

    // Usar el endpoint estandarizado
    const endpoint = `export/pdf/${this.registroId}`;
    const url = this.debugService.getApiUrl(endpoint);
    const headers = this.debugService.getHeaders();

    this.logRequestDetails(url, 'GET', headers, {});

    // Usar HttpClient directamente para manejar la respuesta como blob
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

        // Si falla, intentar con un endpoint alternativo de manera más controlada
        if (this.shouldTryAlternativeEndpoint(err)) {
          this.tryAlternativeEndpoint();
        }
      }
    });
  }

  // Método para determinar si se debe intentar con un endpoint alternativo
  private shouldTryAlternativeEndpoint(err: any): boolean {
    return err.status === 404 || err.status === 500;
  }

  // Método para probar con un endpoint alternativo
  private tryAlternativeEndpoint() {
    const alternativeEndpoint = `registros/export/${this.registroId}`;
    const url = this.debugService.getApiUrl(alternativeEndpoint);
    const headers = this.debugService.getHeaders();

    console.log(`Intentando con endpoint alternativo: ${url}`);
    this.logRequestDetails(url, 'GET', headers, {});

    this.http.get(url, {
      headers,
      responseType: 'blob'
    }).subscribe({
      next: (data: Blob) => {
        this.loading = false;
        this.success = true;
        this.pdfBlob = data;
        this.fileSize = data.size;
        console.log('PDF descargado correctamente con endpoint alternativo:', data);
      },
      error: (err) => {
        this.loading = false;
        this.error = `Error con endpoint alternativo (${err.status}): ${err.message}`;
        console.error('Error al exportar PDF con endpoint alternativo:', err);
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
