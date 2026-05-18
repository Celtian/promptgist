import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/utils';

const modalContentVariants = cva(
  [
    'min-h-0 overflow-auto text-sm leading-6 text-[var(--ui-color-text-muted)]',
    '[&_p]:m-0 [&_strong]:text-[var(--ui-color-text)]',
  ],
  {
    variants: {
      padding: {
        none: 'p-0',
        sm: 'px-4 py-3',
        md: 'px-6 py-5',
        lg: 'px-8 py-6',
      },
    },
    defaultVariants: {
      padding: 'md',
    },
  },
);

type ModalContentVariants = VariantProps<typeof modalContentVariants>;

@Component({
  selector: 'ui-modal-content',
  imports: [],
  templateUrl: './modal-content.html',
  styleUrl: './modal-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class ModalContent {
  readonly padding = input<ModalContentVariants['padding']>('md');
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(modalContentVariants({ padding: this.padding() }), this.uiClass()),
  );
}
