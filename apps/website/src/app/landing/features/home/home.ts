import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@website/app/auth/data-access';

@Component({
  selector: 'landing-page',
  imports: [RouterLink, MatButton],
  templateUrl: './home.html'
})
export default class Home {
  protected authStore = inject(AuthStore);

  protected signOut(): void {
    this.authStore.signOut();
  }
}
