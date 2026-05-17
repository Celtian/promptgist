import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputToggle, Card } from '@/ui';

@Component({
  selector: 'app-input-toggle-page',
  imports: [InputToggle, Card],
  templateUrl: './input-toggle-page.html',
  styleUrl: './input-toggle-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTogglePage {
  protected readonly isChecked = signal(false);
  protected readonly isDisabled = signal(false);
}
