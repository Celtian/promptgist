import {
  Combobox,
  ComboboxInput,
  ComboboxPopup,
  ComboboxPopupContainer,
} from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  afterRenderEffect,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  viewChild,
  viewChildren,
  effect,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidCheck, faSolidChevronDown } from '@ng-icons/font-awesome/solid';
import { cva } from 'class-variance-authority';

import { cn } from '../../utils/utils';

export interface InputAutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const rootClasses = cva('relative inline-grid min-w-56 text-[var(--ui-color-text)]', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
});

const triggerClasses = cva([
  'relative flex h-10 min-w-0 items-center rounded-md border px-3 text-sm transition-colors',
  'border-[var(--ui-input-border,var(--ui-color-border))]',
  'bg-[var(--ui-input-background,var(--ui-color-surface))]',
  'text-[var(--ui-color-text)]',
  'focus-within:outline focus-within:outline-2 focus-within:outline-offset-[-1px]',
  'outline-[color-mix(in_srgb,var(--ui-input-focus,var(--ui-color-primary))_60%,transparent)]',
  'hover:bg-[var(--ui-color-surface-muted)]',
  'has-[[aria-disabled=true]]:cursor-not-allowed has-[[aria-disabled=true]]:opacity-55',
]);

const popupClasses = cva([
  'mt-2 max-h-60 w-full overflow-hidden rounded-md border p-1 text-sm shadow-lg',
  'border-[var(--ui-color-border)]',
  'bg-[var(--ui-color-surface)]',
  'text-[var(--ui-color-text)]',
  'transition-[max-height,opacity,visibility] duration-150',
]);

const listboxClasses = cva('flex max-h-56 flex-col gap-1 overflow-auto outline-none');

const optionClasses = cva([
  'flex min-h-9 cursor-pointer items-center gap-2 rounded px-3 py-2',
  'hover:bg-[var(--ui-color-surface-muted)]',
  'data-[active=true]:bg-[var(--ui-color-surface-muted)]',
  'data-[active=true]:outline data-[active=true]:outline-2 data-[active=true]:outline-offset-[-2px]',
  'data-[active=true]:outline-[color-mix(in_srgb,var(--ui-color-primary)_55%,transparent)]',
  'aria-selected:text-[var(--ui-color-primary)]',
  'aria-selected:bg-[color-mix(in_srgb,var(--ui-color-primary)_12%,transparent)]',
  'aria-disabled:cursor-not-allowed aria-disabled:opacity-55',
]);

@Component({
  selector: 'ui-input-autocomplete',
  imports: [
    Combobox,
    ComboboxInput,
    ComboboxPopup,
    ComboboxPopupContainer,
    Listbox,
    Option,
    OverlayModule,
    FormsModule,
    NgIcon,
  ],
  templateUrl: './input-autocomplete.html',
  styleUrl: './input-autocomplete.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ faSolidCheck, faSolidChevronDown })],
})
export class InputAutocomplete implements FormValueControl<string | null> {
  private static nextId = 0;
  protected readonly inputId = `ui-input-autocomplete-${InputAutocomplete.nextId++}`;
  protected readonly popupId = `${this.inputId}-popup`;

  protected readonly listbox = viewChild<Listbox<string>>(Listbox);
  protected readonly optionsList = viewChildren<Option<string>>(Option);
  protected readonly combobox = viewChild<Combobox<string>>(Combobox);

  public readonly value = model<string | null>(null);
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly touched = model(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  public readonly options = input<readonly InputAutocompleteOption[]>([]);
  public readonly placeholder = input('Search...');
  public readonly ariaLabel = input('Search...');
  public readonly fullWidth = input(false, { transform: booleanAttribute });
  public readonly noResultsText = input('No results found');

  public readonly query = model<string>('');

  protected readonly hasErrors = computed(() => this.errors().length > 0);
  protected readonly selectedValues = computed(() => {
    const value = this.value();
    return value === null ? [] : [value];
  });

  protected readonly filteredOptions = computed(() => {
    const query = this.query()?.toLowerCase() || '';
    if (!query) return this.options();
    return this.options().filter((option) => option.label.toLowerCase().includes(query));
  });

  protected readonly rootClasses = computed(() => cn(rootClasses({ fullWidth: this.fullWidth() })));
  protected readonly triggerClasses = computed(() =>
    cn(
      triggerClasses(),
      this.hasErrors() &&
        '[--ui-input-border:var(--ui-color-accent)] [--ui-input-focus:var(--ui-color-accent)]',
    ),
  );
  protected readonly popupClasses = computed(() => cn(popupClasses()));
  protected readonly listboxClasses = computed(() => cn(listboxClasses()));
  protected readonly optionClasses = computed(() => cn(optionClasses()));

  public constructor() {
    effect(() => {
      const val = this.value();
      if (val !== null) {
        const option = this.options().find((o) => o.value === val);
        if (option && untracked(this.query) !== option.label) {
          untracked(() => this.query.set(option.label));
        }
      }
    });

    afterRenderEffect(() => {
      const option = this.optionsList().find((currentOption) => currentOption.active());
      setTimeout(() => option?.element.scrollIntoView({ block: 'nearest' }), 50);
    });

    afterRenderEffect(() => {
      if (!this.combobox()?.expanded()) {
        setTimeout(() => this.listbox()?.element.scrollTo(0, 0), 150);

        const val = this.value();
        if (val !== null) {
          const option = this.options().find((o) => o.value === val);
          if (option && this.query() !== option.label) {
            this.query.set(option.label);
          }
        } else if (this.query() !== '') {
          this.query.set('');
        }
      }
    });
  }

  protected setValue(values: string[]): void {
    if (this.disabled()) return;
    const nextValue = values[0] ?? null;

    this.value.set(nextValue);
    this.touched.set(true);

    if (nextValue !== null) {
      const option = this.options().find((o) => o.value === nextValue);
      if (option) {
        this.query.set(option.label);
      }
    }
  }
}
