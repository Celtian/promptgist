import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginPage),
  },
  {
    path: 'account',
    loadComponent: () => import('./pages/account/account').then((m) => m.AccountPage),
    canActivate: [authGuard],
  },
];
