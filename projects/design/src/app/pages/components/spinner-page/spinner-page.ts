import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Card, InputSelect, InputSelectOption, Spinner } from '@/ui';

type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'secondary' | 'accent' | 'white';

@Component({
  selector: 'app-spinner-page',
  imports: [Spinner, Card, InputSelect],
  templateUrl: './spinner-page.html',
  styleUrl: './spinner-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerPage {
  protected readonly size = signal<SpinnerSize>('md');
  protected readonly variant = signal<SpinnerVariant>('primary');

  protected readonly sizeOptions: InputSelectOption[] = [
    { value: 'xs', label: 'Extra Small' },
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ];

  protected readonly variantOptions: InputSelectOption[] = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
    { value: 'white', label: 'White' },
  ];

  protected readonly sizes: SpinnerSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
  protected readonly variants: SpinnerVariant[] = ['primary', 'secondary', 'accent', 'white'];

  protected setSize(value: string | null): void {
    if (this.isSpinnerSize(value)) {
      this.size.set(value);
    }
  }

  protected setVariant(value: string | null): void {
    if (this.isSpinnerVariant(value)) {
      this.variant.set(value);
    }
  }

  private isSpinnerSize(value: string | null): value is SpinnerSize {
    return ['xs', 'sm', 'md', 'lg', 'xl'].includes(value ?? '');
  }

  private isSpinnerVariant(value: string | null): value is SpinnerVariant {
    return ['primary', 'secondary', 'accent', 'white'].includes(value ?? '');
  }
}
