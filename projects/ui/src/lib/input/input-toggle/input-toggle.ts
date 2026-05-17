import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { cva } from 'class-variance-authority';

import { cn } from '../../utils/utils';

const toggleRoot = cva('group inline-flex min-w-0 items-center gap-3 text-[var(--ui-color-text)]', {
  variants: {
    disabled: {
      true: 'cursor-not-allowed opacity-55',
      false: 'cursor-pointer',
    },
  },
});

const toggleTrack = cva([
  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border p-0.5 transition-colors',
  'border-[var(--ui-input-border,var(--ui-color-border))]',
  'bg-[var(--ui-input-background,var(--ui-color-surface-muted))]',
  'group-focus-within:outline group-focus-within:outline-2 group-focus-within:outline-offset-2',
  'group-focus-within:outline-[color-mix(in_srgb,var(--ui-color-primary)_60%,transparent)]',
]);

const toggleThumb = cva([
  'size-5 rounded-full bg-[var(--ui-color-surface)] shadow-sm transition-transform',
  'group-has-[:checked]:translate-x-5',
]);

@Component({
  selector: 'ui-input-toggle',
  imports: [],
  templateUrl: './input-toggle.html',
  styleUrl: './input-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputToggle implements FormValueControl<boolean> {
  private static nextId = 0;
  protected readonly inputId = `ui-input-toggle-${InputToggle.nextId++}`;

  public readonly value = model<boolean>(false, { alias: 'checked' });
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly touched = model(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  protected readonly hasErrors = computed(() => this.errors().length > 0);
  protected readonly rootClasses = computed(() => cn(toggleRoot({ disabled: this.disabled() })));
  protected readonly trackClasses = computed(() =>
    cn(
      toggleTrack(),
      this.value() &&
        '[--ui-input-background:var(--ui-color-primary)] [--ui-input-border:var(--ui-color-primary)]',
      this.hasErrors() &&
        '[--ui-input-border:var(--ui-color-accent)] group-focus-within:outline-[color-mix(in_srgb,var(--ui-color-accent)_60%,transparent)]',
    ),
  );
  protected readonly thumbClasses = computed(() => cn(toggleThumb()));

  public setChecked(event: Event): void {
    if (this.disabled()) {
      return;
    }

    this.value.set((event.target as HTMLInputElement).checked);
    this.touched.set(true);
  }

  public toggle(): void {
    if (!this.disabled()) {
      this.value.update((v) => !v);
      this.touched.set(true);
    }
  }
}
