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
  faSolidBriefcase,
  faSolidPenToSquare,
  faSolidPlus,
  faSolidTerminal,
  faSolidTriangleExclamation,
  faSolidGripVertical,
  faSolidTrash,
  faSolidMagnifyingGlass,
  faSolidXmark,
} from '@ng-icons/font-awesome/solid';
import {
  CdkDrag,
  CdkDragHandle,
  CdkDropList,
  CdkDragDrop,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Job, JobService, JobItem } from '../../../core/services/job.service';
import { Prompt, PromptService } from '../../../core/services/prompt.service';

@Component({
  selector: 'app-job-detail-page',
  imports: [
    RouterLink,
    Button,
    Card,
    Badge,
    NgIcon,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    FormsModule,
  ],
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
      faSolidGripVertical,
      faSolidTrash,
      faSolidMagnifyingGlass,
      faSolidXmark,
    }),
  ],
})
export class JobDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly jobService = inject(JobService);
  private readonly promptService = inject(PromptService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  protected readonly job = signal<Job | null>(null);
  protected readonly jobItems = signal<JobItem[]>([]);
  protected readonly availablePrompts = signal<Prompt[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly isLoadingItems = signal(false);
  protected readonly isAttachingPrompt = signal(false);
  protected readonly isReordering = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isAuthenticated = this.authService.isAuthenticated;

  // Modal selector state
  protected readonly isSelectModalOpen = signal(false);
  protected readonly searchQuery = signal('');

  // Unattached prompts computed
  protected readonly unattachedPrompts = computed(() => {
    const attachedIds = new Set(this.jobItems().map((item) => item.promptId));
    const query = this.searchQuery().toLowerCase().trim();

    return this.availablePrompts().filter((prompt) => {
      if (attachedIds.has(prompt.id)) return false;
      if (!query) return true;
      return prompt.name.toLowerCase().includes(query);
    });
  });

  async ngOnInit(): Promise<void> {
    await this.authService.ready;

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.toastService.warning('Job ID was not provided in the route.');
      await this.router.navigate(['/workspace/job']);
      return;
    }

    await this.fetchJob(id);
    if (this.job()) {
      await Promise.all([this.fetchJobItems(id), this.fetchAvailablePrompts()]);
    }
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

  private async fetchJobItems(jobId: Job['id']): Promise<void> {
    this.isLoadingItems.set(true);
    try {
      const { data, error } = await this.jobService.getJobItems(jobId);
      if (error) {
        this.toastService.warning(`Failed to fetch job prompts: ${error.message}`);
        return;
      }
      this.jobItems.set(data || []);
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error ? err.message : 'An unexpected error occurred loading prompts.',
      );
    } finally {
      this.isLoadingItems.set(false);
    }
  }

  private async fetchAvailablePrompts(): Promise<void> {
    try {
      const { data, error } = await this.promptService.getPrompts();
      if (error) {
        this.toastService.warning(`Failed to fetch available prompts: ${error.message}`);
        return;
      }
      this.availablePrompts.set(data || []);
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred loading available prompts.',
      );
    }
  }

  protected async attachPrompt(prompt: Prompt): Promise<void> {
    const jobData = this.job();
    if (!jobData) return;

    this.isAttachingPrompt.set(true);
    try {
      const nextOrder = this.jobItems().length + 1;
      const { data, error } = await this.jobService.addJobItem(jobData.id, prompt.id, nextOrder);
      if (error) {
        this.toastService.warning(`Failed to attach prompt: ${error.message}`);
        return;
      }

      if (data) {
        const newItem: JobItem = {
          ...data,
          prompts: {
            id: prompt.id,
            name: prompt.name,
            promptRoleId: prompt.promptRoleId,
            createdAt: prompt.createdAt,
            createdBy: prompt.createdBy,
            updatedAt: prompt.updatedAt,
            updatedBy: prompt.updatedBy,
          },
        };
        this.jobItems.update((items) => [...items, newItem]);
        this.toastService.success(`"${prompt.name}" attached successfully.`);
      }
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error ? err.message : 'An unexpected error occurred attaching the prompt.',
      );
    } finally {
      this.isAttachingPrompt.set(false);
      this.isSelectModalOpen.set(false);
      this.searchQuery.set('');
    }
  }

  protected async detachPrompt(itemId: string, name: string): Promise<void> {
    try {
      const { error } = await this.jobService.deleteJobItem(itemId);
      if (error) {
        this.toastService.warning(`Failed to detach prompt: ${error.message}`);
        return;
      }

      this.jobItems.update((items) => items.filter((item) => item.id !== itemId));
      this.toastService.success(`"${name}" detached successfully.`);

      // Re-order remaining locally and persist
      const updatedItems = this.jobItems().map((item, idx) => ({
        ...item,
        order: idx + 1,
      }));
      this.jobItems.set(updatedItems);
      await this.jobService.updateJobItemsOrder(
        updatedItems.map((item) => ({ id: item.id, order: item.order })),
      );
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error ? err.message : 'An unexpected error occurred detaching the prompt.',
      );
    }
  }

  protected async onDrop(event: CdkDragDrop<JobItem[]>): Promise<void> {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    if (previousIndex === currentIndex) return;

    // Locally move
    const items = [...this.jobItems()];
    moveItemInArray(items, previousIndex, currentIndex);

    // Reassign order properties (1-based index)
    const updatedItems = items.map((item, idx) => ({
      ...item,
      order: idx + 1,
    }));

    this.jobItems.set(updatedItems);
    this.isReordering.set(true);

    try {
      const { error } = await this.jobService.updateJobItemsOrder(
        updatedItems.map((item) => ({ id: item.id, order: item.order })),
      );
      if (error) {
        this.toastService.warning(`Failed to save reorder: ${error.message}`);
      } else {
        this.toastService.success('Prompt sequence reordered.');
      }
    } catch (err: unknown) {
      this.toastService.warning(
        err instanceof Error ? err.message : 'An unexpected error occurred saving prompt order.',
      );
    } finally {
      this.isReordering.set(false);
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
