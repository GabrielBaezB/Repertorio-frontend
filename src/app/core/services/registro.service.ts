import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Registro } from '../models/registro.model';
import { environment } from '../../../environments/environment';

// Define interfaces for type safety
interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

type SearchParams = Record<string, string | number | boolean | undefined>;

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  private readonly API_URL = environment.production
    ? 'https://e4c6-2800-150-150-1e92-fdda-4273-98e3-222b.ngrok-free.app/api/registros'  // URL directa
    : `${environment.apiUrl}/api/registros`;  // URL de desarrollo

  constructor(private http: HttpClient) {
    console.log('API_URL configurada:', this.API_URL);
  }

  getAll(page = 0, size = 10, sort = 'createdAt,desc'): Observable<PageResponse<Registro>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    console.log('Parámetros:', params.toString());
    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });
    console.log('Realizando solicitud a:', this.API_URL);

    return this.http.get<PageResponse<Registro>>(this.API_URL, { params, headers }).pipe(
      catchError(error => {
        console.error('Error fetching registros:', error);
        return throwError(() => new Error('Failed to fetch registros'));
      })
    );
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

  search(params: SearchParams): Observable<PageResponse<Registro>> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, String(params[key]));
      }
    });
    return this.http.get<PageResponse<Registro>>(`${this.API_URL}/buscar`, {
      params: httpParams,
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
  }

  // ----------------------------------------------------
  // BÚSQUEDA AVANZADA (nom1, nom2, ano, materia, paginación)
  // ----------------------------------------------------
  searchAdvanced(
    nom1?: string,
    nom2?: string,
    ano?: string,
    materia?: string,
    page = 0,
    size = 10,
    sort = 'createdAt,desc'
  ): Observable<PageResponse<Registro>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    if (nom1) { params = params.set('nom1', nom1); }
    if (nom2) { params = params.set('nom2', nom2); }
    if (ano) { params = params.set('ano', ano); }
    if (materia) { params = params.set('materia', materia); }

    return this.http.get<PageResponse<Registro>>(`${this.API_URL}/buscar`, { params, headers: { 'ngrok-skip-browser-warning': 'true' } });
  }

  globalSearch(
    q: string,
    page = 0,
    size = 10,
    sort = 'createdAt,desc'
  ): Observable<PageResponse<Registro>> {
    const params = new HttpParams()
      .set('q', q || '')
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort)

    return this.http.get<PageResponse<Registro>>(`${this.API_URL}/search`, { params, headers: { 'ngrok-skip-browser-warning': 'true' } });
  }

  exportToExcel(ano: string): Observable<Blob> {
    // Usar la ruta relativa
    const url = `/api/export/excel/${ano}`;

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    return this.http.get(url, {
      headers,
      responseType: 'blob'
    });
  }

  exportToExcelFiltered(params: SearchParams): Observable<Blob> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== '' && params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, String(params[key]));
      }
    });

    const url = `/api/export/excel-filtrado`;

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    return this.http.get(url, {
      headers,
      params: httpParams,
      responseType: 'blob'
    });
  }
}
