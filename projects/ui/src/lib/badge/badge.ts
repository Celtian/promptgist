import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';

const badgeVariants = cva(
  [
    'inline-flex min-w-0 items-center gap-1 rounded-full border font-semibold leading-none',
    'transition-colors',
    'border-[var(--ui-badge-border,var(--ui-color-border))]',
    'bg-[var(--ui-badge-background,var(--ui-color-surface-muted))]',
    'text-[var(--ui-badge-color,var(--ui-color-text))]',
  ],
  {
    variants: {
      variant: {
        surface: [
          '[--ui-badge-background:var(--ui-color-surface-muted)]',
          '[--ui-badge-border:var(--ui-color-border)]',
          '[--ui-badge-color:var(--ui-color-text)]',
        ],
        outline: [
          '[--ui-badge-background:transparent]',
          '[--ui-badge-border:var(--ui-color-border)]',
          '[--ui-badge-color:var(--ui-color-text)]',
        ],
        primary: [
          '[--ui-badge-background:color-mix(in_srgb,var(--ui-color-primary)_16%,transparent)]',
          '[--ui-badge-border:color-mix(in_srgb,var(--ui-color-primary)_42%,transparent)]',
          '[--ui-badge-color:var(--ui-color-primary)]',
        ],
        secondary: [
          '[--ui-badge-background:var(--ui-color-secondary)]',
          '[--ui-badge-border:var(--ui-color-border)]',
          '[--ui-badge-color:var(--ui-color-secondary-contrast)]',
        ],
        accent: [
          '[--ui-badge-background:color-mix(in_srgb,var(--ui-color-accent)_16%,transparent)]',
          '[--ui-badge-border:color-mix(in_srgb,var(--ui-color-accent)_42%,transparent)]',
          '[--ui-badge-color:var(--ui-color-accent)]',
        ],
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1.5 text-xs',
        lg: 'px-3 py-2 text-sm',
      },
    },
    defaultVariants: {
      variant: 'surface',
      size: 'md',
    },
  },
);

type BadgeVariants = VariantProps<typeof badgeVariants>;

@Component({
  selector: 'span[ui-badge],div[ui-badge]',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class Badge {
  readonly variant = input<BadgeVariants['variant']>('surface');
  readonly size = input<BadgeVariants['size']>('md');
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(badgeVariants({ variant: this.variant(), size: this.size() }), this.uiClass()),
  );
}
