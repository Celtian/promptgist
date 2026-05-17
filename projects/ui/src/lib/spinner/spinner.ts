import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';

const spinnerVariants = cva(
  [
    'inline-block shrink-0 rounded-full border-solid',
    'border-[var(--ui-spinner-track,color-mix(in_srgb,var(--ui-color-secondary-500)_25%,transparent))]',
    'border-t-[var(--ui-spinner-color,var(--ui-color-primary))]',
    'animate-spin',
  ],
  {
    variants: {
      size: {
        xs: 'size-4 border-2',
        sm: 'size-5 border-2',
        md: 'size-7 border-[3px]',
        lg: 'size-10 border-4',
        xl: 'size-14 border-[5px]',
      },
      variant: {
        primary: '[--ui-spinner-color:var(--ui-color-primary)]',
        secondary: '[--ui-spinner-color:var(--ui-color-text-muted)]',
        accent: '[--ui-spinner-color:var(--ui-color-accent)]',
        white: '[--ui-spinner-color:#ffffff]',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'primary',
    },
  },
);

type SpinnerVariants = VariantProps<typeof spinnerVariants>;

@Component({
  selector: 'ui-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'status',
    '[attr.aria-label]': 'ariaLabel()',
    '[class]': 'hostClasses()',
  },
})
export class Spinner {
  readonly size = input<SpinnerVariants['size']>('md');
  readonly variant = input<SpinnerVariants['variant']>('primary');
  readonly ariaLabel = input('Loading…');
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(
      spinnerVariants({
        size: this.size(),
        variant: this.variant(),
      }),
      this.uiClass(),
    ),
  );
}
