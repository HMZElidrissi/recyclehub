import { Route } from '@angular/router';
import { AuthLayoutComponent } from '@shared/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from '@features/auth/login/login.component';
import { RegisterComponent } from '@features/auth/register/register.component';
import { authRedirectGuard } from '@core/guards/auth-redirect.guard';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [authRedirectGuard],
    children: [
      {
        path: 'login',
        component: LoginComponent,
        title: 'Log In',
      },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Register',
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
];
