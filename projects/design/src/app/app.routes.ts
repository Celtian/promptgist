import { Routes } from '@angular/router';
import { routesForms } from './pages/forms/routes';
import { routesFoundations } from './pages/foundations/routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage),
  },
  ...routesForms,
  ...routesFoundations,
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];
