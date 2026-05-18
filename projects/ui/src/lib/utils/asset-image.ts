export interface AssetRendition {
  width: number;
  height: number;
}

export interface AssetImageSource {
  src: string;
  srcset: string;
  width: number;
  height: number;
}

export interface AssetSizeDefinition {
  oneX: AssetRendition;
  twoX: AssetRendition;
  threeX: AssetRendition;
}

export const STANDARD_SQUARE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type StandardSquareSize = (typeof STANDARD_SQUARE_SIZES)[number];

export const STANDARD_SQUARE_SIZE_MAP: Record<StandardSquareSize, AssetSizeDefinition> = {
  xs: {
    oneX: { width: 32, height: 32 },
    twoX: { width: 64, height: 64 },
    threeX: { width: 128, height: 128 },
  },
  sm: {
    oneX: { width: 32, height: 32 },
    twoX: { width: 64, height: 64 },
    threeX: { width: 128, height: 128 },
  },
  md: {
    oneX: { width: 64, height: 64 },
    twoX: { width: 128, height: 128 },
    threeX: { width: 256, height: 256 },
  },
  lg: {
    oneX: { width: 128, height: 128 },
    twoX: { width: 256, height: 256 },
    threeX: { width: 256, height: 256 },
  },
  xl: {
    oneX: { width: 256, height: 256 },
    twoX: { width: 256, height: 256 },
    threeX: { width: 256, height: 256 },
  },
};

export function createSizeTransform<T extends string>(
  validValues: readonly T[],
  fallback: T,
): (value: string) => T {
  return (value: string): T => {
    return validValues.includes(value as T) ? (value as T) : fallback;
  };
}

export function createAssetImageSource(
  basePath: string,
  code: string,
  definition: AssetSizeDefinition,
  extension = '.png',
): AssetImageSource {
  const toPath = (size: AssetRendition) =>
    `${basePath}/${size.width}x${size.height}/${code}${extension}`;

  return {
    src: toPath(definition.oneX),
    srcset: `${toPath(definition.oneX)}, ${toPath(definition.twoX)} 2x, ${toPath(definition.threeX)} 3x`,
    width: definition.oneX.width,
    height: definition.oneX.height,
  };
}
