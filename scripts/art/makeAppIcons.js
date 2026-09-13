// Builds icon.png, adaptive-icon.png, splash-icon.png and favicon.png from the
// painted shield artwork. Run: node scripts/art/makeAppIcons.js
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const root = path.join(__dirname, '..', '..');
const src = path.join(root, 'assets', 'images', 'art', 'app-icon-source.png');
const out = (f) => path.join(root, 'assets', 'images', f);

// The padded icons fill their margins with the artwork's own background colour,
// sampled from the corners, so no square edge shows around the artwork.
function sampleBackground(img) {
  const c = createCanvas(img.width, img.height);
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const pts = [
    [4, 4],
    [img.width - 5, 4],
    [4, img.height - 5],
    [img.width - 5, img.height - 5],
  ];
  const sum = [0, 0, 0];
  for (const [x, y] of pts) {
    const d = ctx.getImageData(x, y, 1, 1).data;
    sum[0] += d[0];
    sum[1] += d[1];
    sum[2] += d[2];
  }
  const hex = (n) => Math.round(n / pts.length).toString(16).padStart(2, '0');
  return `#${hex(sum[0])}${hex(sum[1])}${hex(sum[2])}`;
}

async function main() {
  const img = await loadImage(src);
  const INK = sampleBackground(img);
  console.log('background', INK, '- use this for splash/adaptive backgroundColor in app.config.ts');

  // icon.png: square, artwork fills the frame with a subtle vignette.
  const icon = createCanvas(1024, 1024);
  let ctx = icon.getContext('2d');
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, 1024, 1024);
  ctx.drawImage(img, 0, 0, 1024, 1024);
  fs.writeFileSync(out('icon.png'), icon.toBuffer('image/png'));

  // adaptive-icon.png: artwork scaled into the safe zone (66%) over ink.
  const adaptive = createCanvas(1024, 1024);
  ctx = adaptive.getContext('2d');
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, 1024, 1024);
  const s = 1024 * 0.78;
  ctx.drawImage(img, (1024 - s) / 2, (1024 - s) / 2, s, s);
  // Feather the artwork's square edge into the fill so the vignette never shows
  // as a hard square under Android's circular / squircle masks.
  const feather = ctx.createRadialGradient(512, 512, 350, 512, 512, 430);
  feather.addColorStop(0, `${INK}00`);
  feather.addColorStop(1, `${INK}ff`);
  ctx.fillStyle = feather;
  ctx.fillRect(0, 0, 1024, 1024);
  fs.writeFileSync(out('adaptive-icon.png'), adaptive.toBuffer('image/png'));

  // splash-icon.png: same as adaptive, shown centered on the ink splash.
  fs.writeFileSync(out('splash-icon.png'), adaptive.toBuffer('image/png'));

  // favicon.png: small.
  const fav = createCanvas(196, 196);
  ctx = fav.getContext('2d');
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, 196, 196);
  ctx.drawImage(img, 0, 0, 196, 196);
  fs.writeFileSync(out('favicon.png'), fav.toBuffer('image/png'));
  console.log('icons written');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
