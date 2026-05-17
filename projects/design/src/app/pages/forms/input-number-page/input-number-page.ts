import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputNumber, Card } from '@/ui';

@Component({
  selector: 'app-input-number-page',
  imports: [InputNumber, Card],
  templateUrl: './input-number-page.html',
  styleUrl: './input-number-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputNumberPage {
  protected readonly numberValue = signal<number | null>(42);
}
