import { Badge, Button, Card, ToastService } from '@/ui';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidBriefcase,
  faSolidPenToSquare,
  faSolidPlus,
  faSolidTerminal,
  faSolidTriangleExclamation,
} from '@ng-icons/font-awesome/solid';
import { AuthService } from '../../../core/services/auth.service';
import { Job, JobService } from '../../../core/services/job.service';

@Component({
  selector: 'app-job-detail-page',
  imports: [RouterLink, Button, Card, Badge, NgIcon],
  templateUrl: './job-detail-page.html',
  styleUrl: './job-detail-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      faSolidBriefcase,
      faSolidPenToSquare,
      faSolidPlus,
      faSolidTerminal,
      faSolidTriangleExclamation,
    }),
  ],
})
export class JobDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly jobService = inject(JobService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly job = signal<Job | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  async ngOnInit(): Promise<void> {
    await this.authService.ready;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.warning('Job ID was not provided in the route.');
      await this.router.navigate(['/workspace/job']);
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
    } catch (err: unknown) {
      this.errorMessage.set(
        err instanceof Error ? err.message : 'An unexpected error occurred while loading the job.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected getCreatorName(uuid: string): string {
    if (!uuid) return 'System';

    const currentUser = this.authService.user();
    if (currentUser && uuid === currentUser.id) {
      return currentUser.email || 'You';
    }

    return `User (${uuid.substring(0, 8)})`;
  }

  protected formatDate(dateStr: string): string {
    if (!dateStr) return 'Recently';

    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
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
