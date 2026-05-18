import { Routes } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';
import { TITLE_DEFINITION } from '../../constants/title-definition';
import { authGuard } from '../../core/guards/auth.guard';

export const routesPrompt: Routes = [
  {
    path: ROUTE_DEFINITION.WORKSPACE.PROMPT,
    title: TITLE_DEFINITION.WORKSPACE.PROMPT,
    loadComponent: () =>
      import('./prompt-list-page/prompt-list-page').then((m) => m.PromptListPage),
    canActivate: [authGuard],
  },
  {
    path: `${ROUTE_DEFINITION.WORKSPACE.PROMPT}/create`,
    title: TITLE_DEFINITION.WORKSPACE.PROMPT,
    loadComponent: () =>
      import('./prompt-create-page/prompt-create-page').then((m) => m.PromptCreatePage),
    canActivate: [authGuard],
  },
  {
    path: `${ROUTE_DEFINITION.WORKSPACE.PROMPT}/:id/edit`,
    title: TITLE_DEFINITION.WORKSPACE.PROMPT,
    loadComponent: () =>
      import('./prompt-edit-page/prompt-edit-page').then((m) => m.PromptEditPage),
    canActivate: [authGuard],
  },
  {
    path: `${ROUTE_DEFINITION.WORKSPACE.PROMPT}/:id`,
    title: TITLE_DEFINITION.WORKSPACE.PROMPT,
    loadComponent: () =>
      import('./prompt-detail-page/prompt-detail-page').then((m) => m.PromptDetailPage),
    canActivate: [authGuard],
  },
];
