import { Injectable, inject } from '@angular/core';
import { Tables, TablesInsert, TablesUpdate } from '../supabase/database.types';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

export type Job = Tables<'jobs'>;
type JobInsert = TablesInsert<'jobs'>;
type JobUpdate = TablesUpdate<'jobs'>;
export type JobId = Job['id'];

export type JobItem = Tables<'jobItems'> & {
  prompts: Tables<'prompts'> | null;
};

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly auth = inject(AuthService);

  async createJob(
    name: string | null,
  ): Promise<{ data: Job | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to create a job.') };
    }

    const now = new Date().toISOString();
    const jobData: JobInsert = {
      name,
      createdBy: user.id,
      createdAt: now,
      updatedBy: user.id,
      updatedAt: now,
    };

    const { data, error } = await this.supabase.from('jobs').insert(jobData).select().single();
    return { data, error };
  }

  async getJobs(): Promise<{ data: Job[] | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase
      .from('jobs')
      .select('*')
      .order('createdAt', { ascending: false });

    return { data, error };
  }

  async getJob(id: JobId): Promise<{ data: Job | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase.from('jobs').select('*').eq('id', id).single();
    return { data, error };
  }

  async updateJob(
    id: JobId,
    name: string | null,
  ): Promise<{ data: Job | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to update a job.') };
    }

    const jobData: JobUpdate = {
      name,
      updatedBy: user.id,
      updatedAt: new Date().toISOString(),
    };

    const { data, error } = await this.supabase
      .from('jobs')
      .update(jobData)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }

  async deleteJob(id: JobId): Promise<{ error: { message: string } | null }> {
    const { error } = await this.supabase.from('jobs').delete().eq('id', id);
    return { error };
  }

  async getJobItems(
    jobId: JobId,
  ): Promise<{ data: JobItem[] | null; error: { message: string } | null }> {
    const { data, error } = await this.supabase
      .from('jobItems')
      .select('*, prompts(*)')
      .eq('jobId', jobId)
      .order('order', { ascending: true });

    return { data: data as JobItem[] | null, error };
  }

  async addJobItem(
    jobId: JobId,
    promptId: string,
    order: number,
  ): Promise<{ data: Tables<'jobItems'> | null; error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { data: null, error: new Error('User must be authenticated to add a prompt.') };
    }

    const now = new Date().toISOString();
    const itemData = {
      jobId,
      promptId,
      order,
      createdBy: user.id,
      createdAt: now,
      updatedBy: user.id,
      updatedAt: now,
    };

    const { data, error } = await this.supabase.from('jobItems').insert(itemData).select().single();

    return { data, error };
  }

  async updateJobItemsOrder(
    items: { id: string; order: number }[],
  ): Promise<{ error: { message: string } | null }> {
    const user = this.auth.user();
    if (!user) {
      return { error: new Error('User must be authenticated to update order.') };
    }

    const now = new Date().toISOString();
    const promises = items.map((item) =>
      this.supabase
        .from('jobItems')
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

  async deleteJobItem(itemId: string): Promise<{ error: { message: string } | null }> {
    const { error } = await this.supabase.from('jobItems').delete().eq('id', itemId);
    return { error };
  }
}
