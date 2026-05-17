import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-button-page',
  imports: [],
  templateUrl: './button-page.html',
  styleUrl: './button-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonPage {}
