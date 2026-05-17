import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-input-range',
  imports: [],
  templateUrl: './input-range.html',
  styleUrl: './input-range.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRange {}
