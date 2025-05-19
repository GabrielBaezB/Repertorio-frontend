// core/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
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

interface UserCreateDTO {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
  enabled?: boolean;
  roles: string[] | number[];
}

interface UserUpdateDTO {
  email?: string;
  fullName?: string;
  enabled?: boolean;
  roles?: string[] | number[];
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = environment.production
    ? 'https://34f5-186-189-72-136.ngrok-free.app/api/users'  // URL directa
    : `${environment.apiUrl}/api/users`;  // URL de desarrollo

  constructor(private http: HttpClient) {
    console.log('API_URL configurada:', this.API_URL);
  }

  getAll(page = 0, size = 10, sort = 'createdAt,desc'): Observable<PageResponse<User>> {
    console.log(`Consultando usuarios - página ${page}, tamaño ${size}`);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    // Añadir encabezados específicos para ngrok
    console.log('Parámetros:', params.toString());
    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    console.log('Getting users from:', this.API_URL);

    return this.http.get<PageResponse<User>>(this.API_URL, { params, headers }).pipe(
      tap(response => {
        console.log('===== Respuesta del servidor =====');
        console.log('Datos recibidos:', response);
        console.log('Tipo de datos:', typeof response);
        if (Array.isArray(response)) {
          console.log('Es un array de longitud:', response.length);
        } else if (response && typeof response === 'object') {
          console.log('Es un objeto con propiedades:', Object.keys(response));
          if (response.content) {
            console.log('Contenido:', response.content.length, 'elementos');
          }
        }
        console.log('================================');
      }),
      catchError(error => {
        console.error('Error obteniendo usuarios:', error);
        console.error('Código de estado:', error.status);
        console.error('Mensaje:', error.message);
        console.error('Respuesta del servidor:', error.error);
        return throwError(() => error);
      })
    );
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/${id}`);
  }

  create(userData: UserCreateDTO): Observable<User> {
    console.log('Creando usuario con datos:', userData);
    return this.http.post<User>(this.API_URL, userData).pipe(
      tap(response => console.log('Respuesta al crear usuario:', response)),
      catchError(error => {
        console.error('Error al crear usuario:', error);
        return throwError(() => error);
      })
    );
  }

  update(id: number, userData: UserUpdateDTO): Observable<User> {
    console.log(`Actualizando usuario ${id} con datos:`, userData);
    return this.http.put<User>(`${this.API_URL}/${id}`, userData).pipe(
      tap(response => console.log('Respuesta al actualizar usuario:', response)),
      catchError(error => {
        console.error('Error al actualizar usuario:', error);
        return throwError(() => error);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  changePassword(id: number, password: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${id}/change-password`, { password });
  }

  toggleStatus(id: number, enabled: boolean): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/${id}/status`, { enabled }).pipe(
      catchError(error => {
        console.error('Error toggling user status', error);
        return throwError(() => new Error('Error al cambiar estado del usuario'));
      })
    );
  }

  search(term: string, page = 0, size = 10): Observable<PageResponse<User>> {
    const params = new HttpParams()
      .set('term', term)
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<User>>(`${this.API_URL}/search`, { params, headers: { 'ngrok-skip-browser-warning': 'true' } }).pipe(
      catchError(error => {
        console.error('Error searching users', error);
        return throwError(() => new Error('Error buscando usuarios'));
      })
    );
  }
}
