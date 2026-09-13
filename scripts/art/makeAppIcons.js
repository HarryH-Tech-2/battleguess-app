// Builds icon.png, adaptive-icon.png, splash-icon.png and favicon.png from the
// painted shield artwork. Run: node scripts/art/makeAppIcons.js
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

const INK = '#0F1420';
const root = path.join(__dirname, '..', '..');
const src = path.join(root, 'assets', 'images', 'art', 'app-icon-source.png');
const out = (f) => path.join(root, 'assets', 'images', f);

async function main() {
  const img = await loadImage(src);

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
