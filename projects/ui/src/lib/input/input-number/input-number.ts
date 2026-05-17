import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  numberAttribute,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const inputNumberVariants = cva(
  [
    'flex h-10 w-full rounded-md border px-3 py-2 text-sm transition-colors',
    'border-[var(--ui-input-border,var(--ui-color-border))]',
    'bg-[var(--ui-input-background,var(--ui-color-surface))]',
    'text-[var(--ui-color-text)]',
    'placeholder:text-[var(--ui-color-text-muted)]',
    'focus:border-[var(--ui-input-border,var(--ui-color-border))] focus:ring-0',
    'focus:outline focus:outline-2 focus:outline-offset-2',
    'outline-[color-mix(in_srgb,var(--ui-input-focus,var(--ui-color-primary))_60%,transparent)]',
    'disabled:cursor-not-allowed disabled:opacity-55',
  ],
  {
    variants: {
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      fullWidth: true,
    },
  },
);

@Component({
  selector: 'ui-input-number',
  imports: [],
  templateUrl: './input-number.html',
  styleUrl: './input-number.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumber implements FormValueControl<number | null> {
  private static nextId = 0;

  public readonly value = model<number | null>(null);
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly touched = model(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  public readonly id = input<string>();
  public readonly placeholder = input<string>('');
  public readonly fullWidth = input(true, { transform: booleanAttribute });
  public readonly min = input<number | undefined>(undefined, {
    transform: (v: unknown) => (v == null ? undefined : numberAttribute(v)),
  });
  public readonly max = input<number | undefined>(undefined, {
    transform: (v: unknown) => (v == null ? undefined : numberAttribute(v)),
  });
  public readonly step = input<number | undefined>(undefined, {
    transform: (v: unknown) => (v == null ? undefined : numberAttribute(v)),
  });
  public readonly uiClass = input('');

  protected readonly inputId = computed(
    () => this.id() ?? `ui-input-number-${InputNumber.nextId++}`,
  );
  protected readonly hasErrors = computed(() => this.errors().length > 0);

  protected readonly inputClasses = computed(() =>
    cn(
      inputNumberVariants({ fullWidth: this.fullWidth() }),
      this.hasErrors() &&
        '[--ui-input-border:var(--ui-color-accent)] [--ui-input-focus:var(--ui-color-accent)]',
      this.uiClass(),
    ),
  );

  protected onInput(event: Event): void {
    if (this.disabled()) return;
    const value = (event.target as HTMLInputElement).value;
    const parsed = value === '' ? null : Number(value);
    this.value.set(Number.isNaN(parsed) ? null : parsed);
    this.touched.set(true);
  }

  protected onBlur(): void {
    if (this.disabled()) return;
    this.touched.set(true);
  }
}
