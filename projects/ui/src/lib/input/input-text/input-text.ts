import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-input-text',
  imports: [],
  templateUrl: './input-text.html',
  styleUrl: './input-text.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputText {}
