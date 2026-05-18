import { Injectable, inject } from '@angular/core';
import { Tables, TablesInsert, TablesUpdate } from '../supabase/database.types';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

type PromptRow = Tables<'prompts'>;
type PromptRoleRow = Tables<'promptRoles'>;
type PromptInsert = TablesInsert<'prompts'>;
type PromptUpdate = TablesUpdate<'prompts'>;
type PromptRoleInsert = TablesInsert<'promptRoles'>;
type PromptRoleUpdate = TablesUpdate<'promptRoles'>;
type PromptId = PromptRow['id'];
type PromptWithRoleRow = PromptRow & {
  promptRoles: Pick<PromptRoleRow, 'content'> | null;
};

export type Prompt = PromptRow & {
  content: string;
  isPublic: boolean;
  isStarred: boolean;
  editedAt: string;
  editedBy: string;
};

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly auth = inject(AuthService);

  // Keep track of session state in-memory since the db table doesn't persist stars or public flags
  private readonly starredPromptIds = new Set<string>();
  private readonly publicPromptIds = new Set<string>();

  async createPrompt(
    name: string,
    content: string,
    isPublic: boolean,
  ): Promise<{ data: Prompt | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to create a prompt.') };
    }

    const userId = user.id;
    const now = new Date().toISOString();

    const roleData: PromptRoleInsert = {
      name,
      content,
      createdBy: userId,
      createdAt: now,
      updatedBy: userId,
      updatedAt: now,
    };

    const { data: role, error: roleError } = await this.supabase
      .from('promptRoles')
      .insert(roleData)
      .select()
      .single();

    if (roleError) {
      return { data: null, error: roleError };
    }

    const promptData: PromptInsert = {
      name,
      promptRoleId: role.id,
      createdBy: userId,
      createdAt: now,
      updatedBy: userId,
      updatedAt: now,
    };

    const { data, error } = await this.supabase
      .from('prompts')
      .insert(promptData)
      .select('*, promptRoles(content)')
      .single();

    if (error) {
      return { data: null, error };
    }

    if (data) {
      if (isPublic) {
        this.publicPromptIds.add(data.id);
      }
      return { data: this.mapPromptWithState(data as PromptWithRoleRow), error: null };
    }

    return { data: null, error: null };
  }

  async getStarredPromptIds(
    promptIds: readonly PromptId[],
  ): Promise<{ data: Set<string>; error: { message: string } | null }> {
    const activeStarred = new Set<string>();
    for (const id of promptIds) {
      if (this.starredPromptIds.has(id)) {
        activeStarred.add(id);
      }
    }
    return { data: activeStarred, error: null };
  }

  async isPromptStarred(
    promptId: PromptId,
  ): Promise<{ data: boolean; error: { message: string } | null }> {
    return { data: this.starredPromptIds.has(promptId), error: null };
  }

  async setPromptStarred(
    promptId: PromptId,
    isStarred: boolean,
  ): Promise<{ error: { message: string } | null }> {
    if (isStarred) {
      this.starredPromptIds.add(promptId);
    } else {
      this.starredPromptIds.delete(promptId);
    }
    return { error: null };
  }

  async getPrompts(): Promise<{ data: Prompt[] | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*, promptRoles(content)')
      .order('createdAt', { ascending: false });

    if (error) {
      return { data: null, error };
    }

    return {
      data: ((data || []) as PromptWithRoleRow[]).map((row) => this.mapPromptWithState(row)),
      error: null,
    };
  }

  async getPrompt(
    id: PromptId,
  ): Promise<{ data: Prompt | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*, promptRoles(content)')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error };
    }

    return {
      data: data ? this.mapPromptWithState(data as PromptWithRoleRow) : null,
      error: null,
    };
  }

  async updatePrompt(
    id: PromptId,
    name: string,
    content: string,
    isPublic: boolean,
  ): Promise<{ data: Prompt | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to update a prompt.') };
    }

    const existing = await this.getPrompt(id);
    if (existing.error || !existing.data) {
      return { data: null, error: existing.error || new Error('Prompt could not be loaded.') };
    }

    const userId = user.id;
    const now = new Date().toISOString();

    const roleUpdate: PromptRoleUpdate = {
      name,
      content,
      updatedBy: userId,
      updatedAt: now,
    };

    const { error: roleError } = await this.supabase
      .from('promptRoles')
      .update(roleUpdate)
      .eq('id', existing.data.promptRoleId);

    if (roleError) {
      return { data: null, error: roleError };
    }

    const updateData: PromptUpdate = {
      name,
      updatedBy: userId,
      updatedAt: now,
    };

    const { data, error } = await this.supabase
      .from('prompts')
      .update(updateData)
      .eq('id', id)
      .select('*, promptRoles(content)')
      .single();

    if (error) {
      return { data: null, error };
    }

    if (data) {
      if (isPublic) {
        this.publicPromptIds.add(id);
      } else {
        this.publicPromptIds.delete(id);
      }
      return { data: this.mapPromptWithState(data as PromptWithRoleRow), error: null };
    }

    return { data: null, error: null };
  }

  private mapPromptWithState(row: PromptWithRoleRow): Prompt {
    return {
      ...row,
      content: row.promptRoles?.content ?? '',
      isPublic: this.publicPromptIds.has(row.id),
      isStarred: this.starredPromptIds.has(row.id),
      editedBy: row.updatedBy,
      editedAt: row.updatedAt,
    };
  }
}
