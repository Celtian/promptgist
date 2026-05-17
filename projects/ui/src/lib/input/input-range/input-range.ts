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

const inputRangeVariants = cva(
  [
    'flex w-full cursor-pointer appearance-none bg-transparent',
    'focus:outline-none',

    // Webkit Track
    '[&::-webkit-slider-runnable-track]:h-2',
    '[&::-webkit-slider-runnable-track]:rounded-full',
    '[&::-webkit-slider-runnable-track]:bg-[var(--ui-input-background,var(--ui-color-surface-muted))]',
    '[&::-webkit-slider-runnable-track]:transition-colors',

    // Webkit Thumb
    '[&::-webkit-slider-thumb]:appearance-none',
    '[&::-webkit-slider-thumb]:-mt-1.5',
    '[&::-webkit-slider-thumb]:size-5',
    '[&::-webkit-slider-thumb]:rounded-full',
    '[&::-webkit-slider-thumb]:bg-[var(--ui-input-focus,var(--ui-color-primary))]',
    '[&::-webkit-slider-thumb]:transition-all',

    // Webkit Thumb Focus
    'focus:[&::-webkit-slider-thumb]:outline',
    'focus:[&::-webkit-slider-thumb]:outline-2',
    'focus:[&::-webkit-slider-thumb]:outline-offset-2',
    '[&::-webkit-slider-thumb]:outline-[color-mix(in_srgb,var(--ui-input-focus,var(--ui-color-primary))_60%,transparent)]',

    // Firefox Track
    '[&::-moz-range-track]:h-2',
    '[&::-moz-range-track]:rounded-full',
    '[&::-moz-range-track]:bg-[var(--ui-input-background,var(--ui-color-surface-muted))]',
    '[&::-moz-range-track]:transition-colors',

    // Firefox Thumb
    '[&::-moz-range-thumb]:size-5',
    '[&::-moz-range-thumb]:rounded-full',
    '[&::-moz-range-thumb]:border-none',
    '[&::-moz-range-thumb]:bg-[var(--ui-input-focus,var(--ui-color-primary))]',
    '[&::-moz-range-thumb]:transition-all',

    // Firefox Thumb Focus
    'focus:[&::-moz-range-thumb]:outline',
    'focus:[&::-moz-range-thumb]:outline-2',
    'focus:[&::-moz-range-thumb]:outline-offset-2',
    '[&::-moz-range-thumb]:outline-[color-mix(in_srgb,var(--ui-input-focus,var(--ui-color-primary))_60%,transparent)]',

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
  selector: 'ui-input-range',
  imports: [],
  templateUrl: './input-range.html',
  styleUrl: './input-range.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRange implements FormValueControl<number> {
  private static nextId = 0;

  public readonly value = model<number>(0);
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly touched = model(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  public readonly id = input<string>();
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

  protected readonly inputId = computed(() => this.id() ?? `ui-input-range-${InputRange.nextId++}`);
  protected readonly hasErrors = computed(() => this.errors().length > 0);

  protected readonly inputClasses = computed(() =>
    cn(
      inputRangeVariants({ fullWidth: this.fullWidth() }),
      this.hasErrors() && '[--ui-input-focus:var(--ui-color-accent)]',
      this.uiClass(),
    ),
  );

  protected onInput(event: Event): void {
    if (this.disabled()) return;
    const value = (event.target as HTMLInputElement).value;
    this.value.set(Number(value));
    this.touched.set(true);
  }

  protected onBlur(): void {
    if (this.disabled()) return;
    this.touched.set(true);
  }
}
