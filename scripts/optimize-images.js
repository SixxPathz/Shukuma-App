#!/usr/bin/env node
/*
 * Optimize images in public/Shukuma Cards_Full Deck
 * - Generates webp variants for each jpg/png with -sm, -md, -lg suffixes
 * - Uses sharp for conversions
 */
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.join(__dirname, '..', 'public', 'Shukuma Cards_Full Deck');

const sizes = [
  { suffix: '-sm', width: 320 },
  { suffix: '-md', width: 640 },
  { suffix: '-lg', width: 1080 }
];

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const fileDir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);

  for (const size of sizes) {
    const destName = `${baseName}${size.suffix}.webp`;
    const destPath = path.join(fileDir, destName);
    try {
      await sharp(filePath)
        .resize({ width: size.width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(destPath);
      console.log(`Written ${destPath}`);
    } catch (err) {
      console.error(`Failed to write ${destPath}:`, err.message);
    }
  }
}

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.isFile()) {
      optimizeFile(fullPath);
    }
  }
}

console.log('Starting image optimization...');
walkDir(SOURCE_DIR);
console.log('Done.');
