import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const hasRights = authStore.hasRights();

  if (!hasRights) {
    return router.navigate(['/locked']);
  }

  return true;
};
