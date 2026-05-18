import { Button, LtrSwitcher, ThemeSwitcher } from '@/ui';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgxAppVersionDirective } from 'ngx-app-version';
import { NgxScrollTopDirective } from 'ngx-scrolltop';
import { ROUTE_DEFINITION } from './constants/route-definition';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, ThemeSwitcher, LtrSwitcher, Button, NgxScrollTopDirective],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex min-h-dvh flex-col',
  },
  hostDirectives: [NgxAppVersionDirective],
})
export class App {
  protected readonly title = signal('design');
  protected readonly ROUTE_DEFINITION = ROUTE_DEFINITION;
}
