import { IsActiveMatchOptions } from '@angular/router';

export interface NavigationItem {
  id: string;
  label: string;
  description?: string;
  route?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  expanded?: boolean;
  activeOptions?: { exact: boolean } | IsActiveMatchOptions;
}

export const NAVIGATION: NavigationItem[] = [
  {
    id: 'account',
    label: 'Mon compte',
    description: 'Gestion du compte',
    children: [
      {
        id: 'account/info',
        label: 'Mes informations',
        icon: 'settings',
        route: '/account'
      },
      {
        id: 'account/security',
        label: 'Mot de passe',
        icon: 'lock',
        route: '/security'
      }
    ]
  },
  {
    id: 'general',
    label: 'Géneral',
    description: 'Gestion des ressources',
    children: []
  }
];
