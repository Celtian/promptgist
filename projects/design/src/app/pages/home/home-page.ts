import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  public readonly ROUTE_DEFINITION = ROUTE_DEFINITION;
  public readonly items = [
    {
      label: 'Forms',
      route: ROUTE_DEFINITION.APP.FORMS,
    },
    {
      label: 'Foundations',
      route: ROUTE_DEFINITION.APP.FOUNDATIONS,
    },
    {
      label: 'Components',
      route: ROUTE_DEFINITION.APP.COMPONENTS,
    },
  ];
}
