import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  form,
  required,
  minLength,
  maxLength,
  validate,
  FormField,
  FormRoot,
} from '@angular/forms/signals';
import { Button, Card, Badge, InputText, InputTextarea } from '@/ui';
import { PromptService } from '../../../core/services/prompt.service';
import { ToastService } from '@/ui';

@Component({
  selector: 'app-prompt-create-page',
  imports: [RouterLink, FormField, FormRoot, Button, Card, Badge, InputText, InputTextarea],
  templateUrl: './prompt-create-page.html',
  styleUrl: './prompt-create-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromptCreatePage {
  private readonly promptService = inject(PromptService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  // loading state signal for save operation
  protected readonly isSaving = signal(false);

  // Model signal backing our prompt form
  private readonly formModel = signal({
    name: '',
    content: '',
  });

  // Signal forms schema & configuration
  protected readonly promptForm = form(this.formModel, (f) => {
    // Name validations (3-100 characters)
    required(f.name, { message: 'Prompt name is required' });
    minLength(f.name, 3, { message: 'Name must be at least 3 characters' });
    maxLength(f.name, 100, { message: 'Name cannot exceed 100 characters' });

    // Content validations (Required, max 200 lines)
    required(f.content, { message: 'Prompt content is required' });
    validate(f.content, ({ value }) => {
      const text = value() || '';
      const lines = text.split('\n').length;
      if (lines > 200) {
        return { kind: 'maxLines', message: 'Content cannot exceed 200 lines' };
      }
      return undefined;
    });
  });

  // Derived indicators for word, line, and character count
  protected readonly lineCount = computed(() => {
    const text = this.formModel().content || '';
    return text === '' ? 0 : text.split('\n').length;
  });

  protected readonly charCount = computed(() => {
    return (this.formModel().content || '').length;
  });

  protected readonly wordCount = computed(() => {
    const text = (this.formModel().content || '').trim();
    return text === '' ? 0 : text.split(/\s+/).length;
  });

  // Detected template variables inside the text matching {variable_name}
  protected readonly detectedVariables = computed(() => {
    const text = this.formModel().content || '';
    const matches = [...text.matchAll(/\{([a-zA-Z0-9_-]+)\}/g)];
    return [...new Set(matches.map((m) => m[1]))];
  });

  /**
   * Save the prompt template to database.
   */
  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    // Mark all fields as touched to trigger validation messages in the template
    this.promptForm.name().markAsTouched();
    this.promptForm.content().markAsTouched();

    if (this.promptForm().invalid()) {
      this.toastService.warning('Please resolve the validation errors before saving.');
      return;
    }

    this.isSaving.set(true);

    try {
      const { name, content } = this.formModel();
      const { error } = await this.promptService.createPrompt(name, content);

      if (error) {
        console.error('Failed to create prompt:', error);
        this.toastService.warning(`Database error: ${error.message || 'Could not save prompt.'}`);
      } else {
        this.toastService.success('Your new prompt template has been created successfully!');
        this.router.navigate(['/prompt']);
      }
    } catch (err: unknown) {
      console.error('Unexpected error while creating prompt:', err);
      this.toastService.warning('An unexpected error occurred while saving the prompt.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
