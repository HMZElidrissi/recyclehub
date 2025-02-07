import { Role } from '@core/models/user.interface';

export const navigationItems = [
  {
    label: 'My Collections',
    path: '/dashboard/list',
    roles: [Role.PARTICULAR],
    exact: true,
  },
  {
    label: 'My Points',
    path: '/dashboard/points',
    roles: [Role.PARTICULAR],
    exact: true,
  },
  {
    label: 'Profile',
    path: '/dashboard/profile',
    roles: [Role.PARTICULAR, Role.COLLECTOR],
    exact: true,
  },
  {
    label: 'Collection Dashboard',
    path: '/dashboard/collector-dashboard',
    roles: [Role.COLLECTOR],
    exact: true,
  },
];
