import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UpperCasePipe, SlicePipe } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Card, Badge, Button } from '@/ui';

@Component({
  selector: 'app-account',
  imports: [Card, Badge, Button, UpperCasePipe, SlicePipe],
  templateUrl: './account.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class AccountPage {
  protected readonly auth = inject(AuthService);

  // Clipboard copy state
  protected readonly isCopied = signal(false);

  // Computed initials for the profile avatar
  protected readonly userInitials = computed(() => {
    const email = this.auth.user()?.email ?? '';
    if (!email) return 'U';
    return email.slice(0, 2).toUpperCase();
  });

  // Access user metadata as string representation
  protected readonly userMetadataJson = computed(() => {
    const meta = this.auth.user()?.user_metadata;
    return meta && Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : null;
  });

  // Access app metadata as string representation
  protected readonly appMetadataJson = computed(() => {
    const meta = this.auth.user()?.app_metadata;
    return meta && Object.keys(meta).length > 0 ? JSON.stringify(meta, null, 2) : null;
  });

  /**
   * Helper to format ISO timestamps into user-friendly localized dates
   */
  protected formatDate(isoString: string | undefined): string {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  /**
   * Copies the raw User UUID to clipboard with feedback timeout
   */
  protected copyUserId(uuid: string): void {
    if (!uuid) return;
    navigator.clipboard.writeText(uuid).then(() => {
      this.isCopied.set(true);
      setTimeout(() => this.isCopied.set(false), 2000);
    });
  }
}
