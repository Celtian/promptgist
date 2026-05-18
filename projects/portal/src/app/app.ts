import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  HostListener,
  ElementRef,
} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgxAppVersionDirective } from 'ngx-app-version';
import { ThemeSwitcher, Button, Avatar, Tooltip } from '@/ui';
import { AuthService } from './core/services/auth.service';
import { ROUTE_DEFINITION } from './constants/route-definition';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ThemeSwitcher, Button, Avatar, Tooltip],
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
  protected readonly isMenuOpen = signal(false);
  private readonly elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen.set(false);
    }
  }
}
