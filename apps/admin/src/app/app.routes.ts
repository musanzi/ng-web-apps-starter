import { Route } from '@angular/router';
import { authGuard } from './auth/data-access';

export const routes: Route[] = [
  {
    path: 'locked',
    title: 'Locked',
    loadComponent: () => import('./locked/locked').then((c) => c.Locked)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/layout/layout').then((c) => c.AdminLayout),
    loadChildren: () => import('./dashboard/features/profile/profile.routes').then((r) => r.profileRoutes)
  }
];
