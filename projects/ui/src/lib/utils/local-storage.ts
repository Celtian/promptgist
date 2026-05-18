import { Injectable, NgZone, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  /**
   * Creates a reactive cross-tab synchronized value.
   */
  public createSyncedSignal<T>(
    key: string,
    defaultValue: T,
    serialize: (val: T) => string = (v) => (typeof v === 'string' ? v : JSON.stringify(v)),
    deserialize: (val: string) => T = (v) => {
      try {
        return JSON.parse(v) as T;
      } catch {
        return v as unknown as T;
      }
    },
  ) {
    const getInitialValue = (): T => {
      if (!this.isBrowser) return defaultValue;
      try {
        const item = localStorage.getItem(key);
        return item !== null ? deserialize(item) : defaultValue;
      } catch {
        return defaultValue;
      }
    };

    const sig = signal<T>(getInitialValue());

    if (this.isBrowser) {
      // Listen for storage events from other tabs
      this.zone.runOutsideAngular(() => {
        window.addEventListener('storage', (event) => {
          if (event.key === key && event.newValue !== null) {
            this.zone.run(() => {
              try {
                sig.set(deserialize(event.newValue!));
              } catch {
                // Ignore parse errors
              }
            });
          }
        });
      });
    }

    return {
      get: () => sig(),
      set: (value: T) => {
        sig.set(value);
        if (this.isBrowser) {
          try {
            localStorage.setItem(key, serialize(value));
          } catch {
            // Ignore storage errors
          }
        }
      },
      update: (fn: (val: T) => T) => {
        const newVal = fn(sig());
        sig.set(newVal);
        if (this.isBrowser) {
          try {
            localStorage.setItem(key, serialize(newVal));
          } catch {
            // Ignore storage errors
          }
        }
      },
      asSignal: () => sig.asReadonly(),
    };
  }
}
