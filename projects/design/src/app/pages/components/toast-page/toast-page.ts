import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  Button,
  Card,
  InputNumber,
  InputSelect,
  InputSelectOption,
  ToastPosition,
  ToastService,
  ToastVariant,
} from '@/ui';

type ToastButtonVariant = 'outline' | 'primary' | 'secondary' | 'accent';

@Component({
  selector: 'app-toast-page',
  imports: [Button, Card, InputNumber, InputSelect],
  templateUrl: './toast-page.html',
  styleUrl: './toast-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastPage {
  private readonly toast = inject(ToastService);

  protected readonly variant = signal<ToastVariant>('primary');
  protected readonly position = signal<ToastPosition>('bottom-right');
  protected readonly duration = signal(5000);

  protected readonly variantOptions: InputSelectOption[] = [
    { value: 'surface', label: 'Surface' },
    { value: 'primary', label: 'Primary' },
    { value: 'secondary', label: 'Secondary' },
    { value: 'accent', label: 'Accent' },
  ];

  protected readonly positionOptions: InputSelectOption[] = [
    { value: 'bottom-right', label: 'Bottom right' },
    { value: 'bottom-left', label: 'Bottom left' },
    { value: 'top-right', label: 'Top right' },
    { value: 'top-left', label: 'Top left' },
  ];

  protected readonly variants: ToastVariant[] = ['surface', 'primary', 'secondary', 'accent'];

  protected setVariant(value: string | null): void {
    if (this.isToastVariant(value)) {
      this.variant.set(value);
    }
  }

  protected setPosition(value: string | null): void {
    if (this.isToastPosition(value)) {
      this.position.set(value);
    }
  }

  protected showToast(): void {
    this.toast.show({
      title: 'Prompt saved',
      message: 'Your prompt changes were saved to the workspace.',
      variant: this.variant(),
      position: this.position(),
      duration: this.duration(),
    });
  }

  protected showActionToast(): void {
    this.toast.show({
      title: 'Collection published',
      message: 'The team can now use this prompt collection.',
      variant: this.variant(),
      position: this.position(),
      duration: this.duration(),
      actionLabel: 'View',
      actionResult: 'view',
    });
  }

  protected showPersistentToast(): void {
    this.toast.show({
      title: 'Sync paused',
      message: 'Resolve the disconnected workspace before syncing again.',
      variant: 'accent',
      position: this.position(),
      duration: 0,
      actionLabel: 'Resolve',
    });
  }

  protected showVariantToast(variant: ToastVariant): void {
    this.toast.show({
      title: `${variant} toast`,
      message: 'A theme-aware toast notification.',
      variant,
      position: this.position(),
      duration: this.duration(),
    });
  }

  protected dismissAll(): void {
    this.toast.dismissAll();
  }

  protected setDuration(value: number | null): void {
    this.duration.set(value ?? 0);
  }

  protected buttonVariantFor(variant: ToastVariant): ToastButtonVariant {
    return variant === 'surface' ? 'outline' : variant;
  }

  private isToastVariant(value: string | null): value is ToastVariant {
    return ['surface', 'primary', 'secondary', 'accent'].includes(value ?? '');
  }

  private isToastPosition(value: string | null): value is ToastPosition {
    return ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(value ?? '');
  }
}
