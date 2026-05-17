import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Card, InputSelect, InputSelectOption, Skeleton } from '@/ui';

type SkeletonShape = 'rect' | 'circle' | 'text';
type SkeletonAnimation = 'pulse' | 'shimmer' | 'none';

@Component({
  selector: 'app-skeleton-page',
  imports: [Skeleton, Card, InputSelect],
  templateUrl: './skeleton-page.html',
  styleUrl: './skeleton-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonPage {
  protected readonly shape = signal<SkeletonShape>('rect');
  protected readonly animation = signal<SkeletonAnimation>('pulse');

  protected readonly shapeOptions: InputSelectOption[] = [
    { value: 'rect', label: 'Rectangle' },
    { value: 'circle', label: 'Circle' },
    { value: 'text', label: 'Text' },
  ];

  protected readonly animationOptions: InputSelectOption[] = [
    { value: 'pulse', label: 'Pulse' },
    { value: 'shimmer', label: 'Shimmer' },
    { value: 'none', label: 'None' },
  ];

  protected readonly shapes: SkeletonShape[] = ['rect', 'circle', 'text'];

  protected setShape(value: string | null): void {
    if (this.isSkeletonShape(value)) {
      this.shape.set(value);
    }
  }

  protected setAnimation(value: string | null): void {
    if (this.isSkeletonAnimation(value)) {
      this.animation.set(value);
    }
  }

  private isSkeletonShape(value: string | null): value is SkeletonShape {
    return ['rect', 'circle', 'text'].includes(value ?? '');
  }

  private isSkeletonAnimation(value: string | null): value is SkeletonAnimation {
    return ['pulse', 'shimmer', 'none'].includes(value ?? '');
  }
}
