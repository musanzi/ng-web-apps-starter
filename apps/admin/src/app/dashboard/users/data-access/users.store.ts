import { computed, inject } from '@angular/core';
import { getApiErrorMessage } from '@libs/utils';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, exhaustMap, finalize, of, pipe, tap } from 'rxjs';
import { RolesService } from '../../roles/data-access';
import { ISaveUserPayload, IUsersState } from '../interfaces';
import { UsersService } from './users.service';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const initialState: IUsersState = {
  error: null,
  isExporting: false,
  isImporting: false,
  isLoading: false,
  limit: DEFAULT_LIMIT,
  page: 1,
  roles: [],
  success: null,
  total: 0,
  users: []
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ roles }) => ({
    rolesById: computed(() => new Map(roles().map((role) => [role.id, role.name])))
  })),
  withMethods((store, rolesService = inject(RolesService), usersService = inject(UsersService)) => {
    const loadUsers = rxMethod<void>(
      pipe(
        tap(() => {
          const limit = Math.min(store.limit(), MAX_LIMIT);
          patchState(store, { error: null, isLoading: true, limit });
        }),
        exhaustMap(() =>
          usersService
            .findAll({
              limit: store.limit(),
              page: store.page()
            })
            .pipe(
              tap(([users, total]) => patchState(store, { total, users })),
              catchError((error: Error) => {
                patchState(store, { error: getApiErrorMessage(error, 'Impossible de charger les utilisateurs') });
                return of(null);
              }),
              finalize(() => patchState(store, { isLoading: false }))
            )
        )
      )
    );

    return {
      clearMessages(): void {
        patchState(store, { error: null, success: null });
      },
      deleteUser: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { error: null, success: null })),
          exhaustMap((userId) =>
            usersService.delete(userId).pipe(
              tap(() => {
                patchState(store, { success: 'Utilisateur supprimé.' });
                loadUsers();
              }),
              catchError((error: Error) => {
                patchState(store, {
                  error: getApiErrorMessage(error, 'Impossible de supprimer l’utilisateur')
                });
                return of(null);
              })
            )
          )
        )
      ),
      exportCsv: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { error: null, isExporting: true, success: null })),
          exhaustMap(() =>
            usersService
              .exportCsv({
                limit: store.limit(),
                page: store.page()
              })
              .pipe(
                tap((blob) => {
                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement('a');
                  anchor.href = url;
                  anchor.download = 'users.csv';
                  anchor.click();
                  URL.revokeObjectURL(url);
                  patchState(store, { success: 'Export CSV généré.' });
                }),
                catchError((error: Error) => {
                  patchState(store, {
                    error: getApiErrorMessage(error, 'Impossible d’exporter les utilisateurs')
                  });
                  return of(null);
                }),
                finalize(() => patchState(store, { isExporting: false }))
              )
          )
        )
      ),
      importCsv: rxMethod<File>(
        pipe(
          tap(() => patchState(store, { error: null, isImporting: true, success: null })),
          exhaustMap((file) =>
            usersService.importCsv(file).pipe(
              tap(() => {
                patchState(store, { success: 'Import CSV terminé.' });
                loadUsers();
              }),
              catchError((error: Error) => {
                patchState(store, {
                  error: getApiErrorMessage(error, 'Impossible d’importer les utilisateurs')
                });
                return of(null);
              }),
              finalize(() => patchState(store, { isImporting: false }))
            )
          )
        )
      ),
      loadRoles: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { error: null })),
          exhaustMap(() =>
            rolesService.findAll({ limit: MAX_LIMIT, page: 1 }).pipe(
              tap(([roles]) => patchState(store, { roles })),
              catchError((error: Error) => {
                patchState(store, { error: getApiErrorMessage(error, 'Impossible de charger les rôles') });
                return of(null);
              })
            )
          )
        )
      ),
      loadUsers,
      saveUser: rxMethod<ISaveUserPayload>(
        pipe(
          tap(() => patchState(store, { error: null, success: null })),
          exhaustMap(({ payload, userId }) => {
            const request = userId ? usersService.update(userId, payload) : usersService.create(payload);

            return request.pipe(
              tap(() => {
                patchState(store, { success: userId ? 'Utilisateur modifié.' : 'Utilisateur créé.' });
                loadUsers();
              }),
              catchError((error: Error) => {
                patchState(store, {
                  error: getApiErrorMessage(
                    error,
                    userId ? 'Impossible de modifier l’utilisateur' : 'Impossible de créer l’utilisateur'
                  )
                });
                return of(null);
              })
            );
          })
        )
      ),
      setPage(page: number): void {
        patchState(store, { page });
      },
      setPageSize(limit: number): void {
        patchState(store, { limit: Math.min(limit, MAX_LIMIT) });
      }
    };
  })
);
