import { Routes } from '@angular/router';

export const routesPrompt: Routes = [
  {
    path: 'prompt',
    loadComponent: () =>
      import('./prompt-list-page/prompt-list-page').then((m) => m.PromptListPage),
  },
  {
    path: 'prompt/create',
    loadComponent: () =>
      import('./prompt-create-page/prompt-create-page').then((m) => m.PromptCreatePage),
  },
  {
    path: 'prompt/:id',
    loadComponent: () =>
      import('./prompt-detail-page/prompt-detail-page').then((m) => m.PromptDetailPage),
  },
];
