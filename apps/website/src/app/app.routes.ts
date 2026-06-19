import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((r) => r.authRoutes)
  },
  {
    path: '',
    loadChildren: () => import('./landing/landing.routes').then((r) => r.landingRoutes)
  }
];
