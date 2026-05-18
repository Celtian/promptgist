import { Badge, Button, Card, InputText, InputToggle, ToastService } from '@/ui';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidDiagramProject, faSolidTriangleExclamation } from '@ng-icons/font-awesome/solid';
import { ROUTE_DEFINITION } from '../../../constants/route-definition';
import { Workflow, WorkflowService } from '../../../core/services/workflow.service';

@Component({
  selector: 'app-workflow-edit-page',
  imports: [
    RouterLink,
    FormField,
    FormRoot,
    Button,
    Card,
    Badge,
    InputText,
    InputToggle,
    NgIcon,
    DatePipe,
  ],
  templateUrl: './workflow-edit-page.html',
  styleUrl: './workflow-edit-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ faSolidDiagramProject, faSolidTriangleExclamation })],
})
export class WorkflowEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workflowService = inject(WorkflowService);
  private readonly toastService = inject(ToastService);

  protected readonly workflow = signal<Workflow | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

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

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.warning('Workflow ID was not provided in the route.');
      await this.router.navigate(this.workflowListRoute);
      return;
    }

    await this.fetchWorkflow(id);
  }

  private async fetchWorkflow(id: Workflow['id']): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { data, error } = await this.workflowService.getWorkflow(id);
      if (error) {
        this.errorMessage.set(error.message || 'Workflow could not be loaded.');
        return;
      }

      if (!data) {
        this.errorMessage.set('The requested workflow does not exist.');
        return;
      }

      this.workflow.set(data);
      this.formModel.set({
        name: data.name,
        isPublic: data.isPublic,
      });
    } catch (err: unknown) {
      this.errorMessage.set(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while loading the workflow.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async onSave(event: Event): Promise<void> {
    event.preventDefault();

    this.workflowForm.name().markAsTouched();

    if (this.workflowForm().invalid()) {
      this.toastService.warning('Please correct validation errors before saving.');
      return;
    }

    const currentId = this.workflow()?.id;
    if (!currentId) return;

    this.isSaving.set(true);

    try {
      const { name, isPublic } = this.formModel();
      const { data, error } = await this.workflowService.updateWorkflow(
        currentId,
        name.trim(),
        isPublic,
      );

      if (error) {
        this.toastService.warning(`Database error: ${error.message}`);
        return;
      }

      this.toastService.success('Your workflow was successfully updated!');
      await this.router.navigate([...this.workflowListRoute, data?.id ?? currentId]);
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error ? err.message : 'An unexpected error occurred while saving.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }
}
