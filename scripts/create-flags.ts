import path from 'path';
import { ImageConverter } from './shared/converter';

async function createFlags() {
  const inputFolder = path.join(process.cwd(), 'assets/flags');
  const outputBaseFolder = path.join(process.cwd(), 'projects/ui/assets/flags');

  console.log('🚀 Starting flag generation...');
  console.log(`📂 Input: ${inputFolder}`);
  console.log(`📂 Output: ${outputBaseFolder}`);

  try {
    await ImageConverter.convertMultipleSizes({
      inputFolder,
      outputBaseFolder,
      sizes: [
        ImageConverter.createRectangle(20, 15),
        ImageConverter.createRectangle(40, 30),
        ImageConverter.createRectangle(60, 45),
        ImageConverter.createRectangle(80, 60),
        ImageConverter.createRectangle(120, 90),
      ],
      quality: 100,
      createSizeFolders: true,
    });

    console.log('✅ Flag generation completed successfully!');
  } catch (error) {
    console.error('❌ Error generating flags:', error);
    process.exit(1);
  }
}

createFlags();
