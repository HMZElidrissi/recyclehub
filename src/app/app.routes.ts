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
    path: 'collections',
    loadChildren: () =>
      import('@features/collection/collection.routes').then(
        (m) => m.collectionRoutes,
      ),
  },
];
