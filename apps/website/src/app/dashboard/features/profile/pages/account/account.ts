import { Component, computed, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '@website/app/auth/data-access';
import { getProfileAvatarUrl } from '@website/app/dashboard/utils/avatar-url';

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@Component({
  selector: 'account-settings',
  imports: [MatButton, MatDivider, MatIcon, MatFormFieldModule, MatInputModule, FormField],
  templateUrl: './account.html'
})
export class ProfileAccount {
  protected readonly authStore = inject(AuthStore);

  protected readonly avatarUrl = computed(() => getProfileAvatarUrl(this.authStore.user()?.avatar ?? null));
  protected accountSettingsModel = signal(this.getUserFormValue());
  protected accountSettingsForm = form(this.accountSettingsModel, (schema) => {
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

    submit(this.accountSettingsForm, async () => {
      this.authStore.updateProfile(this.accountSettingsModel());
    });
  }

  protected uploadAvatar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.authStore.clearMessages();

    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      this.authStore.setError('Format non pris en charge. Utilisez JPG, PNG, WebP ou GIF.');
      input.value = '';
      return;
    }

    if (file.size > MAX_AVATAR_SIZE) {
      this.authStore.setError('La photo de profil ne doit pas dépasser 2 Mo.');
      input.value = '';
      return;
    }

    this.authStore.updateAvatar(file);
    input.value = '';
  }

  private getUserFormValue(): { name: string; email: string } {
    const user = this.authStore.user();

    return {
      name: user?.name ?? '',
      email: user?.email ?? ''
    };
  }
}
