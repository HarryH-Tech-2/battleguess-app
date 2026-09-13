/**
 * Downloads finished Higgsfield jobs (results.json: { index: url }) and writes
 * downscaled JPEGs into assets/images/{battles,emblems,mascots,art}.
 * Run: npx tsx scripts/art/downloadAndResize.ts [index ...]
 */
import * as fs from 'fs';
import * as path from 'path';
import { createCanvas, loadImage } from 'canvas';
import prompts from './prompts.json';

const root = path.join(__dirname, '..', '..');
const results: Record<string, string> = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'results.json'), 'utf8')
);

type Target = { file: string; width: number; height: number; quality: number };

function targetFor(index: number): Target | null {
  if (index < 100) {
    const b = prompts.battles[index];
    return b ? { file: `assets/images/battles/${b.id}.jpg`, width: 1280, height: 720, quality: 0.82 } : null;
  }
  if (index < 200) {
    const e = prompts.emblems[index - 100];
    return e ? { file: `assets/images/emblems/${e.id}.jpg`, width: 512, height: 512, quality: 0.85 } : null;
  }
  if (index < 300) {
    const m = prompts.mascots[index - 200];
    return m ? { file: `assets/images/mascots/${m.id}.jpg`, width: 768, height: 768, quality: 0.85 } : null;
  }
  if (index === 300) return { file: 'assets/images/art/onboarding-hero.jpg', width: 900, height: 1600, quality: 0.82 };
  if (index === 301) return { file: 'assets/images/art/app-icon-source.png', width: 1024, height: 1024, quality: 1 };
  if (index === 302) return { file: 'assets/images/art/app-icon-source-2.png', width: 1024, height: 1024, quality: 1 };
  return null;
}

async function main() {
  const only = process.argv.slice(2).map(Number);
  let done = 0;
  for (const [key, url] of Object.entries(results)) {
    const index = Number(key);
    if (only.length && !only.includes(index)) continue;
    const t = targetFor(index);
    if (!t) {
      console.log('skip', index);
      continue;
    }
    const outPath = path.join(root, t.file);
    if (fs.existsSync(outPath) && !only.length) continue;
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    const res = await fetch(url);
    if (!res.ok) {
      console.log('download failed', index, res.status);
      continue;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const img = await loadImage(buf);
    const canvas = createCanvas(t.width, t.height);
    const ctx = canvas.getContext('2d');
    const scale = Math.max(t.width / img.width, t.height / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    ctx.drawImage(img, (t.width - w) / 2, (t.height - h) / 2, w, h);
    const out = t.file.endsWith('.png')
      ? canvas.toBuffer('image/png')
      : canvas.toBuffer('image/jpeg', { quality: t.quality, progressive: true });
    fs.writeFileSync(outPath, out);
    done++;
    console.log('saved', index, t.file, Math.round(out.length / 1024) + 'KB');
  }
  console.log('done', done);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
