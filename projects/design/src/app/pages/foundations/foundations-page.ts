import { Listbox, Option } from '@angular/aria/listbox';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

@Component({
  selector: 'app-foundations-page',
  imports: [Listbox, Option, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './foundations-page.html',
  styleUrl: './foundations-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationsPage {
  public readonly items = [
    {
      label: 'Colors',
      route: ROUTE_DEFINITION.FOUNDATIONS.COLORS,
    },
    {
      label: 'Typography',
      route: ROUTE_DEFINITION.FOUNDATIONS.TYPOGRAPHY,
    },
  ];
}
