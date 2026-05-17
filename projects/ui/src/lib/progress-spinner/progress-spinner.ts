import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-progress-spinner',
  imports: [],
  templateUrl: './progress-spinner.html',
  styleUrl: './progress-spinner.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinner {}
