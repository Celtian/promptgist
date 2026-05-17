import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { Card, Scrollbar } from '@/ui';

@Component({
  selector: 'app-scrollbar-page',
  imports: [Card, Scrollbar],
  templateUrl: './scrollbar-page.html',
  styleUrl: './scrollbar-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollbarPage {
  protected readonly variant = signal<'surface' | 'primary' | 'accent'>('surface');
  protected readonly size = signal<'sm' | 'md' | 'lg'>('md');

  protected readonly items = Array.from({ length: 20 }, (_, i) => `List item ${i + 1}`);

  protected setVariant(value: 'surface' | 'primary' | 'accent'): void {
    this.variant.set(value);
  }

  protected setSize(value: 'sm' | 'md' | 'lg'): void {
    this.size.set(value);
  }
}
