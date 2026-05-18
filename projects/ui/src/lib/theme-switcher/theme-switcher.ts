import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  PLATFORM_ID,
  Provider,
  Renderer2,
  computed,
  effect,
  forwardRef,
  inject,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidMoon, faSolidSun } from '@ng-icons/font-awesome/solid';
import { Button } from '../button/button';
import { Tooltip } from '../tooltip/tooltip';
import { StorageService } from '../utils/local-storage';

export const THEME_SWITCHER_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ThemeSwitcher),
  multi: true,
};

@Component({
  selector: 'ui-theme-switcher',
  imports: [Button, Tooltip, NgIcon],
  templateUrl: './theme-switcher.html',
  providers: [THEME_SWITCHER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ faSolidMoon, faSolidSun })],
})
export class ThemeSwitcher implements ControlValueAccessor, OnInit {
  private readonly storage = inject(StorageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Inputs using signal-based input()
  public readonly uiClass = input<string>('');

  // Internal synchronized storage state for theme: 'light' | 'dark'
  private readonly syncedTheme = this.storage.createSyncedSignal<'light' | 'dark'>(
    'ui-theme',
    'light',
  );

  // Internal CVA callbacks (with noop comments to satisfy the linter)
  private onChange: (value: 'light' | 'dark') => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };
  protected isDisabled = false;

  // Signal exposed for template rendering
  protected readonly currentTheme = computed(() => this.syncedTheme.asSignal()());

  constructor() {
    // Apply class to HTML element whenever the synced theme signal changes
    effect(() => {
      const theme = this.currentTheme();
      if (this.isBrowser) {
        const root = document.documentElement;
        if (theme === 'dark') {
          this.renderer.addClass(root, 'dark');
          this.renderer.removeClass(root, 'light');
        } else {
          this.renderer.addClass(root, 'light');
          this.renderer.removeClass(root, 'dark');
        }
      }
    });
  }

  ngOnInit(): void {
    // Initialize the root element class
    if (this.isBrowser) {
      const root = document.documentElement;
      if (this.currentTheme() === 'dark') {
        this.renderer.addClass(root, 'dark');
      } else {
        this.renderer.addClass(root, 'light');
      }
    }
  }

  // Toggle theme
  protected toggleTheme(): void {
    if (this.isDisabled) return;
    const nextTheme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.syncedTheme.set(nextTheme);
    this.onChange(nextTheme);
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: 'light' | 'dark'): void {
    if (value === 'light' || value === 'dark') {
      this.syncedTheme.set(value);
    }
  }

  registerOnChange(fn: (value: 'light' | 'dark') => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
