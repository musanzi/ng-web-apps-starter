import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatTabLink, MatTabNav, MatTabNavPanel } from '@angular/material/tabs';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'settings-layout',
  imports: [
    RouterOutlet,
    MatTabNav,
    MatTabLink,
    MatTabNavPanel,
    RouterLink,
    RouterLinkActive,
    MatFormField,
    MatSelect,
    MatOption,
    MatIcon
  ],
  templateUrl: './layout.html'
})
export class ProfileLayout {
  protected router = inject(Router);
  protected links = [
    {
      id: 'account',
      label: 'Compte',
      route: '/auth/profile/account'
    },
    {
      id: 'security',
      label: 'Sécurité',
      route: '/auth/profile/security'
    }
  ];
}
