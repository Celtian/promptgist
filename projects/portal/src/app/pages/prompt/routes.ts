import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const routesPrompt: Routes = [
  {
    path: 'prompt',
    loadComponent: () =>
      import('./prompt-list-page/prompt-list-page').then((m) => m.PromptListPage),
    canActivate: [authGuard],
  },
  {
    path: 'prompt/create',
    loadComponent: () =>
      import('./prompt-create-page/prompt-create-page').then((m) => m.PromptCreatePage),
    canActivate: [authGuard],
  },
  {
    path: 'prompt/:id',
    loadComponent: () =>
      import('./prompt-detail-page/prompt-detail-page').then((m) => m.PromptDetailPage),
    canActivate: [authGuard],
  },
];
