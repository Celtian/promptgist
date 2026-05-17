import { Button, Card, InputSelect, InputSelectOption, Tooltip } from '@/ui';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import type { TooltipPlacement } from '@/ui';

@Component({
  selector: 'app-tooltip-page',
  imports: [Tooltip, Button, Card, InputSelect],
  templateUrl: './tooltip-page.html',
  styleUrl: './tooltip-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipPage {
  protected readonly placement = signal<TooltipPlacement>('top');

  protected readonly placementOptions: InputSelectOption[] = [
    { value: 'top', label: 'Top (center)' },
    { value: 'topLeft', label: 'Top left' },
    { value: 'topRight', label: 'Top right' },
    { value: 'bottom', label: 'Bottom (center)' },
    { value: 'bottomLeft', label: 'Bottom left' },
    { value: 'bottomRight', label: 'Bottom right' },
    { value: 'left', label: 'Left (center)' },
    { value: 'leftTop', label: 'Left top' },
    { value: 'leftBottom', label: 'Left bottom' },
    { value: 'right', label: 'Right (center)' },
    { value: 'rightTop', label: 'Right top' },
    { value: 'rightBottom', label: 'Right bottom' },
  ];

  protected readonly topPlacements: TooltipPlacement[] = ['topLeft', 'top', 'topRight'];
  protected readonly bottomPlacements: TooltipPlacement[] = ['bottomLeft', 'bottom', 'bottomRight'];
  protected readonly sidePlacements: TooltipPlacement[] = [
    'leftTop',
    'left',
    'leftBottom',
    'rightTop',
    'right',
    'rightBottom',
  ];

  protected setPlacement(value: string | null): void {
    if (this.isPlacement(value)) {
      this.placement.set(value);
    }
  }

  private isPlacement(value: string | null): value is TooltipPlacement {
    return [
      'top',
      'topLeft',
      'topRight',
      'bottom',
      'bottomLeft',
      'bottomRight',
      'left',
      'leftTop',
      'leftBottom',
      'right',
      'rightTop',
      'rightBottom',
    ].includes(value ?? '');
  }
}
