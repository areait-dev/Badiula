// Splits public/images/Screenshot 2026-07-10 150336.png (5 Badiula marmellate/confetture
// jars in a row) into 5 individual images.
//
// Boundaries were NOT divided equally: the jars in the source photo are unevenly spaced,
// so the x-ranges below were measured by scanning a horizontal pixel row and detecting the
// white-background/colored-label transitions, then taking the midpoint between each pair of
// labels as the cut line. Equal-width slicing (like scripts/crop-barattoli.js) would have
// cut into the neighboring jar's label on this particular photo.
//
// Usage: node scripts/crop-marmellate.js

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'public', 'images', 'Screenshot 2026-07-10 150336.png');
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'luce-di-terra');

// [left, right) in source pixels, measured on the 695x144 screenshot.
const JARS = [
  { name: 'siciliano-pesto',           left: 0,   right: 136 },
  { name: 'pomodori-secchi-pesto',     left: 136, right: 272 },
  { name: 'peperoncini-confettura',    left: 272, right: 404 },
  { name: 'fichi-dindia-confettura',   left: 404, right: 538 },
  { name: 'limoni-verdelli-marmellata',left: 538, right: 695 },
];

async function main() {
  const { width, height } = await sharp(SRC).metadata();
  if (!width || !height) throw new Error(`Impossibile leggere le dimensioni di ${SRC}`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (let i = 0; i < JARS.length; i++) {
    const { name, left, right } = JARS[i];
    const extractWidth = Math.min(right, width) - left;

    const outPath = path.join(OUT_DIR, `barattolo-${i + 1}-${name}.png`);
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
