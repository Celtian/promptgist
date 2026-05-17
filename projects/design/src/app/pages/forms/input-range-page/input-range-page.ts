import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputRange, Card } from '@/ui';

@Component({
  selector: 'app-input-range-page',
  imports: [InputRange, Card],
  templateUrl: './input-range-page.html',
  styleUrl: './input-range-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRangePage {
  protected readonly rangeValue = signal<number>(50);
}
