import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';
import { TooltipPlacement } from './tooltip';

const tooltipContentVariants = cva(
  [
    // Base — always present
    'relative pointer-events-none max-w-xs rounded-md border px-2.5 py-1.5 text-xs font-medium leading-tight shadow-md',
  ],
  {
    variants: {
      variant: {
        dark: [
          '[--tooltip-bg:var(--ui-color-secondary-900)]',
          '[--tooltip-text:var(--ui-color-secondary-50)]',
          '[--tooltip-border:var(--ui-color-secondary-700)]',
          'bg-(--tooltip-bg) text-(--tooltip-text) border-(--tooltip-border)',
        ],
        light: [
          '[--tooltip-bg:var(--ui-color-surface)]',
          '[--tooltip-text:var(--ui-color-text)]',
          '[--tooltip-border:var(--ui-color-border)]',
          'bg-(--tooltip-bg) text-(--tooltip-text) border-(--tooltip-border) shadow-lg',
        ],
        primary: [
          '[--tooltip-bg:var(--ui-color-primary)]',
          '[--tooltip-text:var(--ui-color-primary-contrast)]',
          '[--tooltip-border:color-mix(in_srgb,var(--ui-color-primary)_70%,var(--ui-color-primary-950))]',
          'bg-(--tooltip-bg) text-(--tooltip-text) border-(--tooltip-border)',
        ],
        accent: [
          '[--tooltip-bg:var(--ui-color-accent)]',
          '[--tooltip-text:var(--ui-color-accent-contrast)]',
          '[--tooltip-border:color-mix(in_srgb,var(--ui-color-accent)_70%,var(--ui-color-accent-950))]',
          'bg-(--tooltip-bg) text-(--tooltip-text) border-(--tooltip-border)',
        ],
      },
    },
    defaultVariants: {
      variant: 'dark',
    },
  },
);

type TooltipContentVariants = VariantProps<typeof tooltipContentVariants>;

@Component({
  selector: 'ui-tooltip-content',
  imports: [],
  templateUrl: './tooltip-content.html',
  styleUrl: './tooltip-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipContent {
  readonly text = input('');
  readonly placement = input<TooltipPlacement>('top');
  readonly variant = input<TooltipContentVariants['variant']>('dark');

  protected readonly classes = computed(() =>
    cn(tooltipContentVariants({ variant: this.variant() })),
  );
}
