import { Injectable, inject } from '@angular/core';
import { Tables, TablesInsert, TablesUpdate } from '../supabase/database.types';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

type WorkflowRow = Tables<'workflows'>;
type WorkflowInsert = TablesInsert<'workflows'>;
type WorkflowUpdate = TablesUpdate<'workflows'>;
type WorkflowStarInsert = TablesInsert<'workflowStars'>;
type WorkflowId = WorkflowRow['id'];

export type Workflow = WorkflowRow & {
  isStarred: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly auth = inject(AuthService);

  async createWorkflow(
    name: string,
    isPublic = false,
  ): Promise<{ data: Workflow | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to create a workflow.') };
    }

    const now = new Date().toISOString();
    const workflowData: WorkflowInsert = {
      name,
      isPublic,
      createdBy: user.id,
      createdAt: now,
      updatedBy: user.id,
      updatedAt: now,
    };

    const { data, error } = await this.supabase
      .from('workflows')
      .insert(workflowData)
      .select()
      .single();

    return { data: data ? mapWorkflow(data) : null, error };
  }

  async getWorkflows(): Promise<{ data: Workflow[] | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase
      .from('workflows')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      return { data: null, error };
    }

    return { data: (data || []).map(mapWorkflow), error: null };
  }

  async getWorkflow(
    id: WorkflowId,
  ): Promise<{ data: Workflow | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase.from('workflows').select('*').eq('id', id).single();

    return { data: data ? mapWorkflow(data) : null, error };
  }

  async updateWorkflow(
    id: WorkflowId,
    name: string,
    isPublic: boolean,
  ): Promise<{ data: Workflow | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to update a workflow.') };
    }

    const workflowData: WorkflowUpdate = {
      name,
      isPublic,
      updatedBy: user.id,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('workflows')
      .update(workflowData)
      .eq('id', id)
      .select()
      .single();

    return { data: data ? mapWorkflow(data) : null, error };
  }

  async deleteWorkflow(id: WorkflowId): Promise<{ error: { message: string } | null }> {
    const { error } = await this.supabase.from('workflows').delete().eq('id', id);
    return { error };
  }

  async getStarredWorkflowIds(
    workflowIds: readonly WorkflowId[],
  ): Promise<{ data: Set<string>; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user || workflowIds.length === 0) {
      return { data: new Set<string>(), error: null };
    }

    const { data, error } = await this.supabase
      .from('workflowStars')
      .select('workflowId')
      .eq('userId', user.id)
      .in('workflowId', workflowIds);

    if (error) {
      return { data: new Set<string>(), error };
    }

    return { data: new Set((data || []).map((row) => row.workflowId)), error: null };
  }

  async isWorkflowStarred(
    workflowId: WorkflowId,
  ): Promise<{ data: boolean; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: false, error: null };
    }

    const { data, error } = await this.supabase
      .from('workflowStars')
      .select('workflowId')
      .eq('workflowId', workflowId)
      .eq('userId', user.id)
      .maybeSingle();

    return { data: Boolean(data), error };
  }

  async setWorkflowStarred(
    workflowId: WorkflowId,
    isStarred: boolean,
  ): Promise<{ error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { error: new Error('User must be authenticated to star a workflow.') };
    }

    if (isStarred) {
      const now = new Date().toISOString();
      const starData: WorkflowStarInsert = {
        workflowId,
        userId: user.id,
        createdAt: now,
        updatedAt: now,
      };

      const { error } = await this.supabase
        .from('workflowStars')
        .upsert(starData, { onConflict: 'workflowId,userId' });

      return { error };
    }

    const { error } = await this.supabase
      .from('workflowStars')
      .delete()
      .eq('workflowId', workflowId)
      .eq('userId', user.id);

    return { error };
  }

  async getWorkflowItems(
    workflowId: WorkflowId,
  ): Promise<{ data: WorkflowItem[] | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase
      .from('workflowItems')
      .select('*, jobs(*)')
      .eq('workflowId', workflowId)
      .order('order', { ascending: true });

    return { data: data as WorkflowItem[] | null, error };
  }

  async addWorkflowItem(
    workflowId: WorkflowId,
    jobId: string,
    order: number,
  ): Promise<{ data: Tables<'workflowItems'> | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to add a job.') };
    }

    const now = new Date().toISOString();
    const itemData: TablesInsert<'workflowItems'> = {
      workflowId,
      jobId,
      order,
      createdBy: user.id,
      createdAt: now,
      updatedBy: user.id,
      updatedAt: now,
    };

    const { data, error } = await this.supabase
      .from('workflowItems')
      .insert(itemData)
      .select()
      .single();

    return { data, error };
  }

  async updateWorkflowItemsOrder(
    items: { id: string; order: number }[],
  ): Promise<{ error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { error: new Error('User must be authenticated to update order.') };
    }

    const now = new Date().toISOString();
    const promises = items.map((item) =>
      this.supabase
        .from('workflowItems')
        .update({
          order: item.order,
          updatedBy: user.id,
          updatedAt: now,
        })
        .eq('id', item.id),
    );

    const results = await Promise.all(promises);
    const firstError = results.find((r) => r.error)?.error;

    return { error: firstError || null };
  }

  async deleteWorkflowItem(itemId: string): Promise<{ error: { message: string } | null }> {
    const { error } = await this.supabase.from('workflowItems').delete().eq('id', itemId);
    return { error };
  }
}

export type WorkflowItem = Tables<'workflowItems'> & {
  jobs: Tables<'jobs'> | null;
};

function mapWorkflow(row: WorkflowRow): Workflow {
  return {
    ...row,
    isStarred: false,
  };
}
