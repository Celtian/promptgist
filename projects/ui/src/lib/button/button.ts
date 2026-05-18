import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';

const buttonVariants = cva(
  [
    'inline-flex min-w-0 cursor-pointer items-center justify-center gap-2 rounded-md border font-medium',
    'transition-colors duration-150',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-[color-mix(in_srgb,var(--ui-button-focus,var(--ui-color-primary))_60%,transparent)]',
    'disabled:pointer-events-none disabled:opacity-55',
    'aria-disabled:pointer-events-none aria-disabled:opacity-55',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary: [
          'border-[var(--ui-color-primary)]',
          'bg-[var(--ui-color-primary)]',
          'text-[var(--ui-color-primary-contrast)]',
          'hover:bg-[color-mix(in_srgb,var(--ui-color-primary)_88%,var(--ui-color-primary-950))]',
          '[--ui-button-focus:var(--ui-color-primary)]',
        ],
        secondary: [
          'border-[var(--ui-color-border)]',
          'bg-[var(--ui-color-secondary)]',
          'text-[var(--ui-color-secondary-contrast)]',
          'hover:bg-[color-mix(in_srgb,var(--ui-color-secondary)_86%,var(--ui-color-text)_14%)]',
          '[--ui-button-focus:var(--ui-color-primary)]',
        ],
        accent: [
          'border-[var(--ui-color-accent)]',
          'bg-[var(--ui-color-accent)]',
          'text-[var(--ui-color-accent-contrast)]',
          'hover:bg-[color-mix(in_srgb,var(--ui-color-accent)_88%,var(--ui-color-accent-950))]',
          '[--ui-button-focus:var(--ui-color-accent)]',
        ],
        outline: [
          'border-[var(--ui-color-border)]',
          'bg-transparent',
          'text-[var(--ui-color-text)]',
          'hover:bg-[var(--ui-color-surface-muted)]',
          '[--ui-button-focus:var(--ui-color-primary)]',
        ],
        ghost: [
          'border-transparent',
          'bg-transparent',
          'text-[var(--ui-color-text)]',
          'hover:bg-[var(--ui-color-surface-muted)]',
          '[--ui-button-focus:var(--ui-color-primary)]',
        ],
        link: [
          'border-transparent',
          'bg-transparent',
          'p-0 text-[var(--ui-color-primary)]',
          'hover:text-[color-mix(in_srgb,var(--ui-color-primary)_78%,var(--ui-color-primary-950))]',
          'hover:underline',
          '[--ui-button-focus:var(--ui-color-primary)]',
        ],
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-11 px-5 text-base',
        icon: 'size-10 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'link',
        size: ['sm', 'md', 'lg'],
        class: 'h-auto',
      },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  },
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

@Component({
  selector: 'button[ui-button],a[ui-button]',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class Button {
  readonly variant = input<ButtonVariants['variant']>('primary');
  readonly size = input<ButtonVariants['size']>('md');
  readonly fullWidth = input<ButtonVariants['fullWidth']>(false);
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(
      buttonVariants({
        variant: this.variant(),
        size: this.size(),
        fullWidth: this.fullWidth(),
      }),
      this.uiClass(),
    ),
  );
}
