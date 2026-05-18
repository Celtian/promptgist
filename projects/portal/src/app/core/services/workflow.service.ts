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
}

function mapWorkflow(row: WorkflowRow): Workflow {
  return {
    ...row,
    isStarred: false,
  };
}
