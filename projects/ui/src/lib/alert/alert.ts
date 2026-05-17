import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';

const alertVariants = cva(
  [
    'block min-w-0 rounded-lg border p-4 leading-6 transition-colors',
    'border-[var(--ui-alert-border,var(--ui-color-border))]',
    'bg-[var(--ui-alert-background,var(--ui-color-surface-muted))]',
    'text-[var(--ui-alert-color,var(--ui-color-text))]',
    '[&_strong]:font-bold',
    '[&_p]:m-0',
    '[&_a]:font-bold [&_a]:text-inherit [&_a]:underline',
  ],
  {
    variants: {
      variant: {
        surface: [
          '[--ui-alert-background:var(--ui-color-surface-muted)]',
          '[--ui-alert-border:var(--ui-color-border)]',
          '[--ui-alert-color:var(--ui-color-text)]',
        ],
        outline: [
          '[--ui-alert-background:var(--ui-color-surface)]',
          '[--ui-alert-border:var(--ui-color-border)]',
          '[--ui-alert-color:var(--ui-color-text)]',
        ],
        primary: [
          '[--ui-alert-background:color-mix(in_srgb,var(--ui-color-primary)_14%,var(--ui-color-surface))]',
          '[--ui-alert-border:color-mix(in_srgb,var(--ui-color-primary)_46%,transparent)]',
          '[--ui-alert-color:var(--ui-color-text)]',
        ],
        secondary: [
          '[--ui-alert-background:var(--ui-color-secondary)]',
          '[--ui-alert-border:var(--ui-color-border)]',
          '[--ui-alert-color:var(--ui-color-secondary-contrast)]',
        ],
        accent: [
          '[--ui-alert-background:color-mix(in_srgb,var(--ui-color-accent)_14%,var(--ui-color-surface))]',
          '[--ui-alert-border:color-mix(in_srgb,var(--ui-color-accent)_46%,transparent)]',
          '[--ui-alert-color:var(--ui-color-text)]',
        ],
      },
    },
    defaultVariants: {
      variant: 'surface',
    },
  },
);

type AlertVariants = VariantProps<typeof alertVariants>;

@Component({
  selector: 'ui-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'role()',
    '[class]': 'hostClasses()',
  },
})
export class Alert {
  readonly variant = input<AlertVariants['variant']>('surface');
  readonly role = input('status');
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(alertVariants({ variant: this.variant() }), this.uiClass()),
  );
}
