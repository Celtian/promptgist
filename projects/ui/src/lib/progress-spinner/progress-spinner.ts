import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/utils';

const progressSpinnerVariants = cva('inline-flex shrink-0 transform-gpu', {
  variants: {
    size: {
      xs: 'size-6',
      sm: 'size-8',
      md: 'size-12',
      lg: 'size-16',
      xl: 'size-24',
    },
    variant: {
      primary: 'text-[var(--ui-color-primary)]',
      secondary: 'text-[var(--ui-color-secondary)]',
      accent: 'text-[var(--ui-color-accent)]',
      success: 'text-[var(--ui-color-success,rgb(34,197,94))]',
    },
    indeterminate: {
      true: 'animate-spin',
      false: 'rotate-[-90deg]',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'primary',
    indeterminate: false,
  },
});

type ProgressSpinnerVariants = VariantProps<typeof progressSpinnerVariants>;

@Component({
  selector: 'ui-progress-spinner',
  imports: [],
  templateUrl: './progress-spinner.html',
  styleUrl: './progress-spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'progressbar',
    '[class]': 'hostClasses()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'isIndeterminate() ? null : value()',
  },
})
export class ProgressSpinner {
  readonly value = input<number | null>(null);
  readonly max = input<number>(100);
  readonly variant = input<ProgressSpinnerVariants['variant']>('primary');
  readonly size = input<ProgressSpinnerVariants['size']>('md');
  readonly uiClass = input('');

  protected readonly isIndeterminate = computed(() => this.value() == null);

  protected readonly circumference = computed(() => 2 * Math.PI * 20); // r=20

  protected readonly percentage = computed(() => {
    const val = this.value();
    if (val == null) return 0;
    return Math.min(100, Math.max(0, (val / this.max()) * 100));
  });

  protected readonly dashoffset = computed(() => {
    if (this.isIndeterminate()) return null;
    return this.circumference() - (this.percentage() / 100) * this.circumference();
  });

  protected readonly hostClasses = computed(() =>
    cn(
      progressSpinnerVariants({
        variant: this.variant(),
        size: this.size(),
        indeterminate: this.isIndeterminate(),
      }),
      this.uiClass(),
    ),
  );
}
