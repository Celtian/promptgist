import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-spinner',
  imports: [],
  templateUrl: './spinner.html',
  styleUrl: './spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Spinner {}
