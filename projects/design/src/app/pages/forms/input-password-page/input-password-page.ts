import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputPassword, Card } from '@/ui';

@Component({
  selector: 'app-input-password-page',
  imports: [InputPassword, Card],
  templateUrl: './input-password-page.html',
  styleUrl: './input-password-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputPasswordPage {
  protected readonly passwordValue = signal('');
}
