import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/utils';

const avatarVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center font-bold tracking-wider select-none transition-colors',
    'bg-[var(--ui-avatar-background,var(--ui-color-surface-muted))]',
    'text-[var(--ui-avatar-color,var(--ui-color-text))]',
  ],
  {
    variants: {
      variant: {
        surface: [
          'border border-[var(--ui-avatar-border,var(--ui-color-border))]',
          '[--ui-avatar-background:var(--ui-color-surface-muted)]',
          '[--ui-avatar-border:var(--ui-color-border)]',
          '[--ui-avatar-color:var(--ui-color-text-muted)]',
        ],
        primary: [
          'border border-[var(--ui-avatar-border,var(--ui-color-border))]',
          '[--ui-avatar-background:var(--ui-color-primary)]',
          '[--ui-avatar-border:color-mix(in_srgb,var(--ui-color-primary)_76%,var(--ui-color-primary-950))]',
          '[--ui-avatar-color:var(--ui-color-primary-contrast)]',
        ],
        secondary: [
          'border border-[var(--ui-avatar-border,var(--ui-color-border))]',
          '[--ui-avatar-background:var(--ui-color-secondary)]',
          '[--ui-avatar-border:var(--ui-color-border)]',
          '[--ui-avatar-color:var(--ui-color-secondary-contrast)]',
        ],
        accent: [
          'border border-[var(--ui-avatar-border,var(--ui-color-border))]',
          '[--ui-avatar-background:var(--ui-color-accent)]',
          '[--ui-avatar-border:color-mix(in_srgb,var(--ui-color-accent)_76%,var(--ui-color-accent-950))]',
          '[--ui-avatar-color:var(--ui-color-accent-contrast)]',
        ],
        emerald: [
          'border border-[var(--ui-avatar-border,var(--ui-color-border))]',
          '[--ui-avatar-background:color-mix(in_srgb,var(--ui-color-emerald)_16%,transparent)]',
          '[--ui-avatar-border:color-mix(in_srgb,var(--ui-color-emerald)_42%,transparent)]',
          '[--ui-avatar-color:var(--ui-color-emerald)]',
        ],
        gradient: [
          'bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 text-white',
          'shadow-md shadow-purple-500/20',
        ],
      },
      size: {
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-xl',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'surface',
      size: 'md',
      shape: 'circle',
    },
  },
);

type AvatarVariants = VariantProps<typeof avatarVariants>;

@Component({
  selector: 'ui-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClasses()',
  },
})
export class Avatar {
  readonly name = input<string>('');
  readonly src = input<string | null>(null);
  readonly variant = input<AvatarVariants['variant']>('surface');
  readonly size = input<AvatarVariants['size']>('md');
  readonly shape = input<AvatarVariants['shape']>('circle');
  readonly uiClass = input('');

  // Image loading trackers
  protected readonly isImageLoaded = signal(false);
  protected readonly hasImageError = signal(false);

  // Compute aggregate styling variants
  protected readonly hostClasses = computed(() =>
    cn(
      avatarVariants({
        variant: this.variant(),
        size: this.size(),
        shape: this.shape(),
      }),
      this.uiClass(),
    ),
  );

  // Auto-extract initials from a name or email address
  protected readonly initials = computed(() => {
    const rawName = this.name().trim();
    if (!rawName) return '';

    let cleanName = rawName;
    if (rawName.includes('@')) {
      cleanName = rawName.split('@')[0];
    }

    const parts = cleanName.split(/[\s._-]+/).filter(Boolean);
    if (parts.length === 0) return '';

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[1][0]).toUpperCase();
  });

  protected onImageLoad(): void {
    this.isImageLoaded.set(true);
    this.hasImageError.set(false);
  }

  protected onImageError(): void {
    this.isImageLoaded.set(false);
    this.hasImageError.set(true);
  }
}
