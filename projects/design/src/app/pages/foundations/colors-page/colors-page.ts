import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from '../../../../../../ui/src/lib/card/card';

interface ColorShade {
  value: number;
  variable: string;
}

interface ColorScale {
  name: string;
  role: string;
  ratio: string;
  variable: string;
  contrastVariable: string;
  shades: ColorShade[];
}

const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

@Component({
  selector: 'app-colors-page',
  imports: [Card],
  templateUrl: './colors-page.html',
  styleUrl: './colors-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsPage {
  protected readonly colors: ColorScale[] = [
    {
      name: 'Primary',
      role: 'Main actions and selected states',
      ratio: '60%',
      variable: '--ui-color-primary',
      contrastVariable: '--ui-color-primary-contrast',
      shades: this.createShades('primary'),
    },
    {
      name: 'Secondary',
      role: 'Surfaces, structure, and supporting UI',
      ratio: '30%',
      variable: '--ui-color-secondary',
      contrastVariable: '--ui-color-secondary-contrast',
      shades: this.createShades('secondary'),
    },
    {
      name: 'Accent',
      role: 'Highlights, emphasis, and rare calls to attention',
      ratio: '10%',
      variable: '--ui-color-accent',
      contrastVariable: '--ui-color-accent-contrast',
      shades: this.createShades('accent'),
    },
  ];

  private createShades(color: string): ColorShade[] {
    return SHADES.map((value) => ({
      value,
      variable: `--ui-color-${color}-${value}`,
    }));
  }
}
