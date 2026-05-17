import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {}
