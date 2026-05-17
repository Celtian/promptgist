import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-progress-bar',
  imports: [],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBar {}
