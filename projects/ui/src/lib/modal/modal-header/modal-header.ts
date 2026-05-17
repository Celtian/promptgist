import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-modal-header',
  imports: [],
  templateUrl: './modal-header.html',
  styleUrl: './modal-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalHeader {}
