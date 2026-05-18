import { Button, Card, Navigation, NavigationItem } from '@/ui';
import { Listbox, Option } from '@angular/aria/listbox';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-navigation-page',
  imports: [Button, Card, Listbox, Navigation, NavigationItem, Option],
  standalone: true,
  templateUrl: './navigation-page.html',
  styleUrl: './navigation-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationPage {
  protected readonly options = [
    'Option 1',
    'Option 2',
    'Option 3',
    'Option 4',
    'Option 5',
    'Option 6',
    'Option 7',
    'Option 8',
  ];
  protected readonly items = ['Overview', 'Prompts', 'Collections', 'Activity'];
  protected readonly footerItems = ['Docs', 'Status', 'Privacy', 'Contact'];
}
