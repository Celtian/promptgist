import { Routes } from '@angular/router';
import { TITLE_DEFINITION } from './constants/title-definition';
import { routesComponents } from './pages/components/routes';
import { routesForms } from './pages/forms/routes';
import { routesFoundations } from './pages/foundations/routes';
import { routesVisuals } from './pages/visuals/routes';

export const routes: Routes = [
  {
    path: '',
    title: TITLE_DEFINITION.APP.HOME,
    loadComponent: () => import('./pages/home/home-page').then((m) => m.HomePage),
  },
  ...routesForms,
  ...routesFoundations,
  ...routesComponents,
  ...routesVisuals,
  {
    path: '**',
    title: TITLE_DEFINITION.APP.NOT_FOUND,
    loadComponent: () => import('./pages/not-found/not-found-page').then((m) => m.NotFoundPage),
  },
];
