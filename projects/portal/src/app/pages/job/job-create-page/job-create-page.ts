import { Badge, Button, Card, InputText, ToastService } from '@/ui';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidBriefcase } from '@ng-icons/font-awesome/solid';
import { ROUTE_DEFINITION } from '../../../constants/route-definition';
import { JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-job-create-page',
  imports: [RouterLink, FormField, FormRoot, Button, Card, Badge, InputText, NgIcon],
  templateUrl: './job-create-page.html',
  styleUrl: './job-create-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ faSolidBriefcase })],
})
export class JobCreatePage {
  private readonly jobService = inject(JobService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly isSaving = signal(false);

  protected readonly formModel = signal({
    name: '',
  });

  protected readonly jobForm = form(this.formModel, (f) => {
    required(f.name, { message: 'Job name is required' });
    minLength(f.name, 3, { message: 'Name must be at least 3 characters' });
    maxLength(f.name, 100, { message: 'Name cannot exceed 100 characters' });
  });

  private readonly jobListRoute = [
    '/',
    ROUTE_DEFINITION.APP.WORKSPACE,
    ROUTE_DEFINITION.WORKSPACE.JOB,
  ];

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    this.jobForm.name().markAsTouched();

    if (this.jobForm().invalid()) {
      this.toastService.warning('Please resolve the validation errors before saving.');
      return;
    }

    this.isSaving.set(true);

    try {
      const { name } = this.formModel();
      const { data, error } = await this.jobService.createJob(name.trim());

      if (error) {
        this.toastService.warning(`Database error: ${error.message || 'Could not save job.'}`);
        return;
      }

      this.toastService.success('Your new job has been created successfully!');
      await this.router.navigate(data?.id ? [...this.jobListRoute, data.id] : this.jobListRoute);
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error ? err.message : 'An unexpected error occurred while saving.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }
}
