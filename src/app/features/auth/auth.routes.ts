import { Route } from '@angular/router';
import { AuthLayoutComponent } from '@shared/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from '@features/auth/login/login.component';
import { RegisterComponent } from '@features/auth/register/register.component';

export const authRoutes: Route[] = [
  {
    path: '',
    component: AuthLayoutComponent,
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
