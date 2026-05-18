import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { InputOtp, Card } from '@/ui';

@Component({
  selector: 'app-input-otp-page',
  imports: [InputOtp, Card],
  templateUrl: './input-otp-page.html',
  styleUrl: './input-otp-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtpPage {
  protected readonly otpValue = signal('');
  protected readonly customOtpValue = signal('');
}
