import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-input-password',
  imports: [],
  templateUrl: './input-password.html',
  styleUrl: './input-password.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPassword {}
