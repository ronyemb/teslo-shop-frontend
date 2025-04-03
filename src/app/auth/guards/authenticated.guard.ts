import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const AuthenticatedGuard: CanMatchFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = await firstValueFrom(authService.checkStatus());

  // console.log('AuthenticatedGuard:', isAuthenticated);

  if (!isAuthenticated) {
    router.navigateByUrl('/auth/login'); // Redirige al login si no está autenticado
    return false;
  }

  return true;
};
