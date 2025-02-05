import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const roleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = authService.getCurrentUser();
  const allowedRoles = route.data['roles'] as string[];

  if (user && allowedRoles.includes(user.role)) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
};
