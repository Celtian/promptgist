import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';

const cardVariants = cva(
  [
    'block min-w-0 rounded-lg border transition-colors',
    'border-[var(--ui-card-border,var(--ui-color-border))]',
    'bg-[var(--ui-card-background,var(--ui-color-surface-muted))]',
    'text-[var(--ui-card-color,var(--ui-color-text))]',
    'shadow-[var(--ui-card-shadow,none)]',
  ],
  {
    variants: {
      variant: {
        surface: [
          '[--ui-card-background:var(--ui-color-surface-muted)]',
          '[--ui-card-border:var(--ui-color-border)]',
          '[--ui-card-color:var(--ui-color-text)]',
        ],
        outline: [
          '[--ui-card-background:var(--ui-color-surface)]',
          '[--ui-card-border:var(--ui-color-border)]',
          '[--ui-card-color:var(--ui-color-text)]',
        ],
        elevated: [
          '[--ui-card-background:var(--ui-color-surface)]',
          '[--ui-card-border:color-mix(in_srgb,var(--ui-color-border)_70%,transparent)]',
          '[--ui-card-color:var(--ui-color-text)]',
          '[--ui-card-shadow:0_18px_48px_color-mix(in_srgb,var(--ui-color-secondary-950)_10%,transparent)]',
        ],
        primary: [
          '[--ui-card-background:var(--ui-color-primary)]',
          '[--ui-card-border:color-mix(in_srgb,var(--ui-color-primary)_76%,var(--ui-color-primary-950))]',
          '[--ui-card-color:var(--ui-color-primary-contrast)]',
        ],
        secondary: [
          '[--ui-card-background:var(--ui-color-secondary)]',
          '[--ui-card-border:var(--ui-color-border)]',
          '[--ui-card-color:var(--ui-color-secondary-contrast)]',
        ],
        accent: [
          '[--ui-card-background:var(--ui-color-accent)]',
          '[--ui-card-border:color-mix(in_srgb,var(--ui-color-accent)_76%,var(--ui-color-accent-950))]',
          '[--ui-card-color:var(--ui-color-accent-contrast)]',
        ],
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
    },
    defaultVariants: {
      variant: 'surface',
      padding: 'md',
    },
  },
);

type CardVariants = VariantProps<typeof cardVariants>;

@Component({
  selector: 'ui-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class Card {
  readonly uiClass = input('');
  readonly variant = input<CardVariants['variant']>('surface');
  readonly padding = input<CardVariants['padding']>('md');

  protected readonly hostClasses = computed(() =>
    cn(cardVariants({ variant: this.variant(), padding: this.padding() }), this.uiClass()),
  );
}
