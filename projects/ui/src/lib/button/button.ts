import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: '[ui-button]',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {}
