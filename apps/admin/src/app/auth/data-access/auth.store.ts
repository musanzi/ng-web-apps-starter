import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { getApiErrorMessage } from '@libs/utils';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, finalize, of, pipe, tap } from 'rxjs';
import { IAuthProfile, IAuthState, IUpdatePasswordPayload, IUpdateProfilePayload } from '../interfaces';
import { AuthService } from './auth.service';

const initialState: IAuthState = {
  user: null,
  isVerifying: true,
  isLoading: false,
  error: null,
  success: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ user }) => ({
    hasRights: computed(() => {
      return user()?.roles?.includes('admin');
    })
  })),
  withMethods((store, _authService = inject(AuthService), router = inject(Router)) => ({
    updateProfile: rxMethod<IUpdateProfilePayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, success: null })),
        exhaustMap((payload) =>
          _authService.updateProfile(payload).pipe(
            tap((user) => {
              patchState(store, { user, success: 'Informations du compte mises à jour.' });
            }),
            catchError((error: Error) => {
              patchState(store, {
                error: getApiErrorMessage(error, 'Impossible de mettre à jour les informations du compte')
              });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    updatePassword: rxMethod<IUpdatePasswordPayload>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null, success: null })),
        exhaustMap((payload) =>
          _authService.updatePassword(payload).pipe(
            tap(() => patchState(store, { success: 'Mot de passe mis à jour.' })),
            catchError((error: Error) => {
              patchState(store, {
                error: getApiErrorMessage(error, 'Impossible de mettre à jour le mot de passe')
              });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    signOut: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        exhaustMap(() =>
          _authService.signOut().pipe(
            tap(() => {
              patchState(store, { user: null });
              router.navigateByUrl('/auth/sign-in');
            }),
            catchError((error: Error) => {
              patchState(store, { error: getApiErrorMessage(error, 'Déconnexion échouée') });
              return of(null);
            }),
            finalize(() => patchState(store, { isLoading: false }))
          )
        )
      )
    ),
    getProfile: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isVerifying: true, error: null })),
        exhaustMap(() =>
          _authService.getProfile().pipe(
            tap((user) => patchState(store, { user })),
            catchError(() => {
              patchState(store, { user: null });
              return of(null);
            }),
            finalize(() => patchState(store, { isVerifying: false }))
          )
        )
      )
    ),
    clearMessages(): void {
      patchState(store, { error: null, success: null });
    },
    setUser(user: IAuthProfile | null): void {
      patchState(store, { user });
    }
  }))
);
