import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { Button } from '../../button/button';
import { cn } from '../../utils/utils';

const toastVariants = cva(
  [
    'grid min-w-0 gap-3 rounded-lg border p-4 text-sm leading-6 shadow-[0_18px_48px_color-mix(in_srgb,var(--ui-color-secondary-950)_16%,transparent)]',
    'border-[var(--ui-toast-border,var(--ui-color-border))]',
    'bg-[var(--ui-toast-background,var(--ui-color-surface))]',
    'text-[var(--ui-toast-color,var(--ui-color-text))]',
    'animate-[ui-toast-in_160ms_ease-out]',
  ],
  {
    variants: {
      variant: {
        surface: [
          '[--ui-toast-background:var(--ui-color-surface)]',
          '[--ui-toast-border:var(--ui-color-border)]',
          '[--ui-toast-color:var(--ui-color-text)]',
        ],
        primary: [
          '[--ui-toast-background:color-mix(in_srgb,var(--ui-color-primary)_14%,var(--ui-color-surface))]',
          '[--ui-toast-border:color-mix(in_srgb,var(--ui-color-primary)_46%,transparent)]',
          '[--ui-toast-color:var(--ui-color-text)]',
        ],
        secondary: [
          '[--ui-toast-background:var(--ui-color-secondary)]',
          '[--ui-toast-border:var(--ui-color-border)]',
          '[--ui-toast-color:var(--ui-color-secondary-contrast)]',
        ],
        accent: [
          '[--ui-toast-background:color-mix(in_srgb,var(--ui-color-accent)_14%,var(--ui-color-surface))]',
          '[--ui-toast-border:color-mix(in_srgb,var(--ui-color-accent)_46%,transparent)]',
          '[--ui-toast-color:var(--ui-color-text)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'surface',
    },
  },
);

type ToastVariants = VariantProps<typeof toastVariants>;

export type ToastVariant = NonNullable<ToastVariants['variant']>;

@Component({
  selector: 'ui-toast',
  imports: [Button],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'role()',
    '[attr.aria-live]': 'ariaLive()',
    '[class]': 'hostClasses()',
  },
})
export class Toast {
  readonly title = input<string>();
  readonly message = input.required<string>();
  readonly variant = input<ToastVariant>('surface');
  readonly actionLabel = input<string>();
  readonly dismissLabel = input('Dismiss notification');
  readonly dismissible = input(true);
  readonly role = input('status');
  readonly ariaLive = input<'polite' | 'assertive'>('polite');
  readonly uiClass = input('');

  readonly actionSelected = output<void>();
  readonly dismissed = output<void>();

  protected readonly hostClasses = computed(() =>
    cn(toastVariants({ variant: this.variant() }), this.uiClass()),
  );
}
