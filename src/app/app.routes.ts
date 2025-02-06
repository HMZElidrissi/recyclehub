import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('@features/auth/auth.routes').then((m) => m.authRoutes),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('@features/dashboard/collection.routes').then(
        (m) => m.collectionRoutes,
      ),
  },
];
