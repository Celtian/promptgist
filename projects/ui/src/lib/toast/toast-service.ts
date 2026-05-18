import { GlobalPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { ToastStack, ToastStackItem } from './toast-stack/toast-stack';
import { ToastVariant } from './toast/toast';

export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface ToastData<R = unknown> {
  title?: string;
  message: string;
  variant?: ToastVariant;
  position?: ToastPosition;
  duration?: number;
  actionLabel?: string;
  actionResult?: R;
  dismissible?: boolean;
  role?: 'status' | 'alert';
  ariaLive?: 'polite' | 'assertive';
  uiClass?: string;
}

export class ToastRef<R = unknown> {
  private readonly dismissedSubject = new Subject<R | undefined>();
  readonly afterDismissed = this.dismissedSubject.asObservable();

  constructor(private readonly dismissFn: (result?: R) => void) {}

  dismiss(result?: R): void {
    this.dismissFn(result);
  }

  complete(result?: R): void {
    this.dismissedSubject.next(result);
    this.dismissedSubject.complete();
  }
}

interface ToastEntry {
  id: number;
  data: ToastData<unknown>;
  stack: ToastStackOverlay;
  position: ToastPosition;
  complete: (result?: unknown) => void;
  timerId?: ReturnType<typeof setTimeout>;
}

interface ToastStackOverlay {
  overlayRef: OverlayRef;
  componentRef: ComponentRef<ToastStack>;
  position: ToastPosition;
  entries: ToastEntry[];
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly overlay = inject(Overlay);
  private readonly stacks = new Map<ToastPosition, ToastStackOverlay>();
  private readonly edgeOffset = 16;
  private readonly maxToastsPerPosition = 3;
  private nextId = 0;

  show<R = unknown>(data: ToastData<R>): ToastRef<R> {
    const position = data.position ?? 'bottom-right';
    const stack = this.getStack(position);
    const entryRef: { current?: ToastEntry } = {};
    const toastRef = new ToastRef<R>((result) => {
      if (entryRef.current) {
        this.dismiss(entryRef.current, result);
      }
    });
    const entry: ToastEntry = {
      id: this.nextId++,
      data,
      stack,
      position,
      complete: (result) => toastRef.complete(result as R | undefined),
    };
    entryRef.current = entry;

    stack.entries.push(entry);
    this.trimStack(stack);
    this.syncStack(stack);

    const duration = data.duration ?? 5000;
    if (duration > 0) {
      entry.timerId = setTimeout(() => toastRef.dismiss(), duration);
    }

    return toastRef;
  }

  success(message: string, data: Partial<ToastData> = {}): ToastRef {
    return this.show({ ...data, message, variant: 'primary' });
  }

  info(message: string, data: Partial<ToastData> = {}): ToastRef {
    return this.show({ ...data, message, variant: 'surface' });
  }

  warning(message: string, data: Partial<ToastData> = {}): ToastRef {
    return this.show({ ...data, message, variant: 'accent' });
  }

  dismissAll(): void {
    for (const stack of this.stacks.values()) {
      for (const entry of [...stack.entries]) {
        this.dismiss(entry);
      }
    }
  }

  private dismiss(entry: ToastEntry, result?: unknown): void {
    if (entry.timerId) {
      clearTimeout(entry.timerId);
    }

    this.removeEntry(entry);
    entry.complete(result);
  }

  private removeEntry(entry: ToastEntry): void {
    const stack = entry.stack;
    const index = stack.entries.indexOf(entry);
    if (index === -1) {
      return;
    }

    stack.entries.splice(index, 1);
    this.syncStack(stack);

    if (stack.entries.length === 0) {
      stack.overlayRef.dispose();
      this.stacks.delete(entry.position);
    }
  }

  private getStack(position: ToastPosition): ToastStackOverlay {
    const existing = this.stacks.get(position);
    if (existing) {
      return existing;
    }

    const overlayRef = this.overlay.create({
      positionStrategy: this.createPositionStrategy(position),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      panelClass: [
        'ui-toast-stack-panel',
        'pointer-events-auto',
        'max-h-[calc(100dvh-2rem)]',
        'w-[min(24rem,calc(100vw-2rem))]',
        'overflow-hidden',
      ],
      hasBackdrop: false,
    });

    const componentRef = overlayRef.attach(new ComponentPortal(ToastStack));

    const stack: ToastStackOverlay = {
      overlayRef,
      componentRef,
      position,
      entries: [],
    };

    componentRef.instance.dismissed.subscribe((id) => {
      const entry = stack.entries.find((item) => item.id === id);
      if (entry) {
        this.dismiss(entry);
      }
    });
    componentRef.instance.actionSelected.subscribe((id) => {
      const entry = stack.entries.find((item) => item.id === id);
      if (entry) {
        this.dismiss(entry, entry.data.actionResult);
      }
    });

    this.stacks.set(position, stack);

    return stack;
  }

  private trimStack(stack: ToastStackOverlay): void {
    while (stack.entries.length > this.maxToastsPerPosition) {
      const [entry] = stack.entries;
      if (!entry) {
        return;
      }

      if (entry.timerId) {
        clearTimeout(entry.timerId);
      }

      stack.entries.shift();
      entry.complete();
    }
  }

  private syncStack(stack: ToastStackOverlay): void {
    const items: ToastStackItem[] = stack.entries.map((entry) => ({
      id: entry.id,
      data: entry.data,
    }));
    stack.componentRef.setInput('items', items);
  }

  private createPositionStrategy(position: ToastPosition): GlobalPositionStrategy {
    const strategy = this.overlay.position().global();
    const offset = `${this.edgeOffset}px`;

    if (position.startsWith('top')) {
      strategy.top(offset);
    } else {
      strategy.bottom(offset);
    }

    if (position.endsWith('left')) {
      strategy.left(`${this.edgeOffset}px`);
    } else {
      strategy.right(`${this.edgeOffset}px`);
    }

    return strategy;
  }
}
