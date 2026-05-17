import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-modal-content',
  imports: [],
  templateUrl: './modal-content.html',
  styleUrl: './modal-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContent {}
