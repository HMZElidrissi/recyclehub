import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { Role } from '@core/models/user.interface';

export const authRedirectGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    if (user?.role === Role.COLLECTOR) {
      router.navigate(['/dashboard/collector-dashboard']);
    } else {
      router.navigate(['/dashboard/list']);
    }
    return false;
  }

  return true;
};
