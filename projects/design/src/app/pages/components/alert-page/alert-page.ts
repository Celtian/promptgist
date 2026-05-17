import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Alert, Badge, Button, Card, InputSelect, InputSelectOption } from '@/ui';

type AlertVariant = 'surface' | 'outline' | 'primary' | 'secondary' | 'accent';

@Component({
  selector: 'app-alert-page',
  imports: [Alert, Badge, Button, Card, InputSelect],
  templateUrl: './alert-page.html',
  styleUrl: './alert-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertPage {
  protected readonly variant = signal<AlertVariant>('primary');

  protected readonly variants: AlertVariant[] = [
    'surface',
    'outline',
    'primary',
    'secondary',
    'accent',
  ];

  protected readonly variantOptions: InputSelectOption[] = [
    { value: 'surface', label: 'Surface' },
    { value: 'outline', label: 'Outline' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
  ];

  protected setVariant(value: string | null): void {
    if (this.isAlertVariant(value)) {
      this.variant.set(value);
    }
  }

  private isAlertVariant(value: string | null): value is AlertVariant {
    return this.variants.includes(value as AlertVariant);
  }
}
