// Splits public/images/barattoli.png into 5 equal vertical slices.
// Usage: node scripts/crop-barattoli.js

const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'public', 'images', 'barattoli.png');
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'luce-di-terra');
const SLICES = 5;

async function main() {
  const image = sharp(SRC);
  const { width, height } = await image.metadata();

  if (!width || !height) {
    throw new Error(`Impossibile leggere le dimensioni di ${SRC}`);
  }

  const sliceWidth = Math.floor(width / SLICES);
  const fs = require('fs');
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (let i = 0; i < SLICES; i++) {
    const left = i * sliceWidth;
    // Last slice absorbs any leftover pixels from the floor() division.
    const extractWidth = i === SLICES - 1 ? width - left : sliceWidth;

    const outPath = path.join(OUT_DIR, `barattolo-${i + 1}.png`);
    await sharp(SRC)
      .extract({ left, top: 0, width: extractWidth, height })
      .toFile(outPath);

    console.log(`Salvato ${outPath} (${extractWidth}x${height})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
