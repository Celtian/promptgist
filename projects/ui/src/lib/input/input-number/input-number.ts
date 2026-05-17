import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-input-number',
  imports: [],
  templateUrl: './input-number.html',
  styleUrl: './input-number.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumber {}
