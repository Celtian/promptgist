import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ui-skeleton',
  imports: [],
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {}
