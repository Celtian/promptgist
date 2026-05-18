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
    // 1. Check for development mockAuth bypass in URL or localStorage
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('mockAuth') === 'true' || localStorage.getItem('mockAuth') === 'true') {
        localStorage.setItem('mockAuth', 'true');
        const mockUser: User = {
          id: 'mock-user-uuid-12345',
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          email: 'test@promptgist.com',
        };
        const mockSession: Session = {
          access_token: 'mock-jwt-token',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token',
          user: mockUser,
        };
        this._session.set(mockSession);
        this._user.set(mockUser);
      }
    }

    // 2. Fetch initial session state on load and resolve ready promise
    this.ready = new Promise<boolean>((resolve) => {
      this.supabase.auth.getSession().then(({ data: { session } }) => {
        // Only set session if not already mocked
        if (!this._user()) {
          this._session.set(session);
          this._user.set(session?.user ?? null);
        }
        resolve(true);
      });
    });

    // 3. Synchronize Supabase subscription with Signals
    this.supabase.auth.onAuthStateChange((_event, session) => {
      // Only sync if not currently mocked
      if (typeof window !== 'undefined' && localStorage.getItem('mockAuth') === 'true') {
        return;
      }
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
