import { Listbox, Option } from '@angular/aria/listbox';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

@Component({
  selector: 'app-components-page',
  imports: [Listbox, Option, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './components-page.html',
  styleUrl: './components-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsPage {
  public readonly items = [
    {
      label: 'Alert',
      route: ROUTE_DEFINITION.COMPONENTS.ALERT,
    },
    {
      label: 'Badge',
      route: ROUTE_DEFINITION.COMPONENTS.BADGE,
    },
    {
      label: 'Button',
      route: ROUTE_DEFINITION.COMPONENTS.BUTTON,
    },
    {
      label: 'Card',
      route: ROUTE_DEFINITION.COMPONENTS.CARD,
    },
    {
      label: 'Scrollbar',
      route: ROUTE_DEFINITION.COMPONENTS.SCROLLBAR,
    },
    {
      label: 'Modal',
      route: ROUTE_DEFINITION.COMPONENTS.MODAL,
    },
    {
      label: 'Skeleton',
      route: ROUTE_DEFINITION.COMPONENTS.SKELETON,
    },
    {
      label: 'Spinner',
      route: ROUTE_DEFINITION.COMPONENTS.SPINNER,
    },
    {
      label: 'Tooltip',
      route: ROUTE_DEFINITION.COMPONENTS.TOOLTIP,
    },
    {
      label: 'Progress Bar',
      route: ROUTE_DEFINITION.COMPONENTS.PROGRESS_BAR,
    },
    {
      label: 'Progress Spinner',
      route: ROUTE_DEFINITION.COMPONENTS.PROGRESS_SPINNER,
    },
    {
      label: 'Toast',
      route: ROUTE_DEFINITION.COMPONENTS.TOAST,
    },
  ].sort((a, b) => a.label.localeCompare(b.label));
}
