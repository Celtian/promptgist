import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-input-select',
  imports: [],
  templateUrl: './input-select.html',
  styleUrl: './input-select.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelect {}
