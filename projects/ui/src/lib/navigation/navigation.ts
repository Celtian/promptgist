import { computed, Directive, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';

const navigationVariants = cva('ui-navigation', {
  variants: {
    justify: {
      start: 'ui-navigation--justify-start',
      center: 'ui-navigation--justify-center',
      end: 'ui-navigation--justify-end',
      between: 'ui-navigation--justify-between',
    },
  },
  defaultVariants: {
    justify: 'start',
  },
});

type NavigationVariants = VariantProps<typeof navigationVariants>;

@Directive({
  selector: '[uiNavigation]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class Navigation {
  readonly justify = input<NavigationVariants['justify']>('start');
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(
      navigationVariants({
        justify: this.justify(),
      }),
      this.uiClass(),
    ),
  );
}
