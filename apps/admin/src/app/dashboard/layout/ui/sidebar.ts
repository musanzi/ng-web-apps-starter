import { Component } from '@angular/core';
import { Navigation } from './navigation';

@Component({
  selector: 'admin-sidebar',
  imports: [Navigation],
  host: {
    class: 'flex w-full flex-auto flex-col'
  },
  template: `
    <div class="relative flex items-center gap-x-2.5 pt-5 pr-4 pb-0 pl-6">
      <div class="flex flex-col">
        <div class="text-on-surface text-lg leading-none font-bold tracking-wider">ADMIN</div>
      </div>
    </div>

    <navigation class="mt-8 mb-4 flex-auto" />
  `
})
export class AdminSidebar {}
