import { INavigationItem } from '@libs/utils';

export const NAVIGATION: INavigationItem[] = [
  {
    id: 'general',
    label: 'Géneral',
    description: 'Gestion des ressources',
    children: [
      {
        id: 'roles',
        label: 'Rôles',
        route: '/roles',
        icon: 'shield-check'
      },
      {
        id: 'users',
        label: 'Utilisateurs',
        route: '/users',
        icon: 'users'
      }
    ]
  }
];
