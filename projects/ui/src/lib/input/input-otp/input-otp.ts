import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  model,
  numberAttribute,
  signal,
  viewChildren,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/utils';

const inputOtpVariants = cva(
  [
    'text-center font-bold border rounded-lg transition-all',
    'border-[var(--ui-input-border,var(--ui-color-border))]',
    'bg-[var(--ui-input-background,var(--ui-color-surface))]',
    'text-[var(--ui-color-text)]',
    'placeholder:text-[var(--ui-color-text-muted)]',
    'focus:border-[var(--ui-input-border,var(--ui-color-border))] focus:ring-0',
    'focus:outline focus:outline-2 focus:outline-offset-2',
    'outline-[color-mix(in_srgb,var(--ui-input-focus,var(--ui-color-primary))_60%,transparent)]',
    'disabled:cursor-not-allowed disabled:opacity-55',
  ],
  {
    variants: {
      size: {
        sm: 'w-8 h-10 text-lg',
        md: 'w-10 h-12 text-xl',
        lg: 'w-12 h-14 text-2xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export type InputOtpSize = NonNullable<VariantProps<typeof inputOtpVariants>['size']>;

@Component({
  selector: 'ui-input-otp',
  imports: [],
  templateUrl: './input-otp.html',
  styleUrl: './input-otp.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputOtp implements FormValueControl<string> {
  private static nextId = 0;

  public readonly value = model<string>('');
  public readonly disabled = input(false, { transform: booleanAttribute });
  public readonly touched = model(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);

  public readonly id = input<string>();
  public readonly length = input(6, { transform: numberAttribute });
  public readonly placeholder = input('#');
  public readonly size = input<InputOtpSize>('md');
  public readonly uiClass = input('');

  protected readonly inputId = computed(() => this.id() ?? `ui-input-otp-${InputOtp.nextId++}`);
  protected readonly hasErrors = computed(() => this.errors().length > 0);

  protected readonly inputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');
  protected readonly inputIndices = computed(() =>
    Array.from({ length: this.length() }, (_, i) => i),
  );

  protected readonly chars = computed(() => {
    const val = this.value() ?? '';
    return val.split('');
  });

  protected readonly disabledIndices = computed(() => {
    const val = this.value() ?? '';
    const length = this.length();
    return Array.from({ length }, (_, i) => {
      if (i === 0) return false;
      return val.length < i;
    });
  });

  protected readonly inputClasses = computed(() =>
    cn(
      inputOtpVariants({ size: this.size() }),
      this.hasErrors() &&
        '[--ui-input-border:var(--ui-color-accent)] [--ui-input-focus:var(--ui-color-accent)]',
    ),
  );

  protected readonly focusedIndex = signal<number | null>(null);

  constructor() {
    // Sync external model updates to native input values
    effect(() => {
      const val = this.value() ?? '';
      const chars = val.split('');
      const inputs = this.inputs();
      if (inputs.length > 0) {
        inputs.forEach((inputRef, i) => {
          const nativeInput = inputRef.nativeElement;
          if (nativeInput.value !== (chars[i] ?? '')) {
            nativeInput.value = chars[i] ?? '';
          }
        });
      }
    });

    // Handle reactive focusing based on the focusedIndex signal
    effect(() => {
      const index = this.focusedIndex();
      if (index !== null) {
        const inputs = this.inputs();
        const targetInput = inputs[index]?.nativeElement;
        if (targetInput) {
          targetInput.disabled = false;
          if (document.activeElement !== targetInput) {
            targetInput.focus();
          }
        }
      }
    });
  }

  protected onInput(event: Event, index: number): void {
    if (this.disabled()) return;
    const inputElement = event.target as HTMLInputElement;
    const val = inputElement.value;

    if (val.length > 1) {
      inputElement.value = val.charAt(val.length - 1);
    }

    this.updateValueFromInputs();

    if (inputElement.value && index < this.length() - 1) {
      this.focusedIndex.set(index + 1);
    }
  }

  protected onKeyDown(event: KeyboardEvent, index: number): void {
    if (this.disabled()) return;
    if (event.key === 'Backspace') {
      const inputElement = this.inputs()[index]?.nativeElement;
      if (inputElement && !inputElement.value && index > 0) {
        this.focusedIndex.set(index - 1);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      this.focusedIndex.set(index - 1);
    } else if (event.key === 'ArrowRight' && index < this.length() - 1) {
      this.focusedIndex.set(index + 1);
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    if (this.disabled()) return;
    event.preventDefault();
    const data = event.clipboardData?.getData('text') || '';
    const digits = data
      .trim()
      .split('')
      .filter((char) => /^[a-zA-Z0-9]$/.test(char));

    const inputArr = this.inputs();
    digits.forEach((digit, i) => {
      if (i < this.length()) {
        const inp = inputArr[i]?.nativeElement;
        if (inp) {
          inp.value = digit;
        }
      }
    });

    this.updateValueFromInputs();

    const lastIndex = Math.min(digits.length, this.length()) - 1;
    if (lastIndex >= 0) {
      this.focusedIndex.set(lastIndex);
    }
  }

  protected onFocus(index: number): void {
    this.focusedIndex.set(index);
  }

  protected onBlur(index: number): void {
    if (this.disabled()) return;
    if (this.focusedIndex() === index) {
      this.focusedIndex.set(null);
    }
    this.touched.set(true);
  }

  private updateValueFromInputs(): void {
    const val = this.inputs()
      .map((input) => input.nativeElement.value)
      .join('');
    this.value.set(val);
    this.touched.set(true);
  }
}
