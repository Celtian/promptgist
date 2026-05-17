import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

@Component({
  selector: 'app-forms-page',
  imports: [RouterLink, RouterOutlet],
  templateUrl: './forms-page.html',
  styleUrl: './forms-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormsPage {
  public readonly items = [
    {
      label: 'Autocomplete',
      route: ROUTE_DEFINITION.FORMS.INPUT_AUTOCOMPLETE,
    },
    {
      label: 'Select',
      route: ROUTE_DEFINITION.FORMS.INPUT_SELECT,
    },
  ];
}
