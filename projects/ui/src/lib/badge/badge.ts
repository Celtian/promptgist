import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'span[ui-badge],div[ui-badge]',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {}
