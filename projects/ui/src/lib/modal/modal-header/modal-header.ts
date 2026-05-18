import { Button } from '@/ui';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { cva } from 'class-variance-authority';

import { cn } from '../../utils/utils';

const modalHeaderVariants = cva([
  'flex min-w-0 items-start justify-between gap-4 border-b border-[var(--ui-color-border)] px-6 py-5',
  'bg-[var(--ui-color-surface)]',
]);

@Component({
  selector: 'ui-modal-header',
  imports: [Button],
  templateUrl: './modal-header.html',
  styleUrl: './modal-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class ModalHeader {
  public readonly headerTitle = input<string>();
  public readonly headerSubtitle = input<string>();
  public readonly titleId = input<string>();
  public readonly showClose = input(false, { transform: booleanAttribute });
  public readonly closeLabel = input('Close dialog');
  public readonly closeClick = output<void>();
  public readonly uiClass = input('');

  protected readonly hostClasses = computed(() => cn(modalHeaderVariants(), this.uiClass()));
}
