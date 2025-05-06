// core/guards/admin.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Admin Guard - Verificando acceso a:', state.url);

  return authService.currentUser$.pipe(
    map(user => {
      const isAdmin = user?.roles.includes('ROLE_ADMIN') || user?.roles.includes('ADMIN');

      if (!isAdmin) {
        router.navigate(['/dashboard']);
        return false;
      }

      return true;
    })
  );
};
