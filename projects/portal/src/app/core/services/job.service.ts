import { Injectable, inject } from '@angular/core';
import { Tables, TablesInsert, TablesUpdate } from '../supabase/database.types';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

export type Job = Tables<'jobs'>;
type JobInsert = TablesInsert<'jobs'>;
type JobUpdate = TablesUpdate<'jobs'>;
type JobId = Job['id'];

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
}
