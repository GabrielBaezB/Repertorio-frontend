import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Registro } from '../models/registro.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  // private readonly API_URL = `${environment.apiUrl}/registros`;

  private readonly API_URL = environment.production
  ? 'https://b0f3-186-189-95-84.ngrok-free.app/api/registros'  // URL directa
  : `${environment.apiUrl}/api/registros`;  // URL de desarrollo

  constructor(private http: HttpClient) {
    console.log('API_URL configurada:', this.API_URL);
  }


  getAll(page = 0, size = 10, sort = 'createdAt,desc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    // Añadir encabezados específicos para ngrok
    console.log('Parámetros:', params.toString());
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });
    console.log('Realizando solicitud a:', this.API_URL);
    return this.http.get<any>(this.API_URL, { params, headers });
  }

  getById(id: number): Observable<Registro> {
    return this.http.get<Registro>(`${this.API_URL}/${id}`);
  }

  create(registro: Registro): Observable<Registro> {
    return this.http.post<Registro>(this.API_URL, registro);
  }

  update(id: number, registro: Registro): Observable<Registro> {
    return this.http.put<Registro>(`${this.API_URL}/${id}`, registro);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  search(params: any): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/buscar`, { params, headers: { 'ngrok-skip-browser-warning': 'true' } });
  }


  // ----------------------------------------------------
  // BÚSQUEDA AVANZADA (nom1, nom2, ano, materia, paginación)
  // ----------------------------------------------------
  searchAdvanced(
    nom1?: string,
    nom2?: string,
    ano?: string,
    materia?: string,
    page: number = 0,
    size: number = 10,
    sort: string = 'createdAt,desc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('page',  page.toString())
      .set('size',  size.toString())
      .set('sort',  sort);

    if (nom1)    { params = params.set('nom1',    nom1); }
    if (nom2)    { params = params.set('nom2',    nom2); }
    if (ano)     { params = params.set('ano',     ano); }
    if (materia) { params = params.set('materia', materia); }

    return this.http.get<any>(`${this.API_URL}/buscar`, { params, headers: { 'ngrok-skip-browser-warning': 'true' } });
  }

  globalSearch(
    q: string,
    page = 0,
    size = 10,
    sort = 'createdAt,desc'
  ): Observable<any> {
    let params = new HttpParams()
      .set('q', q || '')
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    return this.http.get<any>(`${this.API_URL}/search`, { params, headers: { 'ngrok-skip-browser-warning': 'true' } });
  }

  // Método para exportar registros a Excel por año
  exportToExcel(ano: string): Observable<Blob> {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(`${this.API_URL}/export/excel/${ano}`, {
      headers,
      responseType: 'blob'
    });
  }

  // Método para exportar registros a Excel con filtros
  exportToExcelFiltered(params: any): Observable<Blob> {
    // Construir parámetros de consulta a partir del objeto de parámetros
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key]);
      }
    });

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(`${this.API_URL}/export/excel-filtrado`, {
      headers,
      params: httpParams,
      responseType: 'blob'
    });


  }
  // Método para exportar un registro individual a PDF
  exportToPdf(id: number): Observable<Blob> {
    // Usar la misma base URL que los otros métodos
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(`${this.API_URL}/export/pdf/${id}`, {
      headers,
      responseType: 'blob'
    });
  }
}
