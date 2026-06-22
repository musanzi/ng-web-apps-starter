import { Component, DestroyRef, ElementRef, effect, inject, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardContent } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { ConfirmDialog } from '../../shared/ui/confirm-dialog';
import { IRole, IUser } from '@libs/utils';
import { UsersStore } from '../data-access';
import { IUserPayload } from '../interfaces';
import { UserFormDialog } from '../ui/user-form-dialog/user-form-dialog';

@Component({
  selector: 'admin-users',
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatMenu,
    MatDivider,
    MatMenuTrigger,
    MatIconButton
  ],
  templateUrl: './users.html'
})
export class Users {
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly displayedColumns = ['name', 'email', 'roles', 'actions'];
  protected readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  protected readonly usersStore = inject(UsersStore);

  constructor() {
    this.usersStore.loadRoles();
    this.usersStore.loadUsers();

    effect(() => {
      const error = this.usersStore.error();
      const success = this.usersStore.success();

      if (error) {
        this.snackBar.open(error, 'Fermer', { duration: 5000 });
        queueMicrotask(() => this.usersStore.clearMessages());
      }

      if (success) {
        this.snackBar.open(success, 'Fermer', { duration: 3000 });
        queueMicrotask(() => this.usersStore.clearMessages());
      }
    });
  }

  protected createUser(): void {
    this.openUserDialog();
  }

  protected deleteUser(user: IUser): void {
    this.dialog
      .open<ConfirmDialog, unknown, boolean>(ConfirmDialog, {
        data: {
          title: "Supprimer l'utilisateur",
          message: `Voulez-vous supprimer l'utilisateur "${user.name}" ?`
        },
        width: '420px'
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.usersStore.deleteUser(user.id);
      });
  }

  protected editUser(user: IUser): void {
    this.openUserDialog(user);
  }

  protected exportCsv(): void {
    this.usersStore.exportCsv();
  }

  protected importCsv(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    input.value = '';
    this.usersStore.importCsv(file);
  }

  protected openFilePicker(): void {
    this.fileInput()?.nativeElement.click();
  }

  protected pageChanged(event: PageEvent): void {
    this.usersStore.setPage(event.pageIndex + 1);
    this.usersStore.setPageSize(event.pageSize);
    this.usersStore.loadUsers();
  }

  protected roleLabel(role: string): string {
    return this.usersStore.rolesById().get(role) ?? role;
  }

  protected trackBy(_: number, user: IUser): string {
    return user.id;
  }

  private openUserDialog(user?: IUser): void {
    this.dialog
      .open<UserFormDialog, { roles: IRole[]; user?: IUser }, IUserPayload>(UserFormDialog, {
        data: { roles: this.usersStore.roles(), user },
        width: '560px'
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        if (!payload) {
          return;
        }

        this.usersStore.saveUser({ payload, userId: user?.id });
      });
  }
}
