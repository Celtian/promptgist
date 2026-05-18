import { Routes } from '@angular/router';
import { ROUTE_DEFINITION } from './constants/route-definition';
import { TITLE_DEFINITION } from './constants/title-definition';
import { authGuard } from './core/guards/auth.guard';
import { routesJob } from './pages/job/routes';
import { routesPrompt } from './pages/prompt/routes';
import { routesWorkflow } from './pages/workflow/routes';

export const routes: Routes = [
  {
    path: ROUTE_DEFINITION.APP.HOME,
    title: TITLE_DEFINITION.APP.HOME,
    loadComponent: () => import('./pages/home-page/home-page').then((m) => m.HomePage),
  },
  {
    path: ROUTE_DEFINITION.APP.LOGIN,
    title: TITLE_DEFINITION.APP.LOGIN,
    loadComponent: () => import('./pages/login-page/login-page').then((m) => m.LoginPage),
  },
  {
    path: ROUTE_DEFINITION.APP.ACCOUNT,
    title: TITLE_DEFINITION.APP.ACCOUNT,
    loadComponent: () => import('./pages/account-page/account-page').then((m) => m.AccountPage),
    canActivate: [authGuard],
  },

  {
    path: ROUTE_DEFINITION.APP.WORKSPACE,
    title: TITLE_DEFINITION.APP.WORKSPACE,
    loadComponent: () =>
      import('./pages/workspace-page/workspace-page').then((m) => m.WorkspacePage),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ROUTE_DEFINITION.WORKSPACE.PROMPT,
      },
      ...routesPrompt,
      ...routesWorkflow,
      ...routesJob,
    ],
  },
  {
    path: ROUTE_DEFINITION.APP.NOT_FOUND,
    title: TITLE_DEFINITION.APP.NOT_FOUND,
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];
