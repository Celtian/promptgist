import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Card, InputSelect, InputSelectOption } from '@/ui';

type CardVariant = 'surface' | 'outline' | 'elevated' | 'primary' | 'secondary' | 'accent';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card-page',
  imports: [Button, Card, InputSelect],
  templateUrl: './card-page.html',
  styleUrl: './card-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {
  protected readonly variant = signal<CardVariant>('surface');
  protected readonly padding = signal<CardPadding>('md');

  protected readonly variants: CardVariant[] = [
    'surface',
    'outline',
    'elevated',
    'primary',
    'secondary',
    'accent',
  ];

  protected readonly variantOptions: InputSelectOption[] = [
    { value: 'surface', label: 'Surface' },
    { value: 'outline', label: 'Outline' },
    { value: 'elevated', label: 'Elevated' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
  ];

  protected readonly paddingOptions: InputSelectOption[] = [
    { value: 'none', label: 'None' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  protected setVariant(value: string | null): void {
    if (this.isCardVariant(value)) {
      this.variant.set(value);
    }
  }

  protected setPadding(value: string | null): void {
    if (this.isCardPadding(value)) {
      this.padding.set(value);
    }
  }

  private isCardVariant(value: string | null): value is CardVariant {
    return this.variants.includes(value as CardVariant);
  }

  private isCardPadding(value: string | null): value is CardPadding {
    return ['none', 'sm', 'md', 'lg'].includes(value ?? '');
  }
}
