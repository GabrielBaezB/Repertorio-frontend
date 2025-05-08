import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of, throwError } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment';
import { Registro } from '../models/registro.model';

@Injectable({ providedIn: 'root' })
export class PdfGeneratorService {

  /* ----------------------------------------------------
   *  Sólo necesitas BASE si más adelante quieres
   *  seguir usando el endpoint pdf-data/{id}.
   * ---------------------------------------------------*/
  private readonly BASE = environment.production
    ? 'https://b0f3-186-189-95-84.ngrok-free.app/api'
    : '/api';

  constructor(private http: HttpClient) {}

  /* ====================================================
   *  OPCIÓN 1 — si algún día quieres seguir usando
   *  /export/pdf-data/{id}.  (No se usa ahora mismo)
   * ====================================================*/
  private getData(id: number) {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`
    });

    return this.http.get<any>(`${this.BASE}/export/pdf-data/${id}`, { headers }).pipe(
      catchError(err => {
        console.error('No se pudo obtener el registro', err);
        return throwError(() => new Error('No se pudo obtener el registro'));
      })
    );
  }

  /* ====================================================
   *  API pública  (por si quieres mantener el endpoint)
   * ====================================================*/
  generate(id: number): Observable<void> {
    return this.getData(id).pipe(map(data => this.buildPdf(id, data)));
  }

  /* ====================================================
   *  NUEVO: genera el PDF a partir de la fila ya
   *  recibida en la tabla (sin pegarle al backend).
   * ====================================================*/
  generateFromRow(row: Registro): Observable<void> {
    const data = this.mapRow(row);
    return of(null).pipe(map(() => this.buildPdf(row.id!, data)));
  }

  /* --------- helpers --------- */

  private mapRow(r: Registro) {
    /*  Convierte el modelo que viene del backend al
        mismo “shape” que esperaba buildPdf()           */
    return {
      nro : r.nro,
      foj : r.foj,
      ano : r.ano,
      fesc: r.fesc,
      nom1: r.nom1,
      nom2: r.nom2,
      rut1: r.rut1,
      rut1d: r.rut1d,
      rut2: r.rut2,
      rut2d: r.rut2d,
      cont: r.cont,
      materia: r.materia,
      req : r.req,
      abog: r.abog,
      nBoleta: r.nBoleta,
      aran: r.aran,
      observacion: r.observacion
    };
  }

  private buildPdf(id: number, d: any) {
    const doc = new jsPDF();

    /* ---------- Cabecera ---------- */
    doc.setFontSize(18).setFont('helvetica', 'bold');
    doc.text(
      'CERTIFICADO DE REPERTORIO',
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: 'center' }
    );

    /* ---------- Tabla ---------- */
    const body: string[][] = [];
    const add = (k: string, v?: any) =>
      v !== undefined && v !== null && v !== '' && body.push([k, String(v)]);

    add('N.º Repertorio:', d.nro);
    add('Folio:',           d.foj);
    add('Año:',             d.ano);
    add('Fecha Escritura:', d.fesc);
    add('Compareciente 1:', d.nom1);
    add('RUT 1:', `${d.rut1 ?? ''}${d.rut1d ? '-' + d.rut1d : ''}`);
    add('Compareciente 2:', d.nom2);
    add('RUT 2:', `${d.rut2 ?? ''}${d.rut2d ? '-' + d.rut2d : ''}`);
    add('Tipo Documento:',  d.cont);
    add('Materia:',         d.materia);
    add('Requirente:',      d.req);
    add('Abogado:',         d.abog);
    add('N.º Boleta:',      d.nBoleta);
    add('Arancel:',         d.aran);
    add('Observaciones:',   d.observacion);

    autoTable(doc, {
      startY: 30,
      head: [],
      body,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 60, fontStyle: 'bold', fillColor: [230, 230, 230] },
        1: { cellWidth: 'auto' }
      },
      margin: { left: 20, right: 20 }
    });

    /* ---------- Pie ---------- */
    const y = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(9);
    doc.text(
      'Este documento es constancia del registro notarial y no constituye copia autorizada del instrumento.',
      doc.internal.pageSize.getWidth() / 2,
      y,
      { align: 'center', maxWidth: 170 }
    );

    doc.save(`registro_${id}.pdf`);
  }
}
