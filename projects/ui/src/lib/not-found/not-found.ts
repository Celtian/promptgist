import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '../button/button';

@Component({
  selector: 'ui-not-found',
  imports: [Button],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full min-h-[70vh] flex items-center justify-center p-4',
  },
})
export class NotFound {}
