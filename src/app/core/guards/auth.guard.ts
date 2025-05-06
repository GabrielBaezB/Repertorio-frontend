import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // Validar token
  return authService.validateToken().pipe(
    map(isValid => {
      if (!isValid) {
        router.navigate(['/login']);
      }
      return isValid;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
