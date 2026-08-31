// Removes a near-white/gray background from the 5 cropped jar images (produced by
// scripts/crop-marmellate.js), turning it transparent so only the jar is visible.
//
// This is a color-threshold ("chroma key") removal, not AI segmentation — no ML
// background-removal library is installed in this project. It works well for a flat
// white/light-gray backdrop (like the tablecloth in the source photo) but CANNOT tell
// "the product jar" apart from other non-white objects in frame (e.g. the blurred jars
// visible at the top edge of some crops) — those will stay opaque. Best used on crops
// where the jar is the only non-white subject.
//
// Usage: node scripts/remove-background.js

const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const DIR = path.join(__dirname, '..', 'public', 'images', 'luce-di-terra');

const FILES = [
  'barattolo-1-siciliano-pesto.png',
  'barattolo-2-pomodori-secchi-pesto.png',
  'barattolo-3-peperoncini-confettura.png',
  'barattolo-4-fichi-dindia-confettura.png',
  'barattolo-5-limoni-verdelli-marmellata.png',
];

// Soft-threshold band: pixels whiter than WHITE_HIGH become fully transparent,
// pixels darker than WHITE_LOW stay fully opaque, in between fades linearly
// (keeps edges antialiased instead of jagged).
const WHITE_LOW = 195;
const WHITE_HIGH = 235;
const MAX_SATURATION = 30; // max/min channel gap allowed to still count as "grayish"

function alphaFor(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max - min;
  if (saturation > MAX_SATURATION) return 255; // clearly colored → keep opaque

  const whiteness = (r + g + b) / 3;
  if (whiteness >= WHITE_HIGH) return 0;
  if (whiteness <= WHITE_LOW) return 255;
  const t = (whiteness - WHITE_LOW) / (WHITE_HIGH - WHITE_LOW);
  return Math.round(255 * (1 - t));
}

async function processFile(fileName) {
  const filePath = path.join(DIR, fileName);
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  for (let i = 0; i < width * height; i++) {
    const idx = i * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    data[idx + 3] = alphaFor(r, g, b);
  }

  const outName = fileName.replace(/\.png$/, '-cutout.png');
  const outPath = path.join(DIR, outName);
  await sharp(data, { raw: { width, height, channels } }).png().toFile(outPath);
  console.log(`Salvato ${outPath}`);
}

async function main() {
  for (const file of FILES) {
    await processFile(file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
