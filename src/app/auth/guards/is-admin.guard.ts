import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const isAdminGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {

  const authService = inject(AuthService);
  const router = inject(Router);

  await firstValueFrom(authService.checkStatus());

  const user = authService.user();
  const isAdmin = authService.isAdmin();

  console.log(`user: ${user}`);
  console.log(`isAdmin: ${isAdmin}`);

  if (!user) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  if (!isAdmin) {
    router.navigateByUrl('/');
    return false;
  }

  return true;


}
