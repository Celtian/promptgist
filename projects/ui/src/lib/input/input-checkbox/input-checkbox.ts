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

const checkboxRoot = cva(
  'group inline-flex min-w-0 items-start gap-3 text-[var(--ui-color-text)]',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed opacity-55',
        false: 'cursor-pointer',
      },
    },
  },
);

const checkboxControl = cva([
  'mt-0.5 grid size-5 shrink-0 place-items-center rounded border transition-colors',
  'border-[var(--ui-input-border,var(--ui-color-border))]',
  'bg-[var(--ui-input-background,var(--ui-color-surface))]',
  'text-[var(--ui-input-color,var(--ui-color-primary-contrast))]',
  'group-focus-within:outline group-focus-within:outline-2 group-focus-within:outline-offset-2',
  'group-focus-within:outline-[color-mix(in_srgb,var(--ui-color-primary)_60%,transparent)]',
]);

@Component({
  selector: 'ui-input-checkbox',
  imports: [],
  templateUrl: './input-checkbox.html',
  styleUrl: './input-checkbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCheckbox implements FormValueControl<boolean> {
  private static nextId = 0;
  protected readonly inputId = `ui-input-checkbox-${InputCheckbox.nextId++}`;

  public readonly value = model<boolean>(false, { alias: 'checked' });
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly touched = model(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  protected readonly hasErrors = computed(() => this.errors().length > 0);
  protected readonly rootClasses = computed(() => cn(checkboxRoot({ disabled: this.disabled() })));
  protected readonly controlClasses = computed(() =>
    cn(
      checkboxControl(),
      this.value() &&
        '[--ui-input-background:var(--ui-color-primary)] [--ui-input-border:var(--ui-color-primary)]',
      this.hasErrors() &&
        '[--ui-input-border:var(--ui-color-accent)] group-focus-within:outline-[color-mix(in_srgb,var(--ui-color-accent)_60%,transparent)]',
    ),
  );

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
