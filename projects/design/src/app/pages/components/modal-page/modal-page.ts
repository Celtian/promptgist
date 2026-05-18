import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Button, Card, InputSelect, InputSelectOption, ModalService, ModalSize } from '@/ui';

@Component({
  selector: 'app-modal-page',
  imports: [Button, Card, InputSelect],
  templateUrl: './modal-page.html',
  styleUrl: './modal-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalPage {
  private readonly modal = inject(ModalService);

  protected readonly size = signal<ModalSize>('md');

  protected readonly sizeOptions: InputSelectOption[] = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra large' },
  ];

  protected setSize(value: string | null): void {
    if (this.isModalSize(value)) {
      this.size.set(value);
    }
  }

  protected openModal(): void {
    this.modal.open<boolean>({
      title: 'Publish prompt collection',
      subtitle: 'Review the generated metadata before sharing this collection.',
      content:
        'This modal is opened through ModalService and rendered with ui-modal-container, ui-modal-header, ui-modal-content, and ui-modal-footer.',
      size: this.size(),
      actions: [
        { label: 'Cancel', variant: 'outline', result: false },
        { label: 'Publish', result: true },
      ],
    });
  }

  private isModalSize(value: string | null): value is ModalSize {
    return ['sm', 'md', 'lg', 'xl'].includes(value ?? '');
  }
}
