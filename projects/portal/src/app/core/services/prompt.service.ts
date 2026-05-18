import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

export interface Prompt {
  id?: string;
  name: string;
  content: string;
  createdBy: string;
  createdAt: string;
  editedBy: string;
  editedAt: string;
}

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
  ): Promise<{ data: Prompt | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to create a prompt.') };
    }

    const userId = user.id;
    const now = new Date().toISOString();

    const promptData: Omit<Prompt, 'id'> = {
      name,
      content,
      createdBy: userId,
      createdAt: now,
      editedBy: userId,
      editedAt: now,
    };

    // First attempt inserting into the 'prompt' table
    const { data, error } = await this.supabase.from('prompt').insert(promptData).select().single();

    if (error) {
      // If table is missing or doesn't match singular, try fallback plural table 'prompts'
      if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
        const fallback = await this.supabase.from('prompts').insert(promptData).select().single();

        return {
          data: fallback.data ? mapPrompt(fallback.data) : null,
          error: fallback.error,
        };
      }
      return { data: null, error };
    }

    return { data: data ? mapPrompt(data) : null, error: null };
  }

  /**
   * Retrieves all prompt templates from the Supabase database.
   * Standardizes fields robustly mapping case mismatch styles.
   */
  async getPrompts(): Promise<{ data: Prompt[] | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase
      .from('prompt')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Fallback to the plural table 'prompts'
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('relation "prompt" does not exist')
      ) {
        const fallback = await this.supabase
          .from('prompts')
          .select('*')
          .order('created_at', { ascending: false });

        if (fallback.error) {
          // If sorting by created_at failed (maybe they named it createdAt), try sorting by default
          const unsortedFallback = await this.supabase.from('prompts').select('*');

          if (unsortedFallback.error) {
            return { data: null, error: unsortedFallback.error };
          }

          const mapped = (unsortedFallback.data || []).map(mapPrompt);
          // Sort in memory by createdAt descending
          mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return { data: mapped, error: null };
        }

        return {
          data: (fallback.data || []).map(mapPrompt),
          error: null,
        };
      }
      return { data: null, error };
    }

    return { data: (data || []).map(mapPrompt), error: null };
  }

  /**
   * Retrieves a single prompt template by its ID.
   * Standardizes fields robustly mapping case mismatch styles.
   */
  async getPrompt(id: string): Promise<{ data: Prompt | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase.from('prompt').select('*').eq('id', id).single();

    if (error) {
      // Fallback to the plural table 'prompts'
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('relation "prompt" does not exist')
      ) {
        const fallback = await this.supabase.from('prompts').select('*').eq('id', id).single();

        return {
          data: fallback.data ? mapPrompt(fallback.data) : null,
          error: fallback.error,
        };
      }
      return { data: null, error };
    }

    return { data: data ? mapPrompt(data) : null, error: null };
  }

  /**
   * Updates an existing prompt template in the database.
   * Updates editedBy and editedAt automatically.
   */
  async updatePrompt(
    id: string,
    name: string,
    content: string,
  ): Promise<{ data: Prompt | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to update a prompt.') };
    }

    const userId = user.id;
    const now = new Date().toISOString();

    const updateData = {
      name,
      content,
      editedBy: userId,
      editedAt: now,
    };

    // First attempt updating the 'prompt' table
    const { data, error } = await this.supabase
      .from('prompt')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      // Fallback to the plural table 'prompts'
      if (
        error.code === 'PGRST205' ||
        error.message?.includes('schema cache') ||
        error.message?.includes('relation "prompt" does not exist')
      ) {
        const fallback = await this.supabase
          .from('prompts')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        return {
          data: fallback.data ? mapPrompt(fallback.data) : null,
          error: fallback.error,
        };
      }
      return { data: null, error };
    }

    return { data: data ? mapPrompt(data) : null, error: null };
  }
}

/**
 * Database row interface matching either camelCase or snake_case column styles.
 */
interface DatabaseRow {
  id?: string;
  name?: string;
  content?: string;
  createdBy?: string;
  created_by?: string;
  createdAt?: string;
  created_at?: string;
  editedBy?: string;
  edited_by?: string;
  editedAt?: string;
  edited_at?: string;
}

/**
 * Robust database-to-frontend mapper to normalize camelCase / snake_case discrepancies.
 */
function mapPrompt(row: DatabaseRow): Prompt {
  return {
    id: row.id,
    name: row.name || 'Untitled Prompt',
    content: row.content || '',
    createdBy: row.createdBy || row.created_by || 'system',
    createdAt: row.createdAt || row.created_at || new Date().toISOString(),
    editedBy: row.editedBy || row.edited_by || 'system',
    editedAt: row.editedAt || row.edited_at || new Date().toISOString(),
  };
}
