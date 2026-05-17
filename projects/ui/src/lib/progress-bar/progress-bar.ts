import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/utils';

const progressBarVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-[var(--ui-color-surface-muted)]',
  {
    variants: {
      size: {
        xs: 'h-1',
        sm: 'h-1.5',
        md: 'h-2',
        lg: 'h-3',
        xl: 'h-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

const progressIndicatorVariants = cva(
  'h-full w-full flex-1 bg-[var(--ui-color-indicator)] transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        primary: '[--ui-color-indicator:var(--ui-color-primary)]',
        secondary: '[--ui-color-indicator:var(--ui-color-secondary)]',
        accent: '[--ui-color-indicator:var(--ui-color-accent)]',
        success: '[--ui-color-indicator:var(--ui-color-success,rgb(34,197,94))]',
      },
      indeterminate: {
        true: 'origin-left ui-progress-bar-indeterminate',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      indeterminate: false,
    },
  },
);

type ProgressBarVariants = VariantProps<typeof progressBarVariants>;
type ProgressIndicatorVariants = VariantProps<typeof progressIndicatorVariants>;

@Component({
  selector: 'ui-progress-bar',
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    '[class]': 'hostClasses()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'isIndeterminate() ? null : value()',
  },
})
export class ProgressBar {
  /** The current value of the progress bar. If null or undefined, the progress bar is indeterminate. */
  readonly value = input<number | null>(null);
  /** The maximum value of the progress bar. */
  readonly max = input<number>(100);
  readonly variant = input<ProgressIndicatorVariants['variant']>('primary');
  readonly size = input<ProgressBarVariants['size']>('md');
  readonly uiClass = input('');

  protected readonly isIndeterminate = computed(() => this.value() == null);
  protected readonly percentage = computed(() => {
    const val = this.value();
    if (val == null) return 0;
    return Math.min(100, Math.max(0, (val / this.max()) * 100));
  });

  protected readonly transform = computed(() => {
    if (this.isIndeterminate()) return null;
    return `translateX(-${100 - this.percentage()}%)`;
  });

  protected readonly hostClasses = computed(() =>
    cn(progressBarVariants({ size: this.size() }), this.uiClass()),
  );

  protected readonly indicatorClasses = computed(() =>
    progressIndicatorVariants({ variant: this.variant(), indeterminate: this.isIndeterminate() }),
  );
}
