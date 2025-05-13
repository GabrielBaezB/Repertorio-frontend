// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  tap,
  catchError,
  throwError,
  of,
  map,
} from 'rxjs';

import {
  LoginRequest,
  LoginResponse,
  UserInfo,
} from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /* ───────────────────────────── API base ───────────────────────────── */
  private readonly API_URL = `${environment.apiUrl}/auth`;

  /* ─────────────────────────── access-token ────────────────────────────
   * Sólo memoria.  Si PREFIERES que sobreviva a recargas, descomenta la
   * línea de sessionStorage y comenta la vacía.
   * -------------------------------------------------------------------*/
  private accessToken: string | null = null;
  // private accessToken: string | null =
  //       sessionStorage.getItem('access_token');

  /* ─────── info del usuario (sí la cacheamos en localStorage) ──────── */
  private readonly USER_KEY = 'current_user';
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  /* ==================================================================== */
  constructor(private http: HttpClient, private router: Router) {
    this.loadUserData();                  // ← intenta poblar currentUser
  }

  /* ============================ LOGIN ================================ */
  login(dto: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, dto).pipe(
      tap(r => {
        this.accessToken = r.accessToken;
        this.loadUserInfo();
      }),
      catchError(this.handleAuthError('login'))
    );
  }

  /* =========================== REFRESH =============================== */
  /** Pide un nuevo access-token usando la cookie refresh_token */
  refresh(): Observable<void> {
    return this.http
      .post<LoginResponse>(
        `${this.API_URL}/refresh`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(r => (this.accessToken = r.accessToken)),
        map(() => void 0),
        catchError(this.handleAuthError('refresh'))
      );
  }

  /* =========================== LOGOUT ================================ */
  logout(): void {
    this.accessToken = null;
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /* ====================== utilidades públicas ======================== */
  getToken(): string | null {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;

    return role.startsWith('ROLE_')
      ? user.roles.includes(role) ||
          user.roles.includes(role.substring(5))
      : user.roles.includes(role) ||
          user.roles.includes(`ROLE_${role}`);
  }

  /* ====================== carga de info de usuario =================== */
  private loadUserData(): void {
    /* 1. ¿Tenemos un access-token (en memoria o sessionStorage)? */
    if (!this.accessToken) return;

    /* 2. Intentar leer de cache */
    const cached = localStorage.getItem(this.USER_KEY);
    if (cached) {
      try {
        this.currentUserSubject.next(JSON.parse(cached));
      } catch {
        localStorage.removeItem(this.USER_KEY);
      }
    }

    /* 3. Refrescar desde backend */
    this.loadUserInfo();
  }

  private loadUserInfo(): void {
    if (!this.accessToken) return;

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });
    this.http.get<UserInfo>(`${this.API_URL}/me`, { headers }).pipe(
      tap(u => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(u));
        this.currentUserSubject.next(u);
      }),
      catchError(err => this.handleUserInfoError(err))
    ).subscribe();          // ← no olvidar suscribir
  }

  /* =========================== VALIDACIÓN ============================ */
  validateToken(): Observable<boolean> {
    if (!this.accessToken) return of(false);

    const headers = new HttpHeaders({ 'ngrok-skip-browser-warning': 'true' });

    return this.http.get<UserInfo>(`${this.API_URL}/me`, { headers }).pipe(
      tap(u => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(u));
        this.currentUserSubject.next(u);
      }),
      map(() => true),
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          this.logout();
          return of(false);
        }
        /* si falla por conectividad, usar cache si existe */
        return localStorage.getItem(this.USER_KEY) ? of(true) : of(false);
      })
    );
  }

  /* ============================== Helpers ============================ */
  private handleAuthError(op: string) {
    return (err: HttpErrorResponse) =>
      throwError(
        () =>
          new Error(
            `Error en ${op}: ${err.error?.message || err.message || 'desconocido'}`
          )
      );
  }

  private handleUserInfoError(err: HttpErrorResponse): Observable<never> {
    if (err.status === 401) this.logout();
    return throwError(
      () =>
        new Error(
          'No se pudo cargar información del usuario: ' +
            (err.error?.message || err.message)
        )
    );
  }
}
