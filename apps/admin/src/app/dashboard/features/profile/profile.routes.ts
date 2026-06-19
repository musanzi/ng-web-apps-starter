import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: '',
    title: 'Profil',
    loadComponent: () => import('./layout/layout').then((c) => c.ProfileLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'account'
      },
      {
        path: 'account',
        title: 'Account',
        loadComponent: () => import('./account/account').then((c) => c.ProfilAccount)
      },
      {
        path: 'security',
        title: 'account',
        loadComponent: () => import('./security/security').then((c) => c.PorfilSecurity)
      }
    ]
  }
];
