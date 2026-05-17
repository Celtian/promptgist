import { Routes } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

export const routesForms: Routes = [
  {
    path: ROUTE_DEFINITION.APP.FORMS,
    loadComponent: () => import('./forms-page').then((m) => m.FormsPage),
    children: [
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_CHECKBOX,
        loadComponent: () =>
          import('./input-checkbox-page/input-checkbox-page').then((m) => m.InputCheckboxPage),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_RADIO,
        loadComponent: () =>
          import('./input-radio-page/input-radio-page').then((m) => m.InputRadioPage),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_RANGE,
        loadComponent: () =>
          import('./input-range-page/input-range-page').then((m) => m.InputRangePage),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_SELECT,
        loadComponent: () =>
          import('./input-select-page/input-select-page').then((m) => m.InputSelectPage),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_TEXT,
        loadComponent: () =>
          import('./input-text-page/input-text-page').then((m) => m.InputTextPage),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_TEXTAREA,
        loadComponent: () =>
          import('./input-textarea-page/input-textarea-page').then((m) => m.InputTextareaPage),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_TOGGLE,
        loadComponent: () =>
          import('./input-toggle-page/input-toggle-page').then((m) => m.InputTogglePage),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_PASSWORD,
        loadComponent: () =>
          import('./input-password-page/input-password-page').then((m) => m.InputPasswordPage),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_MULTISELECT,
        loadComponent: () =>
          import('./input-multiselect-page/input-multiselect-page').then(
            (m) => m.InputMultiselectPage,
          ),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_AUTOCOMPLETE,
        loadComponent: () =>
          import('./input-autocomplete-page/input-autocomplete-page').then(
            (m) => m.InputAutocompletePage,
          ),
      },
      {
        path: ROUTE_DEFINITION.FORMS.INPUT_NUMBER,
        loadComponent: () =>
          import('./input-number-page/input-number-page').then((m) => m.InputNumberPage),
      },
    ],
  },
];
