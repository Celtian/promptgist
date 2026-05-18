import { Badge, Button, Card, ToastService } from '@/ui';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidBars,
  faSolidBriefcase,
  faSolidDiagramProject,
  faSolidPenToSquare,
  faSolidPlus,
  faSolidStar,
  faSolidTrash,
  faSolidTriangleExclamation,
} from '@ng-icons/font-awesome/solid';
import { CdkDrag, CdkDropList, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AuthService } from '../../../core/services/auth.service';
import { Workflow, WorkflowService, WorkflowItem } from '../../../core/services/workflow.service';
import { JobService, Job } from '../../../core/services/job.service';

@Component({
  selector: 'app-workflow-detail-page',
  imports: [RouterLink, Button, Card, Badge, NgIcon, CdkDrag, CdkDropList],
  templateUrl: './workflow-detail-page.html',
  styleUrl: './workflow-detail-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      faSolidBars,
      faSolidBriefcase,
      faSolidDiagramProject,
      faSolidPenToSquare,
      faSolidPlus,
      faSolidStar,
      faSolidTrash,
      faSolidTriangleExclamation,
    }),
  ],
})
export class WorkflowDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workflowService = inject(WorkflowService);
  private readonly jobService = inject(JobService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly workflow = signal<Workflow | null>(null);
  protected readonly workflowItems = signal<WorkflowItem[]>([]);
  protected readonly availableJobs = signal<Job[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isLoadingItems = signal(false);
  protected readonly isTogglingStar = signal(false);
  protected readonly isAttachingJob = signal(false);
  protected readonly isReordering = signal(false);
  protected readonly isSelectModalOpen = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  // Filter out jobs that are already in the workflow sequence
  protected readonly unattachedJobs = computed(() => {
    const attachedIds = new Set(this.workflowItems().map((item) => item.jobId));
    return this.availableJobs().filter((job) => !attachedIds.has(job.id));
  });

  async ngOnInit(): Promise<void> {
    await this.authService.ready;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.warning('Workflow ID was not provided in the route.');
      await this.router.navigate(['/workspace/workflow']);
      return;
    }

    await this.fetchWorkflow(id);
    await this.fetchWorkflowItems(id);
    await this.fetchAvailableJobs();
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

  private async fetchWorkflowItems(workflowId: string): Promise<void> {
    this.isLoadingItems.set(true);
    try {
      const { data, error } = await this.workflowService.getWorkflowItems(workflowId);
      if (error) {
        this.toastService.warning(`Failed to load workflow sequence: ${error.message}`);
      } else {
        this.workflowItems.set(data || []);
      }
    } finally {
      this.isLoadingItems.set(false);
    }
  }

  private async fetchAvailableJobs(): Promise<void> {
    try {
      const { data } = await this.jobService.getJobs();
      this.availableJobs.set(data || []);
    } catch (err) {
      console.error('Failed to load available jobs:', err);
    }
  }

  protected async attachJob(jobId: string): Promise<void> {
    const w = this.workflow();
    if (!w) return;

    this.isAttachingJob.set(true);
    const currentItems = this.workflowItems();
    const nextOrder =
      currentItems.length > 0 ? Math.max(...currentItems.map((i) => i.order)) + 1 : 1;

    try {
      const { error } = await this.workflowService.addWorkflowItem(w.id, jobId, nextOrder);
      if (error) {
        this.toastService.warning(`Failed to attach job: ${error.message}`);
      } else {
        this.toastService.success('Job successfully attached to sequence!');
        await this.fetchWorkflowItems(w.id);
        this.isSelectModalOpen.set(false);
      }
    } finally {
      this.isAttachingJob.set(false);
    }
  }

  protected async detachJob(itemId: string): Promise<void> {
    const w = this.workflow();
    if (!w) return;

    try {
      const { error } = await this.workflowService.deleteWorkflowItem(itemId);
      if (error) {
        this.toastService.warning(`Failed to detach job: ${error.message}`);
      } else {
        this.toastService.success('Job detached successfully.');
        await this.fetchWorkflowItems(w.id);
      }
    } catch (err) {
      console.error('Failed to detach job:', err);
    }
  }

  protected async onDrop(event: CdkDragDrop<WorkflowItem[]>): Promise<void> {
    const w = this.workflow();
    if (!w) return;

    const items = [...this.workflowItems()];
    moveItemInArray(items, event.previousIndex, event.currentIndex);

    // Optimistically update frontend sequence orders
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index + 1,
    }));
    this.workflowItems.set(updatedItems);

    this.isReordering.set(true);
    try {
      const orderUpdates = updatedItems.map((item) => ({
        id: item.id,
        order: item.order,
      }));
      const { error } = await this.workflowService.updateWorkflowItemsOrder(orderUpdates);
      if (error) {
        this.toastService.warning(`Failed to save new sequence order: ${error.message}`);
        // Revert to database state
        await this.fetchWorkflowItems(w.id);
      } else {
        this.toastService.success('Job sequence order saved successfully.');
      }
    } finally {
      this.isReordering.set(false);
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
