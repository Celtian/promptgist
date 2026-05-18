import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Button } from '../../button/button';
import { ModalSize } from '../modal.utils';
import { ModalContent } from '../modal-content/modal-content';
import { ModalContainer } from '../modal-container/modal-container';
import { ModalFooter } from '../modal-footer/modal-footer';
import { ModalHeader } from '../modal-header/modal-header';

export interface ModalAction<R = unknown> {
  label: string;
  result?: R;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link';
}

export interface ModalData<R = unknown> {
  title?: string;
  subtitle?: string;
  content?: string;
  size?: ModalSize;
  closeLabel?: string;
  actions?: readonly ModalAction<R>[];
}

@Component({
  selector: 'ui-modal',
  imports: [Button, ModalContainer, ModalContent, ModalFooter, ModalHeader],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  private readonly dialogRef = inject<DialogRef<unknown, Modal> | null>(DialogRef, {
    optional: true,
  });

  protected readonly data = inject<ModalData | null>(DIALOG_DATA, { optional: true }) ?? {};

  protected close(result?: unknown): void {
    this.dialogRef?.close(result);
  }
}
