import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidEye, faSolidEyeSlash } from '@ng-icons/font-awesome/solid';
import { cva } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const inputPasswordRoot = cva('relative inline-flex', {
  variants: {
    fullWidth: {
      true: 'w-full',
      false: 'w-auto',
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

const inputPasswordVariants = cva([
  'flex h-10 w-full rounded-md border px-3 py-2 pr-10 text-sm transition-colors',
  'border-[var(--ui-input-border,var(--ui-color-border))]',
  'bg-[var(--ui-input-background,var(--ui-color-surface))]',
  'text-[var(--ui-color-text)]',
  'placeholder:text-[var(--ui-color-text-muted)]',
  'focus:border-[var(--ui-input-border,var(--ui-color-border))] focus:ring-0',
  'focus:outline focus:outline-2 focus:outline-offset-2',
  'outline-[color-mix(in_srgb,var(--ui-input-focus,var(--ui-color-primary))_60%,transparent)]',
  'disabled:cursor-not-allowed disabled:opacity-55',
]);

@Component({
  selector: 'ui-input-password',
  imports: [NgIcon],
  templateUrl: './input-password.html',
  styleUrl: './input-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ faSolidEye, faSolidEyeSlash })],
})
export class InputPassword implements FormValueControl<string> {
  private static nextId = 0;

  public readonly value = model<string>('');
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly touched = model(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  public readonly id = input<string>();
  public readonly placeholder = input<string>('');
  public readonly fullWidth = input(true, { transform: booleanAttribute });
  public readonly uiClass = input('');

  protected readonly inputId = computed(
    () => this.id() ?? `ui-input-password-${InputPassword.nextId++}`,
  );
  protected readonly isVisible = signal(false);
  protected readonly hasErrors = computed(() => this.errors().length > 0);

  protected readonly rootClasses = computed(() =>
    cn(inputPasswordRoot({ fullWidth: this.fullWidth() }), this.uiClass()),
  );

  protected readonly inputClasses = computed(() =>
    cn(
      inputPasswordVariants(),
      this.hasErrors() &&
        '[--ui-input-border:var(--ui-color-accent)] [--ui-input-focus:var(--ui-color-accent)]',
    ),
  );

  protected onInput(event: Event): void {
    if (this.disabled()) return;
    this.value.set((event.target as HTMLInputElement).value);
    this.touched.set(true);
  }

  protected onBlur(): void {
    if (this.disabled()) return;
    this.touched.set(true);
  }

  protected toggleVisibility(): void {
    if (this.disabled()) return;
    this.isVisible.update((v) => !v);
  }
}
