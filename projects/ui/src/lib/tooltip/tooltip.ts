import {
  ConnectedPosition,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';

import { TooltipContent } from './tooltip-content';

// ── Placement type ────────────────────────────────────────────────────────────
export type TooltipPlacement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom';

// ── CDK position map ──────────────────────────────────────────────────────────
export const PLACEMENT_POSITIONS: Record<TooltipPlacement, ConnectedPosition> = {
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
    offsetY: -8,
  },
  topLeft: {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -8,
  },
  topRight: {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -8,
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
    offsetY: 8,
  },
  bottomLeft: {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 8,
  },
  bottomRight: {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 8,
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
    offsetX: -8,
  },
  leftTop: {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -8,
  },
  leftBottom: {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetX: -8,
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
    offsetX: 8,
  },
  rightTop: {
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 8,
  },
  rightBottom: {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetX: 8,
  },
};

// ── Directive ─────────────────────────────────────────────────────────────────
@Directive({
  selector: '[uiTooltip]',
})
export class Tooltip implements OnDestroy {
  /** Text content of the tooltip. */
  readonly uiTooltip = input.required<string>();

  /**
   * One or more placements in priority order.
   * The first position that fits the viewport wins; the rest serve as fallbacks.
   *
   * @example
   * [tooltipPlacement]="'top'"
   * [tooltipPlacement]="['top', 'bottom', 'right']"
   */
  readonly tooltipPlacement = input<TooltipPlacement | TooltipPlacement[]>('top');

  readonly tooltipDisabled = input(false);

  private readonly overlay = inject(Overlay);
  private readonly elementRef = inject(ElementRef);

  private overlayRef: OverlayRef | null = null;
  private tooltipRef: ComponentRef<TooltipContent> | null = null;
  private readonly isVisible = signal(false);

  @HostListener('mouseenter')
  @HostListener('focus')
  show(): void {
    if (this.tooltipDisabled() || this.isVisible()) return;
    this.createTooltip();
  }

  @HostListener('mouseleave')
  @HostListener('blur')
  hide(): void {
    this.destroyTooltip();
  }

  ngOnDestroy(): void {
    this.destroyTooltip();
  }

  private resolvePositions(): ConnectedPosition[] {
    const raw = this.tooltipPlacement();
    const list: TooltipPlacement[] = Array.isArray(raw) ? raw : [raw];
    // Deduplicate while preserving order
    const seen = new Set<TooltipPlacement>();
    const positions: ConnectedPosition[] = [];
    for (const p of list) {
      if (!seen.has(p)) {
        seen.add(p);
        positions.push(PLACEMENT_POSITIONS[p]);
      }
    }
    return positions;
  }

  private createTooltip(): void {
    const positions = this.resolvePositions();
    const primaryPlacement = (
      Array.isArray(this.tooltipPlacement())
        ? (this.tooltipPlacement() as TooltipPlacement[])[0]
        : this.tooltipPlacement()
    ) as TooltipPlacement;

    const positionStrategy: FlexibleConnectedPositionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions(positions)
      .withPush(false);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: 'ui-tooltip-panel',
    });

    const portal = new ComponentPortal(TooltipContent);
    this.tooltipRef = this.overlayRef.attach(portal);
    this.tooltipRef.setInput('text', this.uiTooltip());
    this.tooltipRef.setInput('placement', primaryPlacement);

    positionStrategy.positionChanges.subscribe((change) => {
      if (!this.tooltipRef) return;
      // Map back the actual position applied to a base placement string
      const pair = change.connectionPair;
      let actualPlacement: string = primaryPlacement;

      if (pair.originY === 'top' && pair.overlayY === 'bottom') actualPlacement = 'top';
      else if (pair.originY === 'bottom' && pair.overlayY === 'top') actualPlacement = 'bottom';
      else if (pair.originX === 'start' && pair.overlayX === 'end') actualPlacement = 'left';
      else if (pair.originX === 'end' && pair.overlayX === 'start') actualPlacement = 'right';

      this.tooltipRef.setInput('placement', actualPlacement);
    });

    this.isVisible.set(true);
  }

  private destroyTooltip(): void {
    this.overlayRef?.detach();
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.tooltipRef = null;
    this.isVisible.set(false);
  }
}
