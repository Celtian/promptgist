import { Injectable, inject } from '@angular/core';
import { Tables, TablesInsert, TablesUpdate } from '../supabase/database.types';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

type PromptRow = Tables<'prompts'>;
type PromptInsert = TablesInsert<'prompts'>;
type PromptUpdate = TablesUpdate<'prompts'>;
type PromptStarInsert = TablesInsert<'promptStars'>;
type PromptId = PromptRow['id'];

export type Prompt = Omit<PromptRow, 'isPublic'> & {
  isPublic: boolean;
  isStarred: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class PromptService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly auth = inject(AuthService);

  /**
   * Creates a new prompt template in the Supabase database.
   * Auto-populates audit metadata fields: createdBy, createdAt, editedBy, editedAt.
   */
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

    const promptData: PromptInsert = {
      name,
      content,
      isPublic,
      createdBy: userId,
      createdAt: now,
      editedBy: userId,
      editedAt: now,
    };

    const { data, error } = await this.supabase
      .from('prompts')
      .insert(promptData)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data ? mapPrompt(data) : null, error: null };
  }

  async getStarredPromptIds(
    promptIds: readonly PromptId[],
  ): Promise<{ data: Set<string>; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user || promptIds.length === 0) {
      return { data: new Set<string>(), error: null };
    }

    const { data, error } = await this.supabase
      .from('promptStars')
      .select('promptId')
      .eq('userId', user.id)
      .in('promptId', promptIds);

    if (error) {
      return { data: new Set<string>(), error };
    }

    return {
      data: new Set(
        (data || [])
          .map((row) => row.promptId)
          .filter(Boolean)
          .map(String),
      ),
      error: null,
    };
  }

  async isPromptStarred(
    promptId: PromptId,
  ): Promise<{ data: boolean; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: false, error: null };
    }

    const { data, error } = await this.supabase
      .from('promptStars')
      .select('promptId')
      .eq('promptId', promptId)
      .eq('userId', user.id)
      .maybeSingle();

    if (error) {
      return { data: false, error };
    }

    return { data: Boolean(data), error: null };
  }

  async setPromptStarred(
    promptId: PromptId,
    isStarred: boolean,
  ): Promise<{ error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { error: new Error('User must be authenticated to star a prompt.') };
    }

    if (isStarred) {
      const starData: PromptStarInsert = {
        promptId,
        userId: user.id,
        createdAt: new Date().toISOString(),
      };

      const { error } = await this.supabase
        .from('promptStars')
        .upsert(starData, { onConflict: 'promptId,userId' });

      return { error };
    }

    const { error } = await this.supabase
      .from('promptStars')
      .delete()
      .eq('promptId', promptId)
      .eq('userId', user.id);

    return { error };
  }

  /**
   * Retrieves all prompt templates from the Supabase database.
   * Standardizes fields robustly mapping case mismatch styles.
   */
  async getPrompts(): Promise<{ data: Prompt[] | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase
      .from('prompts')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      return { data: null, error };
    }

    return { data: (data || []).map(mapPrompt), error: null };
  }

  /**
   * Retrieves a single prompt template by its ID.
   * Standardizes fields robustly mapping case mismatch styles.
   */
  async getPrompt(
    id: PromptId,
  ): Promise<{ data: Prompt | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase.from('prompts').select('*').eq('id', id).single();

    if (error) {
      return { data: null, error };
    }

    return { data: data ? mapPrompt(data) : null, error: null };
  }

  /**
   * Updates an existing prompt template in the database.
   * Updates editedBy and editedAt automatically.
   */
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

    const userId = user.id;
    const now = new Date().toISOString();

    const updateData: PromptUpdate = {
      name,
      content,
      isPublic,
      editedBy: userId,
      editedAt: now,
    };

    const { data, error } = await this.supabase
      .from('prompts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data: data ? mapPrompt(data) : null, error: null };
  }
}

function mapPrompt(row: PromptRow): Prompt {
  return {
    id: row.id,
    name: row.name,
    content: row.content,
    isPublic: row.isPublic ?? false,
    isStarred: false,
    createdBy: row.createdBy,
    createdAt: row.createdAt,
    editedBy: row.editedBy,
    editedAt: row.editedAt,
  };
}
