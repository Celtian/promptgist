import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputTextarea, Card } from '@/ui';

@Component({
  selector: 'app-input-textarea-page',
  imports: [InputTextarea, Card],
  templateUrl: './input-textarea-page.html',
  styleUrl: './input-textarea-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputTextareaPage {
  protected readonly textValue = signal('');
}
