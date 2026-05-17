import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

@Component({
  selector: 'app-components-page',
  imports: [RouterLink, RouterOutlet],
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
  ];
}
