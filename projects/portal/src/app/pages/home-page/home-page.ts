import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button, Tooltip, Badge } from '@/ui';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, Button, Tooltip, Badge],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
