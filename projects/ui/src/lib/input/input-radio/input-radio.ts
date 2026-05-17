import { Listbox, Option } from '@angular/aria/listbox';
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

export interface InputRadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const listboxClasses = cva('flex outline-none', {
  variants: {
    inline: {
      true: 'flex-row flex-wrap gap-4',
      false: 'flex-col gap-2',
    },
  },
  defaultVariants: {
    inline: false,
  },
});

const optionClasses = cva([
  'group flex cursor-pointer items-center gap-3 rounded-md outline-none text-sm text-[var(--ui-color-text)]',
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-55',
]);

const radioCircleClasses = cva([
  'flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors',
  'border-[var(--ui-input-border,var(--ui-color-border))]',
  'bg-[var(--ui-input-background,var(--ui-color-surface))]',
  'group-aria-selected:border-[var(--ui-color-primary)]',
  'group-aria-selected:bg-[var(--ui-color-primary)]',
  'group-data-[active=true]:outline group-data-[active=true]:outline-2 group-data-[active=true]:outline-offset-2',
  'outline-[color-mix(in_srgb,var(--ui-input-focus,var(--ui-color-primary))_60%,transparent)]',
]);

const radioDotClasses = cva([
  'size-1.5 rounded-full bg-[var(--ui-color-surface)] transition-transform scale-0',
  'group-aria-selected:scale-100',
]);

@Component({
  selector: 'ui-input-radio',
  imports: [Listbox, Option],
  templateUrl: './input-radio.html',
  styleUrl: './input-radio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRadio implements FormValueControl<string | null> {
  private static nextId = 0;
  protected readonly inputId = `ui-input-radio-${InputRadio.nextId++}`;

  public readonly value = model<string | null>(null);
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly touched = model(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  public readonly options = input<readonly InputRadioOption[]>([]);
  public readonly ariaLabel = input('Select an option');
  public readonly inline = input(false, { transform: booleanAttribute });

  protected readonly hasErrors = computed(() => this.errors().length > 0);
  protected readonly selectedValues = computed(() => {
    const value = this.value();
    return value === null ? [] : [value];
  });

  protected readonly listboxClasses = computed(() => cn(listboxClasses({ inline: this.inline() })));
  protected readonly optionClasses = computed(() => cn(optionClasses()));

  protected readonly radioCircleClasses = computed(() =>
    cn(
      radioCircleClasses(),
      this.hasErrors() &&
        '[--ui-input-border:var(--ui-color-accent)] [--ui-input-focus:var(--ui-color-accent)]',
    ),
  );
  protected readonly radioDotClasses = computed(() => cn(radioDotClasses()));

  protected setValue(values: string[]): void {
    if (this.disabled()) return;
    const nextValue = values[0] ?? null;
    this.value.set(nextValue);
    this.touched.set(true);
  }
}
