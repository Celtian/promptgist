import { Badge, Button, Card, InputText, ToastService } from '@/ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Prompt, PromptService } from '../../../core/services/prompt.service';

@Component({
  selector: 'app-prompt-detail-page',
  imports: [RouterLink, Button, Card, InputText, Badge],
  templateUrl: './prompt-detail-page.html',
  styleUrl: './prompt-detail-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly promptService = inject(PromptService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly prompt = signal<Prompt | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isTogglingStar = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly playgroundValues = signal<Record<string, string>>({});
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  protected readonly detectedVariables = computed(() => {
    const content = this.prompt()?.content || '';
    if (!content) return [];

    const matches = content.match(/\{([a-zA-Z0-9_-]+)\}/g);
    if (!matches) return [];

    return Array.from(new Set(matches.map((m) => m.slice(1, -1))));
  });

  protected readonly lineCount = computed(() => {
    const text = this.prompt()?.content || '';
    return text ? text.split('\n').length : 0;
  });

  protected readonly wordCount = computed(() => {
    const text = this.prompt()?.content || '';
    return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  });

  protected readonly charCount = computed(() => {
    const text = this.prompt()?.content || '';
    return text.length;
  });

  protected readonly previewText = computed(() => {
    const rawContent = this.prompt()?.content || '';
    if (!rawContent) return '';

    let rendered = rawContent;
    const values = this.playgroundValues();

    for (const variable of this.detectedVariables()) {
      const value = values[variable] !== undefined ? values[variable] : `{${variable}}`;
      const escapedVariable = variable.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\{${escapedVariable}\\}`, 'g');
      rendered = rendered.replace(regex, value || `{${variable}}`);
    }

    return rendered;
  });

  async ngOnInit(): Promise<void> {
    await this.authService.ready;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.warning('Prompt ID was not provided in the route.');
      this.router.navigate(['/prompt']);
      return;
    }

    const promptId = Number(id);
    if (!Number.isInteger(promptId)) {
      this.toastService.warning('Prompt ID is invalid.');
      this.router.navigate(['/prompt']);
      return;
    }

    await this.fetchPrompt(promptId);
  }

  private async fetchPrompt(id: Prompt['id']): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { data, error } = await this.promptService.getPrompt(id);
      if (error) {
        this.errorMessage.set(error.message || 'Prompt could not be loaded.');
      } else if (data) {
        const { data: isStarred, error: starError } = await this.promptService.isPromptStarred(id);
        if (starError) {
          this.errorMessage.set(starError.message || 'Prompt star state could not be loaded.');
          return;
        }

        this.prompt.set({ ...data, isStarred });
      } else {
        this.errorMessage.set('The requested template does not exist.');
      }
    } catch (err: unknown) {
      this.errorMessage.set(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while loading the template.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected updatePlaygroundValue(variable: string, value: string): void {
    this.playgroundValues.update((prev) => ({
      ...prev,
      [variable]: value,
    }));
  }

  protected async copyToClipboard(): Promise<void> {
    const text = this.previewText();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      this.toastService.success('Interpolated prompt copied to clipboard!');
    } catch {
      this.toastService.warning('Copy failed. Please select and copy manually.');
    }
  }

  protected async toggleStar(): Promise<void> {
    const currentPrompt = this.prompt();
    if (!currentPrompt?.id || !this.isAuthenticated()) return;

    const nextIsStarred = !currentPrompt.isStarred;
    this.isTogglingStar.set(true);
    this.prompt.set({ ...currentPrompt, isStarred: nextIsStarred });

    try {
      const { error } = await this.promptService.setPromptStarred(currentPrompt.id, nextIsStarred);
      if (error) {
        this.prompt.set(currentPrompt);
        this.toastService.warning(error.message || 'Unable to update starred prompt.');
      }
    } finally {
      this.isTogglingStar.set(false);
    }
  }

  protected getCreatorName(uuid: string): string {
    if (!uuid) return 'System';
    if (uuid.includes('@')) return uuid;

    const currentUser = this.authService.user();
    if (currentUser && uuid === currentUser.id) {
      return currentUser.email || 'You';
    }

    if (uuid === 'system') return 'System';
    return `User (${uuid.substring(0, 8)})`;
  }

  protected formatDate(dateStr: string): string {
    if (!dateStr) return 'Recently';

    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Recently';
    }
  }
}
