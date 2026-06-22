import { Route } from '@angular/router';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    title: 'Stats',
    loadComponent: () => import('./stats/stats').then((c) => c.Stats)
  },
  {
    path: 'roles',
    title: 'Rôles',
    loadComponent: () => import('./roles/roles').then((c) => c.Roles)
  },
  {
    path: 'users',
    title: 'Utilisateurs',
    loadComponent: () => import('./users/features/users').then((c) => c.Users)
  }
];
