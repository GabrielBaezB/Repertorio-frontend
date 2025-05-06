import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // Obtener token
  const token = authService.getToken();

  // Si hay token y la URL no es para login, añadir el token al header
  if (token && !req.url.includes('/auth/login')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Continuar con la petición y manejar errores de autenticación
  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse) {
        // Si el error es 401 (Unauthorized) o 403 (Forbidden), cerrar sesión
        if ((error.status === 401 || error.status === 403) && !req.url.includes('/auth/login')) {
          authService.logout();
        }
      }
      return throwError(() => error);
    })
  );
};
