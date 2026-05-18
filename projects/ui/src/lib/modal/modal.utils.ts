import { cva } from 'class-variance-authority';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const modalPanelVariants = cva(
  [
    'modal-panel-animate',
    'max-h-[calc(100dvh-2rem)]',
    'max-w-[calc(100vw-2rem)]',
    'overflow-visible',
  ],
  {
    variants: {
      size: {
        sm: 'w-[min(24rem,calc(100vw-2rem))]',
        md: 'w-[min(32rem,calc(100vw-2rem))]',
        lg: 'w-[min(44rem,calc(100vw-2rem))]',
        xl: 'w-[min(56rem,calc(100vw-2rem))]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export function getModalPanelClasses(size: ModalSize = 'md') {
  return modalPanelVariants({ size }).split(' ');
}
