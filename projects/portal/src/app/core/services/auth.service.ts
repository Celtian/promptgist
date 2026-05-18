import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { User, Session, AuthError } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;

  // Internal reactive signals
  private readonly _session = signal<Session | null>(null);
  private readonly _user = signal<User | null>(null);

  // Public readonly accessors
  public readonly session = this._session.asReadonly();
  public readonly user = this._user.asReadonly();
  public readonly isAuthenticated = computed(() => this._user() !== null);

  // Promise resolved once the initial Supabase session restoration check completes
  public readonly ready: Promise<boolean>;

  constructor() {
    // 1. Fetch initial session state on load and resolve ready promise
    this.ready = new Promise<boolean>((resolve) => {
      this.supabase.auth.getSession().then(({ data: { session } }) => {
        this._session.set(session);
        this._user.set(session?.user ?? null);
        resolve(true);
      });
    });

    // 2. Synchronize Supabase subscription with Signals
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._session.set(session);
      this._user.set(session?.user ?? null);
    });
  }

  /**
   * Step 1: Send a 6-digit OTP code to the user's email
   */
  async sendOtpCode(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true, // Auto-signs up new users
      },
    });
    return { error };
  }

  /**
   * Step 2: Verify the 6-digit code provided by the user
   */
  async verifyOtpCode(email: string, token: string): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.verifyOtp({
      email,
      token,
      type: 'email', // Use 'email' for magiclink/OTP code setups
    });
    return { error };
  }

  /**
   * Sign out the active user session
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }
}
