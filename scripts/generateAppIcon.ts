/**
 * Script to generate BattleGuess app icon programmatically
 * Flat crossed swords on orange circle — matching reference style
 * Run with: npx tsx scripts/generateAppIcon.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SIZE = 1024;
const ORANGE = '#FF9500';

function generateIcon(): Buffer {
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');

  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const circleRadius = 420;

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Orange circle
  ctx.fillStyle = ORANGE;
  ctx.beginPath();
  ctx.arc(cx, cy, circleRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw crossed swords in white
  ctx.strokeStyle = '#FFFFFF';
  ctx.fillStyle = '#FFFFFF';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  function drawSword(angle: number) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    const bladeWidth = 38;
    const bladeHalf = bladeWidth / 2;
    const bladeTop = -300;
    const bladeBottom = 40;
    const tipLength = 50;
    const guardWidth = 120;
    const guardHeight = 30;
    const guardTop = bladeBottom;
    const gripWidth = 28;
    const gripHalf = gripWidth / 2;
    const gripTop = guardTop + guardHeight;
    const gripBottom = gripTop + 110;
    const pommelRadius = 26;

    // Blade body
    ctx.beginPath();
    ctx.moveTo(-bladeHalf, bladeBottom);
    ctx.lineTo(-bladeHalf, bladeTop);
    ctx.lineTo(0, bladeTop - tipLength);
    ctx.lineTo(bladeHalf, bladeTop);
    ctx.lineTo(bladeHalf, bladeBottom);
    ctx.closePath();
    ctx.fill();

    // Cross-guard (rounded rectangle)
    ctx.beginPath();
    ctx.roundRect(-guardWidth / 2, guardTop, guardWidth, guardHeight, 8);
    ctx.fill();

    // Grip
    ctx.beginPath();
    ctx.roundRect(-gripHalf, gripTop, gripWidth, gripBottom - gripTop, 4);
    ctx.fill();

    // Pommel
    ctx.beginPath();
    ctx.arc(0, gripBottom + pommelRadius - 2, pommelRadius, 0, Math.PI * 2);
    ctx.fill();

    // Blade center line (ridge) — subtle darker line
    ctx.strokeStyle = 'rgba(255, 149, 0, 0.25)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, bladeTop + 20);
    ctx.lineTo(0, bladeBottom - 5);
    ctx.stroke();

    // Reset stroke color
    ctx.strokeStyle = '#FFFFFF';

    ctx.restore();
  }

  // Two swords crossed at ~45 degrees
  drawSword(-Math.PI / 4.5);
  drawSword(Math.PI / 4.5);

  return canvas.toBuffer('image/png');
}

function main() {
  const outputDir = path.join(__dirname, '..', 'assets', 'images');

  console.log('Generating BattleGuess app icon (flat crossed swords)...');

  const imageBuffer = generateIcon();

  const iconFiles = ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'];

  for (const file of iconFiles) {
    const outputPath = path.join(outputDir, file);
    fs.writeFileSync(outputPath, imageBuffer);
    console.log(`Saved: ${file}`);
  }

  console.log('Done! All icon files updated.');
}

main();
