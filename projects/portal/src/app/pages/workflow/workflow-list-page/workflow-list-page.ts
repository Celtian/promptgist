import { Badge, Button, Card } from '@/ui';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidDiagramProject,
  faSolidPenToSquare,
  faSolidPlus,
  faSolidStar,
  faSolidTriangleExclamation,
} from '@ng-icons/font-awesome/solid';
import { AuthService } from '../../../core/services/auth.service';
import { Workflow, WorkflowService } from '../../../core/services/workflow.service';

@Component({
  selector: 'app-workflow-list-page',
  imports: [RouterLink, Button, Card, Badge, NgIcon],
  templateUrl: './workflow-list-page.html',
  styleUrl: './workflow-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      faSolidDiagramProject,
      faSolidPenToSquare,
      faSolidPlus,
      faSolidStar,
      faSolidTriangleExclamation,
    }),
  ],
})
export class WorkflowListPage implements OnInit {
  private readonly workflowService = inject(WorkflowService);
  private readonly authService = inject(AuthService);

  protected readonly workflows = signal<Workflow[] | null>(null);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isTogglingStar = signal<Record<string, boolean>>({});
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  async ngOnInit(): Promise<void> {
    await this.authService.ready;
    await this.fetchWorkflows();
  }

  protected async fetchWorkflows(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { data, error } = await this.workflowService.getWorkflows();
      if (error) {
        this.errorMessage.set(error.message || 'Unable to retrieve workflows.');
        return;
      }

      const workflows = data || [];
      const workflowIds = workflows
        .map((workflow) => workflow.id)
        .filter((id): id is NonNullable<Workflow['id']> => Boolean(id));
      const { data: starredWorkflowIds, error: starredError } =
        await this.workflowService.getStarredWorkflowIds(workflowIds);

      if (starredError) {
        this.errorMessage.set(starredError.message || 'Unable to retrieve starred workflows.');
        return;
      }

      this.workflows.set(
        workflows.map((workflow) => ({
          ...workflow,
          isStarred: starredWorkflowIds.has(workflow.id),
        })),
      );
    } catch (err: unknown) {
      this.errorMessage.set(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while fetching workflows.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async toggleStar(workflow: Workflow): Promise<void> {
    const workflowId = workflow.id;
    if (!workflowId || !this.isAuthenticated()) return;

    const nextIsStarred = !workflow.isStarred;
    this.isTogglingStar.update((state) => ({ ...state, [workflowId]: true }));
    this.workflows.update(
      (workflows) =>
        workflows?.map((item) =>
          item.id === workflowId ? { ...item, isStarred: nextIsStarred } : item,
        ) ?? null,
    );

    try {
      const { error } = await this.workflowService.setWorkflowStarred(workflowId, nextIsStarred);
      if (error) {
        this.workflows.update(
          (workflows) =>
            workflows?.map((item) =>
              item.id === workflowId ? { ...item, isStarred: workflow.isStarred } : item,
            ) ?? null,
        );
        this.errorMessage.set(error.message || 'Unable to update starred workflow.');
      }
    } finally {
      this.isTogglingStar.update((state) => ({ ...state, [workflowId]: false }));
    }
  }

  protected getCreatorName(workflow: Workflow): string {
    const createdBy = workflow.createdBy;
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
