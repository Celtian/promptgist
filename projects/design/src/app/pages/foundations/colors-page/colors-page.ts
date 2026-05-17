import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-colors-page',
  imports: [],
  templateUrl: './colors-page.html',
  styleUrl: './colors-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsPage {}
