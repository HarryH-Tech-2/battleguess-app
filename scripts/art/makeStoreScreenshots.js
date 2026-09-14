// Composites Play Store screenshots (1080x1920) and a feature graphic (1024x500)
// from real device captures in store/screens-raw over the app's own battle art.
// Run: node scripts/art/makeStoreScreenshots.js
const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');
const opentype = require('opentype.js');

const root = path.join(__dirname, '..', '..');
const fontDir = path.join(root, 'node_modules', '@expo-google-fonts');
// node-canvas cannot register fonts on this Windows build, so text is drawn as
// vector outlines through opentype.js instead. Same faces the app uses.
function loadFont(file) {
  const buf = fs.readFileSync(file);
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}

const FONT = {
  cinzelBold: loadFont(path.join(fontDir, 'cinzel', '700Bold', 'Cinzel_700Bold.ttf')),
  cinzelBlack: loadFont(path.join(fontDir, 'cinzel', '900Black', 'Cinzel_900Black.ttf')),
  nunitoSemi: loadFont(path.join(fontDir, 'nunito', '600SemiBold', 'Nunito_600SemiBold.ttf')),
  nunitoXBold: loadFont(path.join(fontDir, 'nunito', '800ExtraBold', 'Nunito_800ExtraBold.ttf')),
};

function textWidth(font, text, size, letterSpacing = 0) {
  return font.getAdvanceWidth(text, size) + letterSpacing * Math.max(0, text.length - 1);
}

/** Fill text as outlines. x is the left edge, center, or right edge depending on align. */
function fillText(ctx, font, text, x, y, size, { align = 'left', letterSpacing = 0 } = {}) {
  const w = textWidth(font, text, size, letterSpacing);
  let cx = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  ctx.beginPath();
  if (letterSpacing) {
    for (const ch of text) {
      tracePath(ctx, font.getPath(ch, cx, y, size));
      cx += font.getAdvanceWidth(ch, size) + letterSpacing;
    }
  } else {
    tracePath(ctx, font.getPath(text, cx, y, size));
  }
  ctx.fill();
}

function tracePath(ctx, p) {
  for (const c of p.commands) {
    if (c.type === 'M') ctx.moveTo(c.x, c.y);
    else if (c.type === 'L') ctx.lineTo(c.x, c.y);
    else if (c.type === 'C') ctx.bezierCurveTo(c.x1, c.y1, c.x2, c.y2, c.x, c.y);
    else if (c.type === 'Q') ctx.quadraticCurveTo(c.x1, c.y1, c.x, c.y);
    else if (c.type === 'Z') ctx.closePath();
  }
}

const C = {
  ink: '#0F1420',
  inkDeep: '#0A0E17',
  parchment: '#F4E8CF',
  brass: '#D9A441',
  brassLight: '#F2C76B',
  ember: '#F2622D',
};

const W = 1080;
const H = 1920;

// Raw captures are 1080x2340 with a 100px status bar and a nav bar from y=2205.
const RAW = { x: 0, y: 100, w: 1080, h: 2105 };

const SHOTS = [
  {
    out: '01-campaign.png',
    raw: 'learn-map.png',
    art: 'thermopylae.jpg',
    eyebrow: 'Campaign map',
    title: ['History, one', 'battle at a time'],
    sub: '67 battles to master, from Marathon to D-Day.',
    tilt: -4,
  },
  {
    out: '02-answer.png',
    raw: 'correct-sheet.png',
    art: 'marathon.jpg',
    eyebrow: 'Lessons',
    title: ['Seven ways', 'to answer'],
    sub: 'Multiple choice, map taps, timelines, ordering, matching and more.',
    tilt: 2,
    // Keep the whole feedback sheet in frame: smaller device, fully on canvas.
    width: 720,
    cy: 1290,
  },
  {
    out: '03-map.png',
    raw: 'map-tap.png',
    art: 'hastings.jpg',
    eyebrow: 'Find the place',
    title: ['Pin the', 'battlefield'],
    sub: 'Tap the region where history was made.',
    tilt: -3,
  },
  {
    out: '04-timeline.png',
    raw: 'timeline.png',
    art: 'waterloo.jpg',
    eyebrow: 'Timeline',
    title: ['Nail the', 'exact year'],
    sub: 'Slide through the centuries to the year.',
    tilt: 3,
  },
  {
    out: '05-victory.png',
    raw: 'victory.png',
    art: 'dday.jpg',
    eyebrow: 'Progress',
    title: ['Earn XP.', 'Climb the ranks.'],
    sub: 'Streaks, combos and daily quests keep the campaign moving.',
    tilt: -4,
  },
  {
    out: '06-codex.png',
    raw: 'codex.png',
    art: 'cannae.jpg',
    eyebrow: 'Codex',
    title: ['Build your', 'Codex'],
    sub: 'Every battle you master joins your collection.',
    tilt: 3,
  },
];

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCover(ctx, img, x, y, w, h, focusY = 0.5) {
  const s = Math.max(w / img.width, h / img.height);
  const dw = img.width * s;
  const dh = img.height * s;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) * focusY, dw, dh);
}

function drawBackground(ctx, art, w, h) {
  ctx.fillStyle = C.ink;
  ctx.fillRect(0, 0, w, h);
  drawCover(ctx, art, 0, 0, w, h, 0.35);
  // Ink veil so the painting reads as atmosphere and the type stays legible.
  const veil = ctx.createLinearGradient(0, 0, 0, h);
  veil.addColorStop(0, 'rgba(15,20,32,0.86)');
  veil.addColorStop(0.42, 'rgba(15,20,32,0.72)');
  veil.addColorStop(1, 'rgba(10,14,23,0.97)');
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, w, h);
  // Fine topographic-style contour lines, echoing the app's map background.
  ctx.save();
  ctx.strokeStyle = 'rgba(217,164,65,0.10)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    const y0 = 120 + i * 210;
    ctx.moveTo(-40, y0);
    for (let x = 0; x <= w + 40; x += 40) {
      const y = y0 + Math.sin((x + i * 90) / 160) * 26 + Math.cos((x - i * 40) / 95) * 12;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawBrassRule(ctx, cx, y, width) {
  const g = ctx.createLinearGradient(cx - width / 2, 0, cx + width / 2, 0);
  g.addColorStop(0, 'rgba(217,164,65,0)');
  g.addColorStop(0.5, C.brassLight);
  g.addColorStop(1, 'rgba(217,164,65,0)');
  ctx.fillStyle = g;
  ctx.fillRect(cx - width / 2, y, width, 3);
  ctx.fillStyle = C.brassLight;
  ctx.beginPath();
  ctx.moveTo(cx, y - 7);
  ctx.lineTo(cx + 8, y + 1.5);
  ctx.lineTo(cx, y + 10);
  ctx.lineTo(cx - 8, y + 1.5);
  ctx.closePath();
  ctx.fill();
}

function drawHeadline(ctx, shot) {
  // Eyebrow: small brass caps with tracking.
  ctx.fillStyle = C.brass;
  fillText(ctx, FONT.nunitoXBold, shot.eyebrow.toUpperCase(), W / 2, 168, 28, { align: 'center', letterSpacing: 5 });
  drawBrassRule(ctx, W / 2, 196, 260);

  // Title: Cinzel, two lines, warm gold with a deep shadow so it sits in the paint.
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 6;
  const grad = ctx.createLinearGradient(0, 240, 0, 480);
  grad.addColorStop(0, '#FBE3A4');
  grad.addColorStop(0.55, C.brassLight);
  grad.addColorStop(1, C.brass);
  ctx.fillStyle = grad;
  const titleSize = Math.min(100, ...shot.title.map((t) => (100 * 960) / textWidth(FONT.cinzelBold, t, 100)));
  fillText(ctx, FONT.cinzelBold, shot.title[0], W / 2, 330, titleSize, { align: 'center' });
  fillText(ctx, FONT.cinzelBold, shot.title[1], W / 2, 452, titleSize, { align: 'center' });
  ctx.shadowColor = 'transparent';

  // Sub: parchment Nunito, wrapped.
  ctx.fillStyle = C.parchment;
  const subSize = 38;
  const words = shot.sub.split(' ');
  const lines = [];
  let line = '';
  for (const wd of words) {
    const test = line ? `${line} ${wd}` : wd;
    if (textWidth(FONT.nunitoSemi, test, subSize) > 900 && line) {
      lines.push(line);
      line = wd;
    } else line = test;
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => fillText(ctx, FONT.nunitoSemi, l, W / 2, 530 + i * 50, subSize, { align: 'center' }));
}

function drawPhone(ctx, screen, opts) {
  const { cx, cy, width, tilt } = opts;
  const bezel = 22;
  const screenW = width - bezel * 2;
  const screenH = screenW * (RAW.h / RAW.w);
  const frameH = screenH + bezel * 2;
  const r = 96;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((tilt * Math.PI) / 180);

  // Glow behind the device.
  const glow = ctx.createRadialGradient(0, -frameH * 0.1, 40, 0, -frameH * 0.1, width * 1.05);
  glow.addColorStop(0, 'rgba(242,199,107,0.28)');
  glow.addColorStop(1, 'rgba(242,199,107,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(-width * 1.4, -frameH, width * 2.8, frameH * 2);

  // Frame with drop shadow.
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 70;
  ctx.shadowOffsetY = 40;
  roundRect(ctx, -width / 2, -frameH / 2, width, frameH, r);
  ctx.fillStyle = C.inkDeep;
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // Brass hairline on the frame edge.
  roundRect(ctx, -width / 2 + 2, -frameH / 2 + 2, width - 4, frameH - 4, r - 2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(217,164,65,0.55)';
  ctx.stroke();

  // Screen.
  ctx.save();
  roundRect(ctx, -screenW / 2, -screenH / 2, screenW, screenH, r - bezel);
  ctx.clip();
  ctx.drawImage(screen, RAW.x, RAW.y, RAW.w, RAW.h, -screenW / 2, -screenH / 2, screenW, screenH);
  ctx.restore();

  // Soft glass highlight along the top-left edge.
  const gloss = ctx.createLinearGradient(-width / 2, -frameH / 2, width / 2, frameH / 2);
  gloss.addColorStop(0, 'rgba(255,255,255,0.10)');
  gloss.addColorStop(0.35, 'rgba(255,255,255,0)');
  ctx.fillStyle = gloss;
  roundRect(ctx, -screenW / 2, -screenH / 2, screenW, screenH, r - bezel);
  ctx.fill();

  ctx.restore();
}

async function makeShot(shot) {
  const art = await loadImage(path.join(root, 'assets', 'images', 'battles', shot.art));
  const screen = await loadImage(path.join(root, 'store', 'screens-raw', shot.raw));
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  drawBackground(ctx, art, W, H);
  drawHeadline(ctx, shot);
  // The device runs off the bottom edge so the composition feels in motion.
  drawPhone(ctx, screen, { cx: W / 2, cy: shot.cy ?? 1560, width: shot.width ?? 860, tilt: shot.tilt });
  fs.writeFileSync(path.join(root, 'store', 'screenshots', shot.out), canvas.toBuffer('image/png'));
  console.log('wrote', shot.out);
}

async function makeFeatureGraphic() {
  const FW = 1024;
  const FH = 500;
  // Painted key art (2048x1152): burning helmet at left, sunset battlefield, open sky right.
  const art = await loadImage(path.join(root, 'store', 'key-art.png'));
  const canvas = createCanvas(FW, FH);
  const ctx = canvas.getContext('2d');

  // Crop a 2.048:1 band out of the 16:9 painting, biased toward the helmet and horizon.
  const bandH = art.width / (FW / FH);
  const bandY = Math.round((art.height - bandH) * 0.42);
  ctx.drawImage(art, 0, bandY, art.width, bandH, 0, 0, FW, FH);

  // Darken the right half so gold type reads over the bright sky.
  const veil = ctx.createLinearGradient(FW * 0.38, 0, FW, 0);
  veil.addColorStop(0, 'rgba(10,14,23,0)');
  veil.addColorStop(0.45, 'rgba(10,14,23,0.55)');
  veil.addColorStop(1, 'rgba(10,14,23,0.7)');
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, FW, FH);
  const bottom = ctx.createLinearGradient(0, FH * 0.55, 0, FH);
  bottom.addColorStop(0, 'rgba(10,14,23,0)');
  bottom.addColorStop(1, 'rgba(10,14,23,0.55)');
  ctx.fillStyle = bottom;
  ctx.fillRect(0, 0, FW, FH);

  // Drifting embers.
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 90; i++) {
    const x = rnd() * FW;
    const y = rnd() * FH;
    const r = 0.8 + rnd() * 2.2;
    ctx.fillStyle = `rgba(255,${160 + Math.round(rnd() * 70)},60,${0.35 + rnd() * 0.5})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Wordmark, right-aligned in the open sky.
  const right = FW - 52;
  ctx.shadowColor = 'rgba(0,0,0,0.75)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 6;
  const grad = ctx.createLinearGradient(0, 150, 0, 260);
  grad.addColorStop(0, '#FFF1C2');
  grad.addColorStop(0.5, C.brassLight);
  grad.addColorStop(1, C.brass);
  ctx.fillStyle = grad;
  fillText(ctx, FONT.cinzelBlack, 'BattleGuess', right, 250, 86, { align: 'right' });
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = C.parchment;
  fillText(ctx, FONT.nunitoSemi, 'Learn history one battle at a time.', right, 306, 32, { align: 'right' });
  ctx.shadowColor = 'transparent';
  drawBrassRule(ctx, right - 150, 338, 300);
  ctx.fillStyle = C.brassLight;
  const stats = '67 BATTLES   ·   7 QUESTION TYPES   ·   DAILY QUESTS';
  fillText(ctx, FONT.nunitoXBold, stats, right, 384, 19, { align: 'right', letterSpacing: 1.5 });

  fs.writeFileSync(path.join(root, 'store', 'feature-graphic.png'), canvas.toBuffer('image/png'));
  console.log('wrote feature-graphic.png');
}

async function main() {
  for (const shot of SHOTS) await makeShot(shot);
  await makeFeatureGraphic();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
