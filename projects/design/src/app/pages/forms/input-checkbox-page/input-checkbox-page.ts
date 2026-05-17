import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputCheckbox, Card } from '@/ui';

@Component({
  selector: 'app-input-checkbox-page',
  imports: [InputCheckbox, Card],
  templateUrl: './input-checkbox-page.html',
  styleUrl: './input-checkbox-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputCheckboxPage {
  protected readonly isChecked = signal(false);
}
