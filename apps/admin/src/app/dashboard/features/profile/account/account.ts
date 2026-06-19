import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '@website/app/auth/data-access';

@Component({
  selector: 'account-settings',
  imports: [MatButton, MatDivider, MatIcon, MatFormFieldModule, MatInputModule, FormField],
  templateUrl: './account.html'
})
export class ProfilAccount {
  protected readonly authStore = inject(AuthStore);

  protected accountModel = signal(this.getUserFormValue());
  protected accountForm = form(this.accountModel, (schema) => {
    required(schema.name, { message: 'Le nom est obligatoire' });
    required(schema.email, { message: "L'adresse e-mail est obligatoire" });
    email(schema.email, { message: 'Adresse e-mail invalide' });
  });

  constructor() {
    this.authStore.clearMessages();
  }

  protected save(event: Event): void {
    event.preventDefault();
    this.authStore.clearMessages();

    submit(this.accountForm, async () => {
      this.authStore.updateProfile(this.accountModel());
    });
  }

  private getUserFormValue(): { name: string; email: string } {
    const user = this.authStore.user();
    return {
      name: user?.name ?? '',
      email: user?.email ?? ''
    };
  }
}
