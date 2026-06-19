import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SchemeSwitcher } from '@libs/ui';

@Component({
  selector: 'web-layout',
  imports: [RouterOutlet, SchemeSwitcher],
  templateUrl: './layout.html'
})
export class LandingLayout {}
