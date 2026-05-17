import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-input-toggle',
  imports: [],
  templateUrl: './input-toggle.html',
  styleUrl: './input-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputToggle {}
