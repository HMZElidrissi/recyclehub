import { Route } from '@angular/router';
import { DashboardLayoutComponent } from '@shared/layouts/dashboard-layout/dashboard-layout.component';
import { CollectorDashboardComponent } from './collector-dashboard/collector-dashboard.component';
import { CollectionListComponent } from './collection-list/collection-list.component';
import { CollectionFormComponent } from './collection-form/collection-form.component';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';
import { Role } from '@core/models/user.interface';
import { PointsComponent } from '@features/dashboard/points/points.component';
import { ProfileComponent } from '@features/dashboard/profile/profile.component';

export const dashboardRoutes: Route[] = [
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
        path: 'collector-dashboard',
        component: CollectorDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.COLLECTOR] },
        title: 'Collector Dashboard',
      },
      {
        path: 'points',
        component: PointsComponent,
        canActivate: [roleGuard],
        data: { roles: [Role.PARTICULAR] },
        title: 'Points',
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard],
        title: 'Profile',
      },
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      },
    ],
  },
];
