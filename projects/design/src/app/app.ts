import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgxAppVersionDirective } from 'ngx-app-version';
import { ROUTE_DEFINITION } from './constants/route-definition';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col h-full',
  },
  hostDirectives: [NgxAppVersionDirective],
})
export class App {
  protected readonly title = signal('design');
  protected readonly ROUTE_DEFINITION = ROUTE_DEFINITION;
  protected readonly navItems = [
    {
      label: 'Foundations',
      route: ROUTE_DEFINITION.APP.FOUNDATIONS,
    },
    {
      label: 'Components',
      route: ROUTE_DEFINITION.APP.COMPONENTS,
    },
    {
      label: 'Forms',
      route: ROUTE_DEFINITION.APP.FORMS,
    },
  ];
}
