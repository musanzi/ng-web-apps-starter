import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required, submit, validate } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../data-access';

@Component({
  selector: 'auth-sign-up',
  templateUrl: './sign-up.html',
  imports: [RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, FormField]
})
export class AuthSignUp {
  protected authStore = inject(AuthStore);
  protected signUpFormModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  protected signUpForm = form(this.signUpFormModel, (form) => {
    required(form.name, { message: 'Vous devez saisir votre nom' });
    required(form.email, { message: 'Vous devez saisir une adresse e-mail' });
    email(form.email, { message: 'Vous devez saisir une adresse e-mail valide' });
    required(form.password, { message: 'Vous devez saisir un mot de passe' });
    required(form.confirmPassword, { message: 'Vous devez confirmer votre mot de passe' });
    validate(form.confirmPassword, ({ value, valueOf }) => {
      if (value() !== valueOf(form.password)) {
        return {
          kind: 'passwordMismatch',
          message: 'Les mots de passe ne correspondent pas'
        };
      }
      return null;
    });
  });

  signUp(event: Event) {
    event.preventDefault();
    submit(this.signUpForm, async () => {
      const { email, name, password } = this.signUpFormModel();
      this.authStore.signUp({ email, name, password });
    });
  }
}
