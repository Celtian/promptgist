import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Card, InputMultiselect, InputMultiselectOption } from '@/ui';

@Component({
  selector: 'app-input-multiselect-page',
  imports: [Card, InputMultiselect, JsonPipe],
  templateUrl: './input-multiselect-page.html',
  styleUrl: './input-multiselect-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputMultiselectPage {
  protected readonly multiselectValue = signal<string[]>(['option-2']);
  protected readonly emptyMultiselectValue = signal<string[]>([]);

  protected readonly options: InputMultiselectOption[] = [
    { value: 'option-1', label: 'Important' },
    { value: 'option-2', label: 'Starred' },
    { value: 'option-3', label: 'Work' },
    { value: 'option-4', label: 'Personal' },
    { value: 'option-5', label: 'To Do' },
    { value: 'option-6', label: 'Later' },
  ];

  protected readonly optionsWithDisabled: InputMultiselectOption[] = [
    { value: 'option-1', label: 'Important' },
    { value: 'option-2', label: 'Starred', disabled: true },
    { value: 'option-3', label: 'Work' },
  ];
}
