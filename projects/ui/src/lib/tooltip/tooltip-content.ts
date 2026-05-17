import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-tooltip-content',
  imports: [],
  templateUrl: './tooltip-content.html',
  styleUrl: './tooltip-content.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipContent {}
