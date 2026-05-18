import { Routes } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';
import { TITLE_DEFINITION } from '../../constants/title-definition';
import { authGuard } from '../../core/guards/auth.guard';

export const routesJob: Routes = [
  {
    path: ROUTE_DEFINITION.WORKSPACE.JOB,
    title: TITLE_DEFINITION.WORKSPACE.JOB,
    loadComponent: () => import('./job-list-page/job-list-page').then((m) => m.JobListPage),
    canActivate: [authGuard],
  },
  {
    path: `${ROUTE_DEFINITION.WORKSPACE.JOB}/create`,
    title: TITLE_DEFINITION.WORKSPACE.JOB,
    loadComponent: () => import('./job-create-page/job-create-page').then((m) => m.JobCreatePage),
    canActivate: [authGuard],
  },
  {
    path: `${ROUTE_DEFINITION.WORKSPACE.JOB}/:id/edit`,
    title: TITLE_DEFINITION.WORKSPACE.JOB,
    loadComponent: () => import('./job-edit-page/job-edit-page').then((m) => m.JobEditPage),
    canActivate: [authGuard],
  },
  {
    path: `${ROUTE_DEFINITION.WORKSPACE.JOB}/:id`,
    title: TITLE_DEFINITION.WORKSPACE.JOB,
    loadComponent: () => import('./job-detail-page/job-detail-page').then((m) => m.JobDetailPage),
    canActivate: [authGuard],
  },
];
