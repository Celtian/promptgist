import { Routes } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';
import { TITLE_DEFINITION } from '../../constants/title-definition';

export const routesFoundations: Routes = [
  {
    path: ROUTE_DEFINITION.APP.FOUNDATIONS,
    title: TITLE_DEFINITION.APP.FOUNDATIONS,
    loadComponent: () => import('./foundations-page').then((m) => m.FoundationsPage),
    children: [
      {
        path: ROUTE_DEFINITION.FOUNDATIONS.COLORS,
        title: TITLE_DEFINITION.FOUNDATIONS.COLORS,
        loadComponent: () => import('./colors-page/colors-page').then((m) => m.ColorsPage),
      },
      {
        path: ROUTE_DEFINITION.FOUNDATIONS.TYPOGRAPHY,
        title: TITLE_DEFINITION.FOUNDATIONS.TYPOGRAPHY,
        loadComponent: () =>
          import('./typography-page/typography-page').then((m) => m.TypographyPage),
      },
    ],
  },
];
