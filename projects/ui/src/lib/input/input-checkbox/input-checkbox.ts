import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-input-checkbox',
  imports: [],
  templateUrl: './input-checkbox.html',
  styleUrl: './input-checkbox.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCheckbox {}
