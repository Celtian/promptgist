import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../utils/utils';

const modalFooterVariants = cva(
  [
    'flex flex-wrap items-center gap-3 border-t border-[var(--ui-color-border)] bg-[var(--ui-color-surface-muted)] px-6 py-4',
  ],
  {
    variants: {
      align: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
      },
    },
    defaultVariants: {
      align: 'end',
    },
  },
);

type ModalFooterVariants = VariantProps<typeof modalFooterVariants>;

@Component({
  selector: 'ui-modal-footer',
  imports: [],
  templateUrl: './modal-footer.html',
  styleUrl: './modal-footer.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class ModalFooter {
  readonly align = input<ModalFooterVariants['align']>('end');
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(modalFooterVariants({ align: this.align() }), this.uiClass()),
  );
}
