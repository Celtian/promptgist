import { Routes } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

export const routesComponents: Routes = [
  {
    path: ROUTE_DEFINITION.APP.COMPONENTS,
    loadComponent: () => import('./components-page').then((m) => m.ComponentsPage),
    children: [
      {
        path: ROUTE_DEFINITION.COMPONENTS.ALERT,
        loadComponent: () => import('./alert-page/alert-page').then((m) => m.AlertPage),
      },
      {
        path: ROUTE_DEFINITION.COMPONENTS.BADGE,
        loadComponent: () => import('./badge-page/badge-page').then((m) => m.BadgePage),
      },
      {
        path: ROUTE_DEFINITION.COMPONENTS.BUTTON,
        loadComponent: () => import('./button-page/button-page').then((m) => m.ButtonPage),
      },
      {
        path: ROUTE_DEFINITION.COMPONENTS.CARD,
        loadComponent: () => import('./card-page/card-page').then((m) => m.CardPage),
      },
      {
        path: ROUTE_DEFINITION.COMPONENTS.MODAL,
        loadComponent: () => import('./modal-page/modal-page').then((m) => m.ModalPage),
      },
      {
        path: ROUTE_DEFINITION.COMPONENTS.SKELETON,
        loadComponent: () => import('./skeleton-page/skeleton-page').then((m) => m.SkeletonPage),
      },
      {
        path: ROUTE_DEFINITION.COMPONENTS.TOOLTIP,
        loadComponent: () => import('./tooltip-page/tooltip-page').then((m) => m.TooltipPage),
      },
      {
        path: ROUTE_DEFINITION.COMPONENTS.SPINNER,
        loadComponent: () => import('./spinner-page/spinner-page').then((m) => m.SpinnerPage),
      },
    ],
  },
];
