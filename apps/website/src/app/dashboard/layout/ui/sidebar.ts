import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardNavigation, User } from '@libs/ui';
import { AuthStore } from '@website/app/auth/data-access';
import { getProfileAvatarUrl } from '../../utils';
import { NAVIGATION } from '../data/navigation.data';

@Component({
  selector: 'dashboard-sidebar',
  imports: [DashboardNavigation, RouterLink, User],
  host: {
    class: 'flex w-full flex-auto flex-col'
  },
  template: `
    <div class="relative flex items-center gap-x-2.5 pt-5 pr-4 pb-0 pl-6">
      <a class="flex flex-col" routerLink="/">
        <div class="text-on-surface text-lg leading-none font-bold tracking-wider">Dashboard</div>
      </a>
    </div>

    <ui-dashboard-navigation class="mt-8 mb-4 flex-auto" [navItems]="navItems" />

    <ui-user class="mx-4 mb-4" [user]="authStore.user()" [avatarUrl]="avatarUrl()" (signOut)="authStore.signOut()" />
  `
})
export class DashboardSidebar {
  authStore = inject(AuthStore);
  protected readonly avatarUrl = computed(() => getProfileAvatarUrl(this.authStore.user()?.avatar ?? null));

  navItems = NAVIGATION;
}
