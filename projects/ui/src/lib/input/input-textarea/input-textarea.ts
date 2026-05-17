import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-input-textarea',
  imports: [],
  templateUrl: './input-textarea.html',
  styleUrl: './input-textarea.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextarea {}
