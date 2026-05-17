import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputText, Card } from '@/ui';

@Component({
  selector: 'app-input-text-page',
  imports: [InputText, Card],
  templateUrl: './input-text-page.html',
  styleUrl: './input-text-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextPage {
  protected readonly textValue = signal('');
}
