import { Directive, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';

const scrollbarVariants = cva(
  [
    'overflow-auto',
    // Firefox
    '[scrollbar-width:thin]',
    '[scrollbar-color:var(--ui-scrollbar-thumb)_transparent]',
    // Webkit basics
    '[&::-webkit-scrollbar]:w-[var(--ui-scrollbar-size,8px)]',
    '[&::-webkit-scrollbar]:h-[var(--ui-scrollbar-size,8px)]',
    '[&::-webkit-scrollbar-track]:bg-transparent',
    '[&::-webkit-scrollbar-track]:rounded-full',
    '[&::-webkit-scrollbar-thumb]:rounded-full',
    '[&::-webkit-scrollbar-thumb]:border-2',
    '[&::-webkit-scrollbar-thumb]:border-solid',
    '[&::-webkit-scrollbar-thumb]:border-transparent',
    '[&::-webkit-scrollbar-thumb]:bg-clip-padding',
    '[&::-webkit-scrollbar-thumb]:bg-[var(--ui-scrollbar-thumb)]',
    '[&::-webkit-scrollbar-thumb:hover]:bg-[var(--ui-scrollbar-thumb-hover)]',
    '[&::-webkit-scrollbar-corner]:bg-transparent',
  ],
  {
    variants: {
      variant: {
        surface: [
          '[--ui-scrollbar-thumb:var(--ui-color-border)]',
          '[--ui-scrollbar-thumb-hover:var(--ui-color-secondary-400)]',
          'dark:[--ui-scrollbar-thumb-hover:var(--ui-color-secondary-600)]',
        ],
        primary: [
          '[--ui-scrollbar-thumb:color-mix(in_srgb,var(--ui-color-primary)_50%,transparent)]',
          '[--ui-scrollbar-thumb-hover:var(--ui-color-primary)]',
        ],
        accent: [
          '[--ui-scrollbar-thumb:color-mix(in_srgb,var(--ui-color-accent)_50%,transparent)]',
          '[--ui-scrollbar-thumb-hover:var(--ui-color-accent)]',
        ],
      },
      size: {
        sm: '[--ui-scrollbar-size:4px]',
        md: '[--ui-scrollbar-size:8px]',
        lg: '[--ui-scrollbar-size:12px]',
      },
    },
    defaultVariants: {
      variant: 'surface',
      size: 'md',
    },
  },
);

type ScrollbarVariants = VariantProps<typeof scrollbarVariants>;

@Directive({
  selector: '[uiScrollbar]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class Scrollbar {
  readonly variant = input<ScrollbarVariants['variant']>('surface');
  readonly size = input<ScrollbarVariants['size']>('md');
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(scrollbarVariants({ variant: this.variant(), size: this.size() }), this.uiClass()),
  );
}
