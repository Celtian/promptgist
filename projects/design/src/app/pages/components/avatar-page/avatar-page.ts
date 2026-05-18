import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Avatar, Card, InputSelect, InputSelectOption, InputText } from '@/ui';

type AvatarVariant = 'surface' | 'primary' | 'secondary' | 'accent' | 'emerald' | 'gradient';
type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';
type AvatarShape = 'circle' | 'square';

@Component({
  selector: 'app-avatar-page',
  imports: [Avatar, Card, InputSelect, InputText],
  templateUrl: './avatar-page.html',
  styleUrl: './avatar-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarPage {
  // Interactive control signals
  protected readonly name = signal('Dominik Hladík');
  protected readonly src = signal<string | null>(null);
  protected readonly variant = signal<AvatarVariant>('gradient');
  protected readonly size = signal<AvatarSize>('xl');
  protected readonly shape = signal<AvatarShape>('circle');

  // Available option arrays
  protected readonly variants: AvatarVariant[] = [
    'surface',
    'primary',
    'secondary',
    'accent',
    'emerald',
    'gradient',
  ];

  protected readonly sizes: AvatarSize[] = ['sm', 'md', 'lg', 'xl'];

  protected readonly shapes: AvatarShape[] = ['circle', 'square'];

  // Select Option bindings
  protected readonly variantOptions: InputSelectOption[] = [
    { value: 'surface', label: 'Surface' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
    { value: 'emerald', label: 'Emerald' },
    { value: 'gradient', label: 'Gradient' },
  ];

  protected readonly sizeOptions: InputSelectOption[] = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'xl', label: 'Extra Large' },
  ];

  protected readonly shapeOptions: InputSelectOption[] = [
    { value: 'circle', label: 'Circle' },
    { value: 'square', label: 'Square' },
  ];

  // Callback setters with strict type checking
  protected setVariant(value: string | null): void {
    if (this.isAvatarVariant(value)) {
      this.variant.set(value);
    }
  }

  protected setSize(value: string | null): void {
    if (this.isAvatarSize(value)) {
      this.size.set(value);
    }
  }

  protected setShape(value: string | null): void {
    if (this.isAvatarShape(value)) {
      this.shape.set(value);
    }
  }

  protected setSource(value: string): void {
    this.src.set(value.trim() || null);
  }

  private isAvatarVariant(value: string | null): value is AvatarVariant {
    return this.variants.includes(value as AvatarVariant);
  }

  private isAvatarSize(value: string | null): value is AvatarSize {
    return this.sizes.includes(value as AvatarSize);
  }

  private isAvatarShape(value: string | null): value is AvatarShape {
    return this.shapes.includes(value as AvatarShape);
  }
}
