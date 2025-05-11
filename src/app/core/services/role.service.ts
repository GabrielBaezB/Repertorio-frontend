import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Role } from '../models/role.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  // private readonly API_URL = `${environment.apiUrl}/roles`;

  private readonly API_URL = environment.production
    ? 'https://50fa-201-219-233-176.ngrok-free.app/api/roles'  // URL directa
    : `${environment.apiUrl}/api/roles`;
     // URL de desarrollo
  constructor(private http: HttpClient) {
    console.log('API_URL configurada:', this.API_URL);
  }

  getAll(): Observable<Role[]> {

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    console.log('Solicitando todos los roles desde:', this.API_URL);

    return this.http.get<Role[]>(this.API_URL, {headers}).pipe(
      tap(roles => console.log('Roles cargados:', roles)),
      catchError(error => {
        console.error('========= ERROR AL CARGAR ROLES =========');
        console.error('Status:', error.status);
        console.error('Mensaje:', error.message);
        console.error('Error completo:', error);
        console.error('Error body:', error.error);
        console.error('=========================================');
        throw error;
      })
    );
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.API_URL}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al obtener rol con ID ${id}`, error);
        throw error;
      })
    );
  }

  create(role: Role): Observable<Role> {
    // Formatear el nombre del rol para asegurar que tenga el prefijo ROLE_
    if (role.name && !role.name.startsWith('ROLE_')) {
      role.name = `ROLE_${role.name}`;
    }

    return this.http.post<Role>(this.API_URL, role).pipe(
      tap(newRole => console.log('Rol creado:', newRole)),
      catchError(error => {
        console.error('Error al crear rol', error);
        throw error;
      })
    );
  }

  update(id: number, role: Role): Observable<Role> {
    // Formatear el nombre del rol para asegurar que tenga el prefijo ROLE_
    if (role.name && !role.name.startsWith('ROLE_')) {
      role.name = `ROLE_${role.name}`;
    }

    return this.http.put<Role>(`${this.API_URL}/${id}`, role).pipe(
      tap(updatedRole => console.log('Rol actualizado:', updatedRole)),
      catchError(error => {
        console.error(`Error al actualizar rol con ID ${id}`, error);
        throw error;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap(() => console.log(`Rol con ID ${id} eliminado`)),
      catchError(error => {
        console.error(`Error al eliminar rol con ID ${id}`, error);
        throw error;
      })
    );
  }

  // Método para mostrar nombres de roles sin el prefijo ROLE_
  displayRoleName(roleName: string): string {
    return roleName.replace('ROLE_', '');
  }
}
