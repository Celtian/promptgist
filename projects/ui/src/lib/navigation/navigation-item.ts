import { booleanAttribute, computed, Directive, input } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../utils/utils';

const navigationItemVariants = cva('ui-navigation-item', {
  variants: {
    size: {
      sm: 'ui-navigation-item--sm',
      md: 'ui-navigation-item--md',
      lg: 'ui-navigation-item--lg',
    },
    tone: {
      default: '',
      subtle: 'ui-navigation-item--subtle',
      strong: 'ui-navigation-item--strong',
    },
    fullWidth: {
      true: 'ui-navigation-item--full',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    tone: 'default',
    fullWidth: false,
  },
});

type NavigationItemVariants = VariantProps<typeof navigationItemVariants>;

@Directive({
  selector: '[uiNavigationItem]',
  host: {
    '[class]': 'hostClasses()',
  },
})
export class NavigationItem {
  readonly size = input<NavigationItemVariants['size']>('md');
  readonly tone = input<NavigationItemVariants['tone']>('default');
  readonly fullWidth = input<NavigationItemVariants['fullWidth']>(false, {
    transform: booleanAttribute,
  });
  readonly uiClass = input('');

  protected readonly hostClasses = computed(() =>
    cn(
      navigationItemVariants({
        size: this.size(),
        tone: this.tone(),
        fullWidth: this.fullWidth(),
      }),
      this.uiClass(),
    ),
  );
}
