import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError, of, map } from 'rxjs';
import { LoginRequest, LoginResponse, UserInfo } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user'; // Nueva clave para guardar info del usuario
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadUserData();
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        this.setToken(response.token);
        this.loadUserInfo();
      }),
      catchError(error => {
        console.error('Error en login', error);
        return throwError(() => new Error('Error de autenticación: ' + (error.error?.message || 'Credenciales inválidas')));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY); // También eliminar datos de usuario
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Método nuevo para guardar usuario en localStorage
  private setUserData(user: UserInfo): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Método modificado para cargar del localStorage primero
  private loadUserData(): void {
    // Primero verificar si hay token
    const token = this.getToken();
    if (!token) {
      return;
    }

    // Intentar cargar usuario desde localStorage
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        const user = JSON.parse(userData) as UserInfo;
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error al parsear datos de usuario', e);
        // Si hay error, limpiar e intentar cargar desde la API
        localStorage.removeItem(this.USER_KEY);
      }
    }

    // De cualquier manera, intentar refrescar datos del usuario desde la API
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    const token = this.getToken();
    if (!this.getToken()) {
      return;
    }

    console.log('Intentando cargar información del usuario desde API');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });

    this.http.get<UserInfo>(`${this.API_URL}/me`, { headers }).pipe(
      tap(user => {
        console.log('Información del usuario cargada correctamente:', user);
        console.log('Roles del usuario:', user.roles);
        this.setUserData(user);
      }),
      catchError(error => {
        console.error('Error cargando información del usuario:', error);
        console.error('Código de estado:', error.status);
        console.error('Mensaje:', error.message);
        console.error('Respuesta del servidor:', error.error);

        // Importante: No cerrar sesión automáticamente para errores no críticos
        if (error.status === 401) {
          console.log('Error de autenticación, cerrando sesión');
          this.logout();
        } else {
          // Para otros errores, intentar usar datos del localStorage si existen
          const userData = localStorage.getItem(this.USER_KEY);
          if (userData) {
            console.log('Usando datos de usuario en caché debido al error');
            try {
              const user = JSON.parse(userData) as UserInfo;
              this.currentUserSubject.next(user);
            } catch (e) {
              console.error('Error al parsear datos en caché', e);
            }
          }
        }

        return throwError(() => new Error('No se pudo cargar información del usuario: ' + error.message));
      })
    ).subscribe({
      // Añadir manejadores de error adicionales
      error: (err) => console.error('Error en la suscripción a loadUserInfo:', err)
    });
  }

  // Método para validar el token manualmente (útil para guards)
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!this.getToken()) {
      console.log('No hay token disponible, retornando false');
      return of(false);
    }

    console.log('Validando token...');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    });


    return this.http.get<UserInfo>(`${this.API_URL}/me`, { headers }).pipe(
      tap(user => {
        console.log('Token válido, información de usuario:', user);
        console.log('Roles del usuario:', user.roles);
        this.setUserData(user);
      }),
      map(() => true),
      catchError(error => {
        console.error('Error validando token:', error);

        // Si es un error de autenticación, cerrar sesión
        if (error.status === 401 || error.status === 403) {
          console.log('Token inválido, cerrando sesión');
          this.logout();
          return of(false);
        }

        // Para otros tipos de errores (ej. conectividad), usar datos en caché si existen
        const userData = localStorage.getItem(this.USER_KEY);
        if (userData) {
          try {
            console.log('Usando datos en caché para la validación');
            return of(true);
          } catch (e) {
            console.error('Error con los datos en caché', e);
          }
        }

        // Si no hay datos en caché, retornar false
        return of(false);
      })
    );
  }
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.getValue();
    if (!user) return false;

    if (role.startsWith('ROLE_')) {
      return user.roles.includes(role) || user.roles.includes(role.substring(5));
    } else {
      return user.roles.includes(role) || user.roles.includes(`ROLE_${role}`);
    }
  }
}
