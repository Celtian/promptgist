import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ProgressSpinner, Card, Button } from '@/ui';

@Component({
  selector: 'app-progress-spinner-page',
  imports: [ProgressSpinner, Card, Button],
  templateUrl: './progress-spinner-page.html',
  styleUrl: './progress-spinner-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinnerPage {
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
