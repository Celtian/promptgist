import { Badge, Button, Card, InputText, InputToggle, ToastService } from '@/ui';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidDiagramProject } from '@ng-icons/font-awesome/solid';
import { ROUTE_DEFINITION } from '../../../constants/route-definition';
import { WorkflowService } from '../../../core/services/workflow.service';

@Component({
  selector: 'app-workflow-create-page',
  imports: [RouterLink, FormField, FormRoot, Button, Card, Badge, InputText, InputToggle, NgIcon],
  templateUrl: './workflow-create-page.html',
  styleUrl: './workflow-create-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ faSolidDiagramProject })],
})
export class WorkflowCreatePage {
  private readonly workflowService = inject(WorkflowService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly isSaving = signal(false);

  protected readonly formModel = signal({
    name: '',
    isPublic: false,
  });

  protected readonly workflowForm = form(this.formModel, (f) => {
    required(f.name, { message: 'Workflow name is required' });
    minLength(f.name, 3, { message: 'Name must be at least 3 characters' });
    maxLength(f.name, 100, { message: 'Name cannot exceed 100 characters' });
  });

  private readonly workflowListRoute = [
    '/',
    ROUTE_DEFINITION.APP.WORKSPACE,
    ROUTE_DEFINITION.WORKSPACE.WORKFLOW,
  ];

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    this.workflowForm.name().markAsTouched();

    if (this.workflowForm().invalid()) {
      this.toastService.warning('Please resolve the validation errors before saving.');
      return;
    }

    this.isSaving.set(true);

    try {
      const { name, isPublic } = this.formModel();
      const { data, error } = await this.workflowService.createWorkflow(name.trim(), isPublic);

      if (error) {
        this.toastService.warning(`Database error: ${error.message || 'Could not save workflow.'}`);
        return;
      }

      this.toastService.success('Your new workflow has been created successfully!');
      await this.router.navigate(
        data?.id ? [...this.workflowListRoute, data.id] : this.workflowListRoute,
      );
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error ? err.message : 'An unexpected error occurred while saving.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }
}
