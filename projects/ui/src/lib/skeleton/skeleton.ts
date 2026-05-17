import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';

const skeletonVariants = cva(
  [
    'block',
    'bg-[var(--ui-skeleton-background,color-mix(in_srgb,var(--ui-color-secondary-500)_20%,var(--ui-color-surface-muted)))]',
  ],
  {
    variants: {
      shape: {
        rect: 'rounded-md',
        circle: 'rounded-full',
        text: 'rounded',
      },
      animation: {
        pulse: 'animate-pulse',
        shimmer: 'ui-skeleton-shimmer',
        none: '',
      },
    },
    defaultVariants: {
      shape: 'rect',
      animation: 'pulse',
    },
  },
);

type SkeletonVariants = VariantProps<typeof skeletonVariants>;

@Component({
  selector: 'ui-skeleton',
  imports: [],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class Skeleton {
  readonly shape = input<SkeletonVariants['shape']>('rect');
  readonly animation = input<SkeletonVariants['animation']>('pulse');
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(
      skeletonVariants({
        shape: this.shape(),
        animation: this.animation(),
      }),
      this.uiClass(),
    ),
  );
}
