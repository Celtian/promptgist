import { FLAGS, Flag, Card, InputText, type CountryCode } from '@/ui';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-flag-page',
  imports: [Flag, Card, InputText],
  standalone: true,
  templateUrl: './flag-page.html',
  styleUrl: './flag-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlagPage {
  readonly search = signal('');
  readonly allFlags = Object.entries(FLAGS) as [CountryCode, string][];
  readonly filteredFlags = computed(() => {
    const q = this.search().toLowerCase().trim();
    if (!q) return this.allFlags;
    return this.allFlags.filter(
      ([code, name]) => code.includes(q) || name.toLowerCase().includes(q),
    );
  });
}
