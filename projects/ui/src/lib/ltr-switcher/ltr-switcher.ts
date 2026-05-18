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
import { Button } from '../button/button';
import { Tooltip } from '../tooltip/tooltip';
import { StorageService } from '../utils/local-storage';

export const LTR_SWITCHER_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LtrSwitcher),
  multi: true,
};

@Component({
  selector: 'ui-ltr-switcher',
  imports: [Button, Tooltip],
  templateUrl: './ltr-switcher.html',
  providers: [LTR_SWITCHER_VALUE_ACCESSOR],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LtrSwitcher implements ControlValueAccessor, OnInit {
  private readonly storage = inject(StorageService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly renderer = inject(Renderer2);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Inputs using signal-based input()
  public readonly uiClass = input<string>('');

  // Internal synchronized storage state for layout direction: 'ltr' | 'rtl'
  private readonly syncedDir = this.storage.createSyncedSignal<'ltr' | 'rtl'>(
    'ui-direction',
    'ltr',
  );

  // Internal CVA callbacks (with noop comments to satisfy the linter)
  private onChange: (value: 'ltr' | 'rtl') => void = () => {
    /* noop */
  };
  private onTouched: () => void = () => {
    /* noop */
  };
  protected isDisabled = false;

  // Signal exposed for template rendering
  protected readonly currentDir = computed(() => this.syncedDir.asSignal()());

  constructor() {
    // Apply attribute to HTML element whenever the synced direction signal changes
    effect(() => {
      const dir = this.currentDir();
      if (this.isBrowser) {
        const root = document.documentElement;
        this.renderer.setAttribute(root, 'dir', dir);
      }
    });
  }

  ngOnInit(): void {
    // Initialize the root element attribute
    if (this.isBrowser) {
      const root = document.documentElement;
      this.renderer.setAttribute(root, 'dir', this.currentDir());
    }
  }

  // Toggle direction
  protected toggleDirection(): void {
    if (this.isDisabled) return;
    const nextDir = this.currentDir() === 'ltr' ? 'rtl' : 'ltr';
    this.syncedDir.set(nextDir);
    this.onChange(nextDir);
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: 'ltr' | 'rtl'): void {
    if (value === 'ltr' || value === 'rtl') {
      this.syncedDir.set(value);
    }
  }

  registerOnChange(fn: (value: 'ltr' | 'rtl') => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
