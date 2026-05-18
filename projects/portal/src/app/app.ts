import { Avatar, Button, ThemeSwitcher, Tooltip } from '@/ui';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidAngleUp,
  faSolidBolt,
  faSolidFileLines,
  faSolidGear,
  faSolidRightFromBracket,
  faSolidRightToBracket,
} from '@ng-icons/font-awesome/solid';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgxAppVersionDirective } from 'ngx-app-version';
import { NgxScrollTopDirective } from 'ngx-scrolltop';
import { ROUTE_DEFINITION } from './constants/route-definition';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    ThemeSwitcher,
    Button,
    Avatar,
    Tooltip,
    NgIcon,
    NgxScrollTopDirective,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      faSolidAngleUp,
      faSolidBolt,
      faSolidFileLines,
      faSolidGear,
      faSolidRightFromBracket,
      faSolidRightToBracket,
    }),
  ],
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
