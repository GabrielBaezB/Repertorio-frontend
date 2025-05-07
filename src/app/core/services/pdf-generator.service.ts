// src/app/services/pdf-generator.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  constructor(private http: HttpClient) {}

  // Obtener datos del registro
  getRegistroData(id: number): Observable<any> {
    return this.http.get<any>(`/api/export/pdf-data/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener datos del registro:', error);
        return throwError(() => new Error('No se pudieron obtener los datos del registro.'));
      })
    );
  }

  // Generar y descargar PDF
  generatePdf(id: number): Observable<void> {
    return this.getRegistroData(id).pipe(
      map(data => {
        // Crear documento PDF
        const doc = new jsPDF();

        // Configurar título
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('CERTIFICADO DE REPERTORIO', doc.internal.pageSize.width / 2, 20, { align: 'center' });

        // Crear tabla con los datos
        const tableBody: string[][] = [];

        // Añadir filas a la tabla, siguiendo el mismo orden que en el backend
        this.addTableRow(tableBody, 'N° Repertorio:', data.nro || '');
        this.addTableRow(tableBody, 'Folio:', data.foj || '');
        this.addTableRow(tableBody, 'Año:', data.ano || '');
        this.addTableRow(tableBody, 'Fecha Escritura:', data.fesc || '');
        this.addTableRow(tableBody, 'Compareciente 1:', data.nom1 || '');

        // Formatear RUT1 como en el backend
        const rut1 = data.rut1 ?
          `${data.rut1}${data.rut1d ? '-' + data.rut1d : ''}` : '';
        this.addTableRow(tableBody, 'RUT 1:', rut1);

        // Añadir Compareciente 2 y RUT 2 solo si existe
        if (data.nom2) {
          this.addTableRow(tableBody, 'Compareciente 2:', data.nom2);
          const rut2 = data.rut2 ?
            `${data.rut2}${data.rut2d ? '-' + data.rut2d : ''}` : '';
          this.addTableRow(tableBody, 'RUT 2:', rut2);
        }

        // Añadir campos opcionales solo si existen
        if (data.cont) this.addTableRow(tableBody, 'Tipo Documento:', data.cont);
        if (data.materia) this.addTableRow(tableBody, 'Materia:', data.materia);
        if (data.req) this.addTableRow(tableBody, 'Requirente:', data.req);
        if (data.abog) this.addTableRow(tableBody, 'Abogado:', data.abog);
        if (data.nBoleta) this.addTableRow(tableBody, 'N° Boleta:', data.nBoleta);
        if (data.aran) this.addTableRow(tableBody, 'Arancel:', data.aran);
        if (data.observacion) this.addTableRow(tableBody, 'Observaciones:', data.observacion);

        // Configurar y añadir la tabla al documento
        autoTable(doc, {
          startY: 30,
          head: [], // Sin encabezado
          body: tableBody,
          theme: 'grid',
          columnStyles: {
            0: {
              cellWidth: 60,
              fillColor: [211, 211, 211], // Light Gray para simular el estilo del backend
              fontStyle: 'bold'
            },
            1: { cellWidth: 'auto' }
          },
          styles: {
            fontSize: 10,
            cellPadding: 5
          },
          margin: { left: 20, right: 20 }
        });

        // Añadir pie de página
        const finalY = (doc as any).lastAutoTable.finalY || 150;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(
          'Este documento es una constancia del registro notarial y no constituye copia autorizada del instrumento.',
          doc.internal.pageSize.width / 2,
          finalY + 20,
          { align: 'center', maxWidth: 170 }
        );

        // Descargar PDF
        doc.save(`registro_${id}.pdf`);
      }),
      catchError(error => {
        console.error('Error al generar PDF:', error);
        return throwError(() => new Error('Error al generar el PDF. Por favor, inténtelo más tarde.'));
      })
    );
  }

  // Método auxiliar para añadir filas a la tabla
  private addTableRow(tableBody: any[], header: string, value: string) {
    tableBody.push([header, value]);
  }

  // Método para vista previa (opcional)
  previewPdf(id: number): Observable<string> {
    return this.getRegistroData(id).pipe(
      map(data => {
        // Mismo código para generar el PDF que en generatePdf
        const doc = new jsPDF();
        // ... (código para generar el PDF)

        // En lugar de descargar, devuelve una URL de datos
        const pdfDataUri = doc.output('datauristring');
        return pdfDataUri;
      })
    );
  }
}
