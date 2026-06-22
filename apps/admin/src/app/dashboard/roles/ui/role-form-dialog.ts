import { Component, computed, inject, signal } from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IRole } from '@libs/utils';
import { IRolePayload } from '../interfaces';

export interface RoleFormDialogData {
  role?: IRole;
}

@Component({
  selector: 'admin-role-form-dialog',
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, FormField],
  template: `
    <h2 mat-dialog-title>{{ isEdit() ? 'Modifier le rôle' : 'Créer un rôle' }}</h2>

    <form (submit)="save($event)">
      <mat-dialog-content class="min-w-80">
        <mat-form-field class="w-full">
          <mat-label>Nom</mat-label>
          <input matInput [formField]="roleForm.name" autocomplete="off" cdkFocusInitial />
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button matButton type="button" [mat-dialog-close]="undefined">Annuler</button>
        <button matButton="filled" type="submit" [disabled]="roleForm().invalid()">
          <mat-icon svgIcon="save" />
          {{ isEdit() ? 'Enregistrer' : 'Créer' }}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class RoleFormDialog {
  private readonly data = inject<RoleFormDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<RoleFormDialog, IRolePayload>);

  protected readonly roleFormModel = signal({
    name: this.data.role?.name ?? ''
  });
  protected readonly roleForm = form(this.roleFormModel, (form) => {
    required(form.name, { message: 'Le nom est obligatoire.' });
  });
  protected readonly isEdit = computed(() => Boolean(this.data.role));

  save(event: Event): void {
    event.preventDefault();
    submit(this.roleForm, async () => {
      const name = this.roleFormModel().name.trim();
      if (!name) {
        return;
      }

      this.dialogRef.close({ name });
    });
  }
}
