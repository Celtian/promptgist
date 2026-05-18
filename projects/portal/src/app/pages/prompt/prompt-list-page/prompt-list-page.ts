import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Card, Badge } from '@/ui';
import { PromptService, Prompt } from '../../../core/services/prompt.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-prompt-list-page',
  imports: [RouterLink, Button, Card, Badge],
  templateUrl: './prompt-list-page.html',
  styleUrl: './prompt-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptListPage implements OnInit {
  private readonly promptService = inject(PromptService);
  private readonly authService = inject(AuthService);

  // Component reactive states
  protected readonly prompts = signal<Prompt[] | null>(null);
  protected readonly isLoading = signal<boolean>(true);
  protected readonly errorMessage = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.fetchPrompts();
  }

  /**
   * Fetches all prompts from Supabase
   */
  protected async fetchPrompts(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { data, error } = await this.promptService.getPrompts();
      if (error) {
        this.errorMessage.set(error.message || 'Unable to retrieve prompts.');
      } else {
        this.prompts.set(data);
      }
    } catch (err: unknown) {
      this.errorMessage.set(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while fetching templates.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Helper to count unique placeholder variables in the prompt template
   */
  protected countVariables(content: string): number {
    if (!content) return 0;
    const matches = content.match(/\{([a-zA-Z0-9_]+)\}/g);
    return matches ? new Set(matches).size : 0;
  }

  /**
   * Helper to format ISO date strings into clean, human-readable format
   */
  protected formatDate(dateStr: string): string {
    if (!dateStr) return 'Recently';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  }

  /**
   * Resolves the author identification value (UUID) into a user-friendly email.
   * If it matches the active authenticated user, shows their email; otherwise, formats beautifully.
   */
  protected getCreatorName(prompt: Prompt): string {
    const createdBy = prompt.createdBy;
    if (!createdBy) return 'Anonymous';

    if (createdBy.includes('@')) {
      return createdBy;
    }

    const currentUser = this.authService.user();
    if (currentUser && createdBy === currentUser.id) {
      return currentUser.email || 'You';
    }

    if (createdBy === 'system') return 'System';
    return `User (${createdBy.substring(0, 8)})`;
  }
}
