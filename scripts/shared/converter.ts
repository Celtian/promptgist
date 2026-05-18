import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface Dimensions {
  width: number;
  height: number;
}

interface ConversionOptions {
  inputFolder: string;
  outputFolder: string;
  dimensions: Dimensions;
  quality?: number;
  fit?: keyof sharp.FitEnum;
  background?: sharp.Color;
  outputFormat?: 'png' | 'webp';
}

interface MultiSizeConversionOptions {
  inputFolder: string;
  outputBaseFolder: string;
  sizes: Dimensions[];
  quality?: number;
  createSizeFolders?: boolean;
  fit?: keyof sharp.FitEnum;
  background?: sharp.Color;
  outputFormat?: 'png' | 'webp';
}

class ImageConverter {
  private inputFolder: string;
  private outputFolder: string;
  private dimensions: Dimensions;
  private quality: number;
  private fit: keyof sharp.FitEnum;
  private background: sharp.Color;
  private outputFormat: 'png' | 'webp';

  constructor(options: ConversionOptions) {
    this.inputFolder = options.inputFolder;
    this.outputFolder = options.outputFolder;
    this.dimensions = options.dimensions;
    this.quality = options.quality || 100;
    this.fit = options.fit || 'cover';
    this.background = options.background || { r: 0, g: 0, b: 0, alpha: 0 };
    this.outputFormat = options.outputFormat || 'png';
  }

  /**
   * Ensure output directory exists
   */
  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.outputFolder)) {
      fs.mkdirSync(this.outputFolder, { recursive: true });
      console.log(`Created output directory: ${this.outputFolder}`);
    }
  }

  /**
   * Get all supported image files from input folder
   */
  private getImageFiles(): string[] {
    try {
      const files = fs.readdirSync(this.inputFolder);
      // Support all common image formats that Sharp can handle
      const supportedExtensions = [
        '.svg',
        '.png',
        '.jpg',
        '.jpeg',
        '.webp',
        '.gif',
        '.tiff',
        '.tif',
        '.avif',
        '.heif',
        '.heic',
        '.bmp',
        '.ico',
      ];

      return files.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return supportedExtensions.includes(ext);
      });
    } catch (error) {
      console.error(`Error reading input folder: ${error}`);
      return [];
    }
  }

  /**
   * Convert single image file
   */
  private async convertSingleFile(filename: string): Promise<void> {
    const inputPath = path.join(this.inputFolder, filename);
    const fileExtension = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, fileExtension);
    const outputExt = this.outputFormat === 'webp' ? '.webp' : '.png';
    const outputFilename = baseName + outputExt;
    const outputPath = path.join(this.outputFolder, outputFilename);

    try {
      const sharpInstance = sharp(inputPath);
      const resized = sharpInstance.resize(this.dimensions.width, this.dimensions.height, {
        fit: this.fit,
        background: this.background,
        position: 'center',
      });

      // Apply format-specific output settings
      if (this.outputFormat === 'webp') {
        await resized
          .webp({
            quality: this.quality,
            effort: 6,
          })
          .toFile(outputPath);
      } else {
        await resized
          .png({
            quality: this.quality,
            compressionLevel: 9,
            adaptiveFiltering: true,
          })
          .toFile(outputPath);
      }

      console.log(
        `✓ Converted: ${filename} → ${outputFilename} (${fileExtension.substring(1).toUpperCase()} → ${this.outputFormat.toUpperCase()})`,
      );
    } catch (error) {
      console.error(`✗ Failed to convert ${filename}:`, error);
    }
  }

  /**
   * Convert all image files in the input folder
   */
  public async convertAll(): Promise<void> {
    console.log(`Starting image to ${this.outputFormat.toUpperCase()} conversion...`);
    console.log(`Input folder: ${this.inputFolder}`);
    console.log(`Output folder: ${this.outputFolder}`);
    console.log(`Target size: ${this.dimensions.width}x${this.dimensions.height}px`);
    console.log('---');

    // Ensure output directory exists
    this.ensureOutputDirectory();

    // Get all image files
    const imageFiles = this.getImageFiles();

    if (imageFiles.length === 0) {
      console.log('No supported image files found in the input folder.');
      console.log(
        'Supported formats: SVG, PNG, JPG, JPEG, WebP, GIF, TIFF, AVIF, HEIF, HEIC, BMP, ICO',
      );
      return;
    }

    console.log(`Found ${imageFiles.length} image file(s) to convert:`);
    imageFiles.forEach((file) => {
      const ext = path.extname(file).toLowerCase();
      console.log(`  - ${file} (${ext.substring(1).toUpperCase()})`);
    });
    console.log('---');

    // Convert each file
    const promises = imageFiles.map((file) => this.convertSingleFile(file));
    await Promise.all(promises);

    console.log('---');
    console.log(`Conversion completed! Check the output folder: ${this.outputFolder}`);
  }

  /**
   * Convert specific files only
   */
  public async convertSpecific(filenames: string[]): Promise<void> {
    console.log(`Converting specific files...`);
    this.ensureOutputDirectory();

    const promises = filenames.map((filename) => {
      // Auto-detect extension if not provided
      if (!filename.includes('.')) {
        // Try to find the file with any supported extension
        const supportedExtensions = [
          '.svg',
          '.png',
          '.jpg',
          '.jpeg',
          '.webp',
          '.gif',
          '.tiff',
          '.tif',
          '.avif',
          '.heif',
          '.heic',
          '.bmp',
          '.ico',
        ];

        let foundFile = null;
        for (const ext of supportedExtensions) {
          const testFile = filename + ext;
          if (fs.existsSync(path.join(this.inputFolder, testFile))) {
            foundFile = testFile;
            break;
          }
        }

        filename = foundFile || filename + '.svg'; // Default to SVG for backward compatibility
      }
      return this.convertSingleFile(filename);
    });

    await Promise.all(promises);
    console.log('Specific file conversion completed!');
  }

  /**
   * Convert all image files to multiple sizes
   */
  public static async convertMultipleSizes(options: MultiSizeConversionOptions): Promise<void> {
    const {
      inputFolder,
      outputBaseFolder,
      sizes,
      quality = 100,
      createSizeFolders = true,
      fit = 'cover',
      background = { r: 0, g: 0, b: 0, alpha: 0 },
      outputFormat = 'png',
    } = options;

    console.log(`Starting multi-size image to ${outputFormat.toUpperCase()} conversion...`);
    console.log(`Input folder: ${inputFolder}`);
    console.log(`Output base folder: ${outputBaseFolder}`);
    console.log(`Sizes: ${sizes.map((s) => `${s.width}x${s.height}`).join(', ')}px`);
    console.log(`Fit: ${fit}`);
    console.log('---');

    // Create converters for each size
    const converters = sizes.map((dimensions) => {
      const folderName = `${dimensions.width}x${dimensions.height}`;
      const outputFolder = createSizeFolders
        ? path.join(outputBaseFolder, folderName)
        : outputBaseFolder;

      return {
        dimensions,
        converter: new ImageConverter({
          inputFolder,
          outputFolder,
          dimensions,
          quality,
          fit,
          background,
          outputFormat,
        }),
      };
    });

    // Convert for each size
    for (const { dimensions, converter } of converters) {
      console.log(`Converting to ${dimensions.width}x${dimensions.height}...`);
      await converter.convertAll();
      console.log(`${dimensions.width}x${dimensions.height} conversion completed!`);
      console.log('---');
    }

    console.log('All size conversions completed!');
  }

  /**
   * Convert specific files to multiple sizes
   */
  public static async convertSpecificMultipleSizes(
    options: MultiSizeConversionOptions,
    filenames: string[],
  ): Promise<void> {
    const {
      inputFolder,
      outputBaseFolder,
      sizes,
      quality = 100,
      createSizeFolders = true,
      fit = 'cover',
      background = { r: 0, g: 0, b: 0, alpha: 0 },
      outputFormat = 'png',
    } = options;

    console.log(`Converting specific files to multiple sizes...`);
    console.log(`Files: ${filenames.join(', ')}`);
    console.log(`Sizes: ${sizes.map((s) => `${s.width}x${s.height}`).join(', ')}px`);
    console.log(`Fit: ${fit}`);
    console.log('---');

    // Create converters for each size
    const converters = sizes.map((dimensions) => {
      const folderName = `${dimensions.width}x${dimensions.height}`;
      const outputFolder = createSizeFolders
        ? path.join(outputBaseFolder, folderName)
        : outputBaseFolder;

      return {
        dimensions,
        converter: new ImageConverter({
          inputFolder,
          outputFolder,
          dimensions,
          quality,
          fit,
          background,
          outputFormat,
        }),
      };
    });

    // Convert for each size
    for (const { dimensions, converter } of converters) {
      console.log(`Converting to ${dimensions.width}x${dimensions.height}...`);
      await converter.convertSpecific(filenames);
      console.log(`${dimensions.width}x${dimensions.height} conversion completed!`);
      console.log('---');
    }

    console.log('All specific file conversions completed!');
  }

  /**
   * Convenience method to create square dimensions
   */
  public static createSquare(size: number): Dimensions {
    return { width: size, height: size };
  }

  /**
   * Convenience method to create rectangular dimensions
   */
  public static createRectangle(width: number, height: number): Dimensions {
    return { width, height };
  }
}

export { ImageConverter, type ConversionOptions, type Dimensions, type MultiSizeConversionOptions };
