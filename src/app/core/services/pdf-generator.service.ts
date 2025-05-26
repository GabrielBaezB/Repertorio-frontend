import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of, throwError } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from '../../../environments/environment';
import { Registro } from '../models/registro.model';

interface PdfData {
  nro?: string | number;
  foj?: string | number;
  ano?: string | number;
  fesc?: string;
  nom1?: string;
  nom2?: string;
  cont?: string;
  materia?: string;
  req?: string;
  abog?: string;
  nBoleta?: string | number;
  aran?: string | number;
  observacion?: string;
  [key: string]: string | number | undefined;
}

interface JsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}
@Injectable({ providedIn: 'root' })
export class PdfGeneratorService {

  /* ----------------------------------------------------
   *  Sólo necesitas BASE si más adelante quieres
   *  seguir usando el endpoint pdf-data/{id}.
   * ---------------------------------------------------*/
  private readonly BASE = environment.production
    ? 'https://e4c6-2800-150-150-1e92-fdda-4273-98e3-222b.ngrok-free.app/api'
    : '/api';

  constructor(private http: HttpClient) {}

  /* ====================================================
   *  OPCIÓN 1 — si algún día quieres seguir usando
   *  /export/pdf-data/{id}.  (No se usa ahora mismo)
   * ====================================================*/
  private getData(id: number) {
    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    return this.http.get<PdfData>(`${this.BASE}/export/pdf-data/${id}`, { headers }).pipe(
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
      // rut1: r.rut1,
      // rut1d: r.rut1d,
      // rut2: r.rut2,
      // rut2d: r.rut2d,
      cont: r.cont,
      materia: r.materia,
      req : r.req,
      abog: r.abog,
      nBoleta: r.nBoleta,
      aran: r.aran,
      observacion: r.observacion
    };
  }

  private buildPdf(id: number, d: PdfData) {
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
    const add = (k: string, v?: string | number ) =>
      v !== undefined && v !== null && v !== '' && body.push([k, String(v)]);

    add('N.º Repertorio:', d.nro);
    add('Folio:',           d.foj);
    add('Año:',             d.ano);
    add('Fecha Escritura:', d.fesc);
    add('Compareciente 1:', d.nom1);
    add('Compareciente 2:', d.nom2);
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
    const y = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 15;
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
