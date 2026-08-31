// AI background removal (semantic segmentation, not color threshold) for the 5 cropped
// jar images produced by scripts/crop-marmellate.js. Unlike scripts/remove-background.js
// (chroma key), this isolates the jar itself even when other non-white objects (the
// blurred jars visible in some crops' corners) are in frame.
//
// First run downloads an ONNX segmentation model (~40-80MB) to a local cache — needs
// network access once.
//
// Usage: node scripts/remove-background-ai.js

const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');
const { removeBackground } = require('@imgly/background-removal-node');

const DIR = path.join(__dirname, '..', 'public', 'images', 'luce-di-terra');

const FILES = [
  'barattolo-1-siciliano-pesto.png',
  'barattolo-2-pomodori-secchi-pesto.png',
  'barattolo-3-peperoncini-confettura.png',
  'barattolo-4-fichi-dindia-confettura.png',
  'barattolo-5-limoni-verdelli-marmellata.png',
];

async function processFile(fileName) {
  const filePath = path.join(DIR, fileName);
  // Windows absolute paths (C:\...) get misread as a "c:" URI scheme by the
  // library's URL parsing — passing a proper file:// URL avoids that.
  const blob = await removeBackground(pathToFileURL(filePath).href);
  const buffer = Buffer.from(await blob.arrayBuffer());

  const outName = fileName.replace(/\.png$/, '-ai-cutout.png');
  const outPath = path.join(DIR, outName);
  fs.writeFileSync(outPath, buffer);
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
