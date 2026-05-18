import { Badge, Button, Card, InputText, ToastService } from '@/ui';
import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormField, FormRoot, form, maxLength, minLength, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { faSolidBriefcase, faSolidTriangleExclamation } from '@ng-icons/font-awesome/solid';
import { ROUTE_DEFINITION } from '../../../constants/route-definition';
import { Job, JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-job-edit-page',
  imports: [RouterLink, FormField, FormRoot, Button, Card, Badge, InputText, NgIcon, DatePipe],
  templateUrl: './job-edit-page.html',
  styleUrl: './job-edit-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ faSolidBriefcase, faSolidTriangleExclamation })],
})
export class JobEditPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly jobService = inject(JobService);
  private readonly toastService = inject(ToastService);

  protected readonly job = signal<Job | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

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

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.warning('Job ID was not provided in the route.');
      await this.router.navigate(this.jobListRoute);
      return;
    }

    await this.fetchJob(id);
  }

  private async fetchJob(id: Job['id']): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { data, error } = await this.jobService.getJob(id);
      if (error) {
        this.errorMessage.set(error.message || 'Job could not be loaded.');
        return;
      }

      if (!data) {
        this.errorMessage.set('The requested job does not exist.');
        return;
      }

      this.job.set(data);
      this.formModel.set({
        name: data.name || '',
      });
    } catch (err: unknown) {
      this.errorMessage.set(
        err instanceof Error ? err.message : 'An unexpected error occurred while loading the job.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async onSave(event: Event): Promise<void> {
    event.preventDefault();

    this.jobForm.name().markAsTouched();

    if (this.jobForm().invalid()) {
      this.toastService.warning('Please correct validation errors before saving.');
      return;
    }

    const currentId = this.job()?.id;
    if (!currentId) return;

    this.isSaving.set(true);

    try {
      const { name } = this.formModel();
      const { data, error } = await this.jobService.updateJob(currentId, name.trim());

      if (error) {
        this.toastService.warning(`Database error: ${error.message}`);
        return;
      }

      this.toastService.success('Your job was successfully updated!');
      await this.router.navigate([...this.jobListRoute, data?.id ?? currentId]);
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error ? err.message : 'An unexpected error occurred while saving.',
      );
    } finally {
      this.isSaving.set(false);
    }
  }
}
