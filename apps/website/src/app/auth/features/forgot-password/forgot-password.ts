import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthStore } from '../../data-access';

@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.html',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormField]
})
export class AuthForgotPassword {
  protected authStore = inject(AuthStore);
  protected forgotPasswordFormModel = signal({
    email: ''
  });
  protected forgotPasswordForm = form(this.forgotPasswordFormModel, (form) => {
    required(form.email, { message: 'Vous devez saisir une adresse e-mail' });
    email(form.email, { message: 'Vous devez saisir une adresse e-mail valide' });
  });

  forgotPassword(event: Event) {
    event.preventDefault();
    submit(this.forgotPasswordForm, async () => {
      this.authStore.forgotPassword(this.forgotPasswordFormModel());
    });
  }
}
