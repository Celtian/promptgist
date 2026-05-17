import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card } from '../../../../../../ui/src/lib/card/card';

interface TypeScale {
  name: string;
  className: string;
  size: string;
  lineHeight: string;
  sample: string;
}

interface TextStyle {
  name: string;
  className: string;
  usage: string;
  sample: string;
}

@Component({
  selector: 'app-typography-page',
  imports: [Card],
  templateUrl: './typography-page.html',
  styleUrl: './typography-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypographyPage {
  protected readonly scale: TypeScale[] = [
    {
      name: 'Display',
      className: 'text-6xl font-extrabold leading-none',
      size: '3.75rem',
      lineHeight: '1',
      sample: 'Build clear interfaces',
    },
    {
      name: 'Heading 1',
      className: 'text-4xl font-extrabold leading-tight',
      size: '2.25rem',
      lineHeight: '1.25',
      sample: 'Foundation overview',
    },
    {
      name: 'Heading 2',
      className: 'text-2xl font-bold leading-snug',
      size: '1.5rem',
      lineHeight: '1.375',
      sample: 'Component states',
    },
    {
      name: 'Heading 3',
      className: 'text-lg font-bold leading-7',
      size: '1.125rem',
      lineHeight: '1.75rem',
      sample: 'Section title',
    },
    {
      name: 'Body',
      className: 'text-base font-normal leading-7',
      size: '1rem',
      lineHeight: '1.75rem',
      sample: 'Use body text for readable product copy and documentation content.',
    },
    {
      name: 'Small',
      className: 'text-sm font-medium leading-6',
      size: '0.875rem',
      lineHeight: '1.5rem',
      sample: 'Small text supports labels, metadata, and compact descriptions.',
    },
  ];

  protected readonly styles: TextStyle[] = [
    {
      name: 'Muted',
      className: 'text-sm leading-6 text-[var(--ui-color-text-muted)]',
      usage: 'Supporting descriptions',
      sample: 'Secondary content should be easy to scan without competing with headings.',
    },
    {
      name: 'Label',
      className: 'text-xs font-bold uppercase text-[var(--ui-color-accent)]',
      usage: 'Eyebrows and categories',
      sample: 'Foundations',
    },
    {
      name: 'Code',
      className: 'font-mono text-sm text-[var(--ui-color-primary)] [overflow-wrap:anywhere]',
      usage: 'Tokens and identifiers',
      sample: '--ui-color-primary-500',
    },
  ];
}
