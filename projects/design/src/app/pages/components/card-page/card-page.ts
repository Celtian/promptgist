import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-page',
  imports: [],
  templateUrl: './card-page.html',
  styleUrl: './card-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPage {}
