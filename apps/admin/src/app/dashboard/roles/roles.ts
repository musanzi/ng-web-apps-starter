import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { getApiErrorMessage, IRole } from '@libs/utils';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { ConfirmDialog } from '../shared/ui/confirm-dialog';
import { RolesService } from './data-access';
import { IRolePayload } from './interfaces';
import { RoleFormDialog } from './ui/role-form-dialog';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

@Component({
  selector: 'admin-roles',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    ReactiveFormsModule
  ],
  templateUrl: './roles.html'
})
export class Roles {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly rolesService = inject(RolesService);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly displayedColumns = ['name', 'actions'];
  protected readonly isLoading = signal(false);
  protected readonly limit = signal(DEFAULT_LIMIT);
  protected readonly page = signal(1);
  protected readonly roles = signal<IRole[]>([]);
  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly total = signal(0);

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.page.set(1);
        this.loadRoles();
      });

    this.loadRoles();
  }

  protected createRole(): void {
    this.dialog
      .open<RoleFormDialog, undefined, IRolePayload>(RoleFormDialog, { width: '420px' })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        if (!payload) {
          return;
        }

        this.rolesService.create(payload).subscribe({
          next: () => {
            this.snackBar.open('Rôle créé.', 'Fermer', { duration: 3000 });
            this.loadRoles();
          },
          error: (error: Error) => this.showError(error, 'Impossible de créer le rôle')
        });
      });
  }

  protected deleteRole(role: IRole): void {
    this.dialog
      .open<ConfirmDialog, unknown, boolean>(ConfirmDialog, {
        data: {
          title: 'Supprimer le rôle',
          message: `Voulez-vous supprimer le rôle "${role.name}" ?`
        },
        width: '420px'
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.rolesService.delete(role.id).subscribe({
          next: () => {
            this.snackBar.open('Rôle supprimé.', 'Fermer', { duration: 3000 });
            this.loadRoles();
          },
          error: (error: Error) => this.showError(error, 'Impossible de supprimer le rôle')
        });
      });
  }

  protected editRole(role: IRole): void {
    this.dialog
      .open<RoleFormDialog, { role: IRole }, IRolePayload>(RoleFormDialog, {
        data: { role },
        width: '420px'
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        if (!payload) {
          return;
        }

        this.rolesService.update(role.id, payload).subscribe({
          next: () => {
            this.snackBar.open('Rôle modifié.', 'Fermer', { duration: 3000 });
            this.loadRoles();
          },
          error: (error: Error) => this.showError(error, 'Impossible de modifier le rôle')
        });
      });
  }

  protected loadRoles(): void {
    const limit = Math.min(this.limit(), MAX_LIMIT);
    this.limit.set(limit);
    this.isLoading.set(true);

    this.rolesService
      .findAll({
        page: this.page(),
        limit,
        q: this.searchControl.value.trim()
      })
      .pipe(finalize(() => this.isLoading.set(false)), takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([roles, total]) => {
          this.roles.set(roles);
          this.total.set(total);
        },
        error: (error: Error) => this.showError(error, 'Impossible de charger les rôles')
      });
  }

  protected pageChanged(event: PageEvent): void {
    this.page.set(event.pageIndex + 1);
    this.limit.set(Math.min(event.pageSize, MAX_LIMIT));
    this.loadRoles();
  }

  protected trackBy(_: number, role: IRole): string {
    return role.id;
  }

  private showError(error: Error, fallback: string): void {
    this.snackBar.open(getApiErrorMessage(error, fallback), 'Fermer', { duration: 5000 });
  }
}
