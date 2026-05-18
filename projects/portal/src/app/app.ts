import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgxAppVersionDirective } from 'ngx-app-version';
import { ThemeSwitcher, Button } from '@/ui';
import { AuthService } from './core/services/auth.service';
import { ROUTE_DEFINITION } from './constants/route-definition';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ThemeSwitcher, Button],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-col h-full',
  },
  hostDirectives: [NgxAppVersionDirective],
})
export class App {
  protected readonly title = signal('portal');
  protected readonly auth = inject(AuthService);
  protected readonly ROUTE_DEFINITION = ROUTE_DEFINITION;
}
