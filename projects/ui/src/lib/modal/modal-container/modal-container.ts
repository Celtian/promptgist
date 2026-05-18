import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cva } from 'class-variance-authority';

import { cn } from '../../utils/utils';

const modalContainerVariants = cva([
  'relative z-50 grid max-h-[calc(100dvh-2rem)] min-w-0 overflow-hidden rounded-lg border',
  'border-[var(--ui-modal-border,var(--ui-color-border))]',
  'bg-[var(--ui-modal-background,var(--ui-color-surface))]',
  'text-[var(--ui-modal-color,var(--ui-color-text))]',
  'shadow-[0_24px_80px_color-mix(in_srgb,var(--ui-color-secondary-950)_18%,transparent)]',
]);

@Component({
  selector: 'ui-modal-container',
  imports: [],
  templateUrl: './modal-container.html',
  styleUrl: './modal-container.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class ModalContainer {
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() => cn(modalContainerVariants(), this.uiClass()));
}
