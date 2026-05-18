import { Listbox, Option } from '@angular/aria/listbox';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

@Component({
  selector: 'app-visuals-page',
  imports: [Listbox, Option, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './visuals-page.html',
  styleUrl: './visuals-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisualsPage {
  public readonly items = [
    {
      label: 'Flag',
      route: ROUTE_DEFINITION.VISUALS.FLAG,
    },
  ].sort((a, b) => a.label.localeCompare(b.label));
}
