import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Card, InputRadio, InputRadioOption } from '@/ui';

@Component({
  selector: 'app-input-radio-page',
  imports: [Card, InputRadio],
  templateUrl: './input-radio-page.html',
  styleUrl: './input-radio-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRadioPage {
  protected readonly radioValue = signal<string | null>('option-1');
  protected readonly radioInlineValue = signal<string | null>('option-2');

  protected readonly options: InputRadioOption[] = [
    { value: 'option-1', label: 'Option 1' },
    { value: 'option-2', label: 'Option 2' },
    { value: 'option-3', label: 'Option 3' },
  ];

  protected readonly optionsWithDisabled: InputRadioOption[] = [
    { value: 'option-1', label: 'Option 1' },
    { value: 'option-2', label: 'Option 2', disabled: true },
    { value: 'option-3', label: 'Option 3' },
  ];
}
