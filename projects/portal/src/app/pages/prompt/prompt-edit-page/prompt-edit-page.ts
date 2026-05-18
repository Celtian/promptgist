import { Badge, Button, Card, InputTextarea, InputText, InputToggle, ToastService } from '@/ui';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  required,
  validate,
} from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Prompt, PromptService } from '../../../core/services/prompt.service';

@Component({
  selector: 'app-prompt-edit-page',
  imports: [
    RouterLink,
    FormField,
    FormRoot,
    Button,
    Card,
    Badge,
    InputText,
    InputTextarea,
    InputToggle,
  ],
  templateUrl: './prompt-edit-page.html',
  styleUrl: './prompt-edit-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly promptService = inject(PromptService);
  private readonly toastService = inject(ToastService);

  protected readonly prompt = signal<Prompt | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly formModel = signal({ name: '', content: '', isPublic: false });

  protected readonly promptForm = form(this.formModel, (f) => {
    required(f.name, { message: 'Name is required' });
    minLength(f.name, 3, { message: 'Name must be at least 3 characters' });
    maxLength(f.name, 100, { message: 'Name cannot exceed 100 characters' });

    required(f.content, { message: 'Prompt content is required' });
    validate(f.content, ({ value }) => {
      const text = value() || '';
      if (text.split('\n').length > 200) {
        return { kind: 'maxLines', message: 'Prompt cannot exceed 200 lines' };
      }
      return undefined;
    });
  });

  protected readonly detectedVariables = computed(() => {
    const content = this.formModel().content;
    if (!content) return [];

    const matches = content.match(/\{([a-zA-Z0-9_-]+)\}/g);
    if (!matches) return [];

    return Array.from(new Set(matches.map((m) => m.slice(1, -1))));
  });

  protected readonly lineCount = computed(() => {
    const text = this.formModel().content;
    return text ? text.split('\n').length : 0;
  });

  protected readonly wordCount = computed(() => {
    const text = this.formModel().content;
    return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  });

  protected readonly charCount = computed(() => this.formModel().content.length);

  async ngOnInit(): Promise<void> {
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
        this.prompt.set(data);
        this.formModel.set({ name: data.name, content: data.content, isPublic: data.isPublic });
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

  protected async onSave(event: Event): Promise<void> {
    event.preventDefault();

    this.promptForm.name().markAsTouched();
    this.promptForm.content().markAsTouched();

    if (this.promptForm().invalid()) {
      this.toastService.warning('Please correct validation errors before saving.');
      return;
    }

    const currentId = this.prompt()?.id;
    if (!currentId) return;

    this.isSaving.set(true);
    const { name, content, isPublic } = this.formModel();

    try {
      const { data, error } = await this.promptService.updatePrompt(
        currentId,
        name,
        content,
        isPublic,
      );
      if (error) {
        this.toastService.warning(`Database error: ${error.message}`);
      } else {
        this.toastService.success('Your prompt template was successfully updated!');
        this.router.navigate(['/prompt', data?.id ?? currentId]);
      }
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error ? err.message : 'An unexpected error occurred while saving.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }
}
