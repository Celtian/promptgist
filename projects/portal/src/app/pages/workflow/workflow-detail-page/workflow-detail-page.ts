import { Badge, Button, Card, ToastService } from '@/ui';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidBriefcase,
  faSolidDiagramProject,
  faSolidPenToSquare,
  faSolidPlus,
  faSolidStar,
  faSolidTriangleExclamation,
} from '@ng-icons/font-awesome/solid';
import { AuthService } from '../../../core/services/auth.service';
import { Workflow, WorkflowService } from '../../../core/services/workflow.service';

@Component({
  selector: 'app-workflow-detail-page',
  imports: [RouterLink, Button, Card, Badge, NgIcon],
  templateUrl: './workflow-detail-page.html',
  styleUrl: './workflow-detail-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      faSolidBriefcase,
      faSolidDiagramProject,
      faSolidPenToSquare,
      faSolidPlus,
      faSolidStar,
      faSolidTriangleExclamation,
    }),
  ],
})
export class WorkflowDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workflowService = inject(WorkflowService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly workflow = signal<Workflow | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly isTogglingStar = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  async ngOnInit(): Promise<void> {
    await this.authService.ready;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.warning('Workflow ID was not provided in the route.');
      await this.router.navigate(['/workspace/workflow']);
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

      const { data: isStarred, error: starError } =
        await this.workflowService.isWorkflowStarred(id);
      if (starError) {
        this.errorMessage.set(starError.message || 'Workflow star state could not be loaded.');
        return;
      }

      this.workflow.set({ ...data, isStarred });
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

  protected async toggleStar(): Promise<void> {
    const currentWorkflow = this.workflow();
    if (!currentWorkflow?.id || !this.isAuthenticated()) return;

    const nextIsStarred = !currentWorkflow.isStarred;
    this.isTogglingStar.set(true);
    this.workflow.set({ ...currentWorkflow, isStarred: nextIsStarred });

    try {
      const { error } = await this.workflowService.setWorkflowStarred(
        currentWorkflow.id,
        nextIsStarred,
      );
      if (error) {
        this.workflow.set(currentWorkflow);
        this.toastService.warning(error.message || 'Unable to update starred workflow.');
      }
    } finally {
      this.isTogglingStar.set(false);
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
