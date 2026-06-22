import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

@Component({
  selector: 'admin-confirm-dialog',
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon class="text-error" svgIcon="triangle-alert" />
      {{ data.title }}
    </h2>

    <mat-dialog-content>
      <p class="text-sm text-on-surface-variant">{{ data.message }}</p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button matButton type="button" [mat-dialog-close]="false">
        {{ data.cancelLabel ?? 'Annuler' }}
      </button>
      <button matButton="filled" type="button" color="warn" [mat-dialog-close]="true">
        {{ data.confirmLabel ?? 'Supprimer' }}
      </button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<ConfirmDialog, boolean>);
}
