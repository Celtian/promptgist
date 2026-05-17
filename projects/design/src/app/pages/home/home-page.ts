import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Card } from '../../../../../ui/src/lib/card/card';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

@Component({
  selector: 'app-home-page',
  imports: [Card, RouterLink],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  public readonly ROUTE_DEFINITION = ROUTE_DEFINITION;
  public readonly items = [
    {
      label: 'Forms',
      description: 'Review inputs, toggles, select controls, and form interaction patterns.',
      route: ROUTE_DEFINITION.APP.FORMS,
    },
    {
      label: 'Foundations',
      description: 'Browse color, typography, spacing, and shared design tokens.',
      route: ROUTE_DEFINITION.APP.FOUNDATIONS,
    },
    {
      label: 'Components',
      description: 'Explore reusable UI primitives and their visual states.',
      route: ROUTE_DEFINITION.APP.COMPONENTS,
    },
  ];
}
