import { Route } from '@angular/router';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';
import { Role } from '@core/models/user.interface';

export const collectionRoutes: Route[] = [
  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'new',
        component: CollectionFormComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.PARTICULAR] },
        title: 'New Collection Request',
      },
      {
        path: 'list',
        component: CollectionListComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.PARTICULAR] },
        title: 'My Collections',
      },
      {
        path: 'edit/:id',
        component: CollectionFormComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.PARTICULAR] },
        title: 'Edit Collection Request',
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];
