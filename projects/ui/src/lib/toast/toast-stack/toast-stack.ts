import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { ToastData } from '../toast-service';
import { Toast } from '../toast/toast';

export interface ToastStackItem {
  id: number;
  data: ToastData<unknown>;
}

@Component({
  selector: 'ui-toast-stack',
  imports: [Toast],
  templateUrl: './toast-stack.html',
  styleUrl: './toast-stack.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'grid gap-3 p-px',
  },
})
export class ToastStack {
  readonly items = input<readonly ToastStackItem[]>([]);

  readonly dismissed = output<number>();
  readonly actionSelected = output<number>();
}
