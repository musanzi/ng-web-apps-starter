import { Routes } from '@angular/router';
import { authGuard } from './data-access';

export const authRoutes: Routes = [
  {
    path: '',
    title: 'Auth',
    loadComponent: () => import('./layout/layout').then((c) => c.AuthLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'sign-in'
      },
      {
        path: 'forgot-password',
        title: 'Forgot Password',
        loadComponent: () => import('./features/forgot-password/forgot-password').then((c) => c.AuthForgotPassword)
      },
      {
        path: 'forgot-password/sent',
        title: 'Forgot Sent',
        loadComponent: () =>
          import('./features/forgot-password-sent/forgot-password-sent').then((c) => c.AuthForgotPasswordSent)
      },
      {
        path: 'reset-password',
        title: 'Reset Password',
        loadComponent: () => import('./features/reset-password/reset-password').then((c) => c.AuthResetPassword)
      },
      {
        path: 'sign-in',
        title: 'Sign In',
        loadComponent: () => import('./features/sign-in/sign-in').then((c) => c.AuthSignIn)
      },
      {
        path: 'sign-up',
        title: 'Sign up',
        loadComponent: () => import('./features/sign-up/sign-up').then((c) => c.AuthSignUp)
      },
      {
        path: 'profile',
        title: 'Profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/profile/layout/layout').then((c) => c.ProfileLayout),
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'account'
          },
          {
            path: 'account',
            title: 'Account',
            loadComponent: () => import('./features/profile/account/account').then((c) => c.ProfilAccount)
          },
          {
            path: 'security',
            title: 'Security',
            loadComponent: () => import('./features/profile/security/security').then((c) => c.PorfilSecurity)
          }
        ]
      }
    ]
  }
];
