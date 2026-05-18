import { Listbox, Option } from '@angular/aria/listbox';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

@Component({
  selector: 'app-forms-page',
  imports: [Listbox, Option, RouterLink, RouterLinkActive, RouterOutlet],
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
      label: 'Checkbox',
      route: ROUTE_DEFINITION.FORMS.INPUT_CHECKBOX,
    },
    {
      label: 'Multiselect',
      route: ROUTE_DEFINITION.FORMS.INPUT_MULTISELECT,
    },
    {
      label: 'Password',
      route: ROUTE_DEFINITION.FORMS.INPUT_PASSWORD,
    },
    {
      label: 'Radio',
      route: ROUTE_DEFINITION.FORMS.INPUT_RADIO,
    },
    {
      label: 'Range',
      route: ROUTE_DEFINITION.FORMS.INPUT_RANGE,
    },
    {
      label: 'Select',
      route: ROUTE_DEFINITION.FORMS.INPUT_SELECT,
    },
    {
      label: 'Text',
      route: ROUTE_DEFINITION.FORMS.INPUT_TEXT,
    },
    {
      label: 'Textarea',
      route: ROUTE_DEFINITION.FORMS.INPUT_TEXTAREA,
    },
    {
      label: 'Toggle',
      route: ROUTE_DEFINITION.FORMS.INPUT_TOGGLE,
    },
    {
      label: 'Number',
      route: ROUTE_DEFINITION.FORMS.INPUT_NUMBER,
    },
    {
      label: 'OTP',
      route: ROUTE_DEFINITION.FORMS.INPUT_OTP,
    },
  ].sort((a, b) => a.label.localeCompare(b.label));
}
