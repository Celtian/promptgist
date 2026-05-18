import { Button, InputText } from '@/ui';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidBolt, faSolidTriangleExclamation } from '@ng-icons/font-awesome/solid';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [InputText, Button, NgIcon],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ faSolidBolt, faSolidTriangleExclamation })],
  host: {
    class: 'block w-full',
  },
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Component state signals
  protected readonly email = signal('');
  protected readonly otpCode = signal('');
  protected readonly isCodeSent = signal(false);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  /**
   * Handles sending the OTP to the email address
   */
  async onSendCode(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.email().trim()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { error } = await this.auth.sendOtpCode(this.email());
    this.isLoading.set(false);

    if (error) {
      this.errorMessage.set(error.message);
    } else {
      this.isCodeSent.set(true);
    }
  }

  /**
   * Verifies the 6-digit OTP code entered by the user
   */
  async onVerifyCode(event: Event): Promise<void> {
    event.preventDefault();
    if (!this.otpCode().trim()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { error } = await this.auth.verifyOtpCode(this.email(), this.otpCode());
    this.isLoading.set(false);

    if (error) {
      this.errorMessage.set(error.message);
    } else {
      // Login successful! Redirect to dashboard (or root page)
      this.router.navigate(['/']);
    }
  }

  /**
   * Resets page flow to enter email again
   */
  protected onEditEmail(): void {
    this.isCodeSent.set(false);
    this.otpCode.set('');
    this.errorMessage.set(null);
  }
}
