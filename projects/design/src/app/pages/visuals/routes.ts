import { Routes } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';
import { TITLE_DEFINITION } from '../../constants/title-definition';

export const routesVisuals: Routes = [
  {
    path: ROUTE_DEFINITION.APP.VISUALS,
    title: TITLE_DEFINITION.APP.VISUALS,
    loadComponent: () => import('./visuals-page').then((m) => m.VisualsPage),
    children: [
      {
        path: '',
        redirectTo: ROUTE_DEFINITION.VISUALS.FLAG,
        pathMatch: 'full',
      },
      {
        path: ROUTE_DEFINITION.VISUALS.FLAG,
        title: TITLE_DEFINITION.VISUALS.FLAG,
        loadComponent: () => import('./flag-page/flag-page').then((m) => m.FlagPage),
      },
    ],
  },
];
