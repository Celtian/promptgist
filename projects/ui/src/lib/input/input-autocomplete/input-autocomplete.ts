import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-input-autocomplete',
  imports: [],
  templateUrl: './input-autocomplete.html',
  styleUrl: './input-autocomplete.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputAutocomplete {}
