import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-page',
  imports: [],
  templateUrl: './skeleton-page.html',
  styleUrl: './skeleton-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonPage {}
