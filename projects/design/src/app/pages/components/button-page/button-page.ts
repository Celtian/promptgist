import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Button, Card, InputSelect, InputSelectOption, InputToggle } from '@/ui';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

@Component({
  selector: 'app-button-page',
  imports: [Button, Card, InputSelect, InputToggle],
  templateUrl: './button-page.html',
  styleUrl: './button-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {
  protected readonly variant = signal<ButtonVariant>('primary');
  protected readonly size = signal<ButtonSize>('md');
  protected readonly fullWidth = signal(false);

  protected readonly variantOptions: InputSelectOption[] = [
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
    { value: 'outline', label: 'Outline' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'link', label: 'Link' },
  ];

  protected readonly sizeOptions: InputSelectOption[] = [
    { value: 'sm', label: 'Small' },
    { value: 'md', label: 'Medium' },
    { value: 'lg', label: 'Large' },
    { value: 'icon', label: 'Icon' },
  ];

  protected readonly variants: ButtonVariant[] = [
    'primary',
    'secondary',
    'accent',
    'outline',
    'ghost',
    'link',
  ];

  protected setVariant(value: string | null): void {
    if (this.isButtonVariant(value)) {
      this.variant.set(value);
    }
  }

  protected setSize(value: string | null): void {
    if (this.isButtonSize(value)) {
      this.size.set(value);
    }
  }

  private isButtonVariant(value: string | null): value is ButtonVariant {
    return this.variants.includes(value as ButtonVariant);
  }

  private isButtonSize(value: string | null): value is ButtonSize {
    return ['sm', 'md', 'lg', 'icon'].includes(value ?? '');
  }
}
