import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wait for Supabase initial session check to resolve
  await auth.ready;

  if (auth.isAuthenticated()) {
    return true;
  }

  // Redirect unauthorized users to the login route
  return router.createUrlTree(['/login']);
};
