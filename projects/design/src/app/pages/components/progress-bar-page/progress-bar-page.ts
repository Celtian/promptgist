import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ProgressBar, Card, Button } from '@/ui';

@Component({
  selector: 'app-progress-bar-page',
  imports: [ProgressBar, Card, Button],
  templateUrl: './progress-bar-page.html',
  styleUrl: './progress-bar-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarPage {
  protected readonly value = signal(40);
  protected readonly max = signal(100);
  protected readonly indeterminate = signal(false);

  protected toggleIndeterminate() {
    this.indeterminate.set(!this.indeterminate());
  }

  protected increase() {
    this.value.update((v) => Math.min(this.max(), v + 15));
  }

  protected decrease() {
    this.value.update((v) => Math.max(0, v - 15));
  }
}
