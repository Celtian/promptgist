import { Routes } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';
import { TITLE_DEFINITION } from '../../constants/title-definition';
import { authGuard } from '../../core/guards/auth.guard';

export const routesWorkflow: Routes = [
  {
    path: ROUTE_DEFINITION.WORKSPACE.WORKFLOW,
    title: TITLE_DEFINITION.WORKSPACE.WORKFLOW,
    loadComponent: () =>
      import('./workflow-list-page/workflow-list-page').then((m) => m.WorkflowListPage),
    canActivate: [authGuard],
  },
  {
    path: `${ROUTE_DEFINITION.WORKSPACE.WORKFLOW}/create`,
    title: TITLE_DEFINITION.WORKSPACE.WORKFLOW,
    loadComponent: () =>
      import('./workflow-create-page/workflow-create-page').then((m) => m.WorkflowCreatePage),
    canActivate: [authGuard],
  },
  {
    path: `${ROUTE_DEFINITION.WORKSPACE.WORKFLOW}/:id/edit`,
    title: TITLE_DEFINITION.WORKSPACE.WORKFLOW,
    loadComponent: () =>
      import('./workflow-edit-page/workflow-edit-page').then((m) => m.WorkflowEditPage),
    canActivate: [authGuard],
  },
  {
    path: `${ROUTE_DEFINITION.WORKSPACE.WORKFLOW}/:id`,
    title: TITLE_DEFINITION.WORKSPACE.WORKFLOW,
    loadComponent: () =>
      import('./workflow-detail-page/workflow-detail-page').then((m) => m.WorkflowDetailPage),
    canActivate: [authGuard],
  },
];
