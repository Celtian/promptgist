import { Card, InputSelect, type InputSelectOption } from '@/ui';
import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'app-input-select-page',
  imports: [JsonPipe, InputSelect, Card],
  templateUrl: './input-select-page.html',
  styleUrl: './input-select-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSelectPage {
  protected readonly selectedValue = signal<string | null>(null);

  protected readonly frameworks: InputSelectOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'solid', label: 'Solid', disabled: true },
  ];
}
