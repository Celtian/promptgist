import { Button, Card } from '@/ui';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidBriefcase,
  faSolidPenToSquare,
  faSolidPlus,
  faSolidTriangleExclamation,
} from '@ng-icons/font-awesome/solid';
import { AuthService } from '../../../core/services/auth.service';
import { Job, JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-job-list-page',
  imports: [RouterLink, Button, Card, NgIcon],
  templateUrl: './job-list-page.html',
  styleUrl: './job-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      faSolidBriefcase,
      faSolidPenToSquare,
      faSolidPlus,
      faSolidTriangleExclamation,
    }),
  ],
})
export class JobListPage implements OnInit {
  private readonly jobService = inject(JobService);
  private readonly authService = inject(AuthService);

  protected readonly jobs = signal<Job[] | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.authService.ready;
    await this.fetchJobs();
  }

  protected async fetchJobs(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { data, error } = await this.jobService.getJobs();
      if (error) {
        this.errorMessage.set(error.message || 'Unable to retrieve jobs.');
        return;
      }

      this.jobs.set(data || []);
    } catch (err: unknown) {
      this.errorMessage.set(
        err instanceof Error ? err.message : 'An unexpected error occurred while fetching jobs.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected getJobName(job: Job): string {
    return job.name?.trim() || 'Untitled job';
  }

  protected getCreatorName(job: Job): string {
    const createdBy = job.createdBy;
    if (!createdBy) return 'Anonymous';

    const currentUser = this.authService.user();
    if (currentUser && createdBy === currentUser.id) {
      return currentUser.email || 'You';
    }

    return `User (${createdBy.substring(0, 8)})`;
  }

  protected formatDate(dateStr: string): string {
    if (!dateStr) return 'Recently';

    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  }
}
