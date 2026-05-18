import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable, Type } from '@angular/core';

import { Modal, ModalData } from './modal/modal';
import { getModalPanelClasses } from './modal.utils';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(Dialog);

  private readonly defaultBackdropClass = [
    'bg-[color-mix(in_srgb,var(--ui-color-secondary-950)_42%,transparent)]',
    'backdrop-blur-sm',
    'modal-backdrop-animate',
  ];

  private resolveConfig<R, D, C>(config?: Partial<DialogConfig<D, DialogRef<R, C>>>) {
    return {
      ...config,
      backdropClass: config?.backdropClass ?? this.defaultBackdropClass,
      panelClass: config?.panelClass ?? getModalPanelClasses('md'),
    };
  }

  public open<R = unknown>(
    data: ModalData,
    config?: Partial<DialogConfig<ModalData, DialogRef<R, Modal>>>,
  ) {
    return this.dialog.open<R, ModalData, Modal>(Modal, {
      ...this.resolveConfig<R, ModalData, Modal>(config),
      panelClass: config?.panelClass ?? getModalPanelClasses(data.size ?? 'md'),
      data,
    });
  }

  public openCustom<R = unknown, D = unknown, C = unknown>(
    component: Type<C>,
    config?: Partial<DialogConfig<D, DialogRef<R, C>>>,
  ) {
    return this.dialog.open<R, D, C>(component, this.resolveConfig<R, D, C>(config));
  }
}
