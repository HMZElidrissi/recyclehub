import { Role } from '@core/models/user.interface';

export const navigationItems = [
  {
    label: 'My Collections',
    path: '/collections/list',
    roles: [Role.PARTICULAR],
    exact: true,
  },
  {
    label: 'Collection Dashboard',
    path: '/collections/collector-dashboard',
    roles: [Role.COLLECTOR],
    exact: true,
  },
];
