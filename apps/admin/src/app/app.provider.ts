import { isPlatformBrowser } from '@angular/common';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer
} from '@angular/core';
import { AuthStore } from './auth/data-access';

export const provideApp = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);

      if (!isPlatformBrowser(platformId)) return;

      inject(AuthStore).getProfile();
    })
  ]);
