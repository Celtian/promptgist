import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Badge, Card, InputSelect, InputSelectOption } from '@/ui';

type BadgeVariant = 'surface' | 'outline' | 'primary' | 'secondary' | 'accent';
type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge-page',
  imports: [Badge, Card, InputSelect],
  templateUrl: './badge-page.html',
  styleUrl: './badge-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgePage {
  protected readonly variant = signal<BadgeVariant>('primary');
  protected readonly size = signal<BadgeSize>('md');

  protected readonly variants: BadgeVariant[] = [
    'surface',
    'outline',
    'primary',
    'secondary',
    'accent',
  ];

  protected readonly sizes: BadgeSize[] = ['sm', 'md', 'lg'];

  protected readonly variantOptions: InputSelectOption[] = [
    { value: 'surface', label: 'Surface' },
    { value: 'outline', label: 'Outline' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
  ];

  protected readonly sizeOptions: InputSelectOption[] = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
  ];

  protected setVariant(value: string | null): void {
    if (this.isBadgeVariant(value)) {
      this.variant.set(value);
    }
  }

  protected setSize(value: string | null): void {
    if (this.isBadgeSize(value)) {
      this.size.set(value);
    }
  }

  private isBadgeVariant(value: string | null): value is BadgeVariant {
    return this.variants.includes(value as BadgeVariant);
  }

  private isBadgeSize(value: string | null): value is BadgeSize {
    return this.sizes.includes(value as BadgeSize);
  }
}
