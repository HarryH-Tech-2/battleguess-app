#!/usr/bin/env node
/**
 * Generate civilization images for the Learn screen unit nodes via Gemini API.
 *
 * Usage:
 *   GEMINI_API_KEY=your_key node scripts/generate-civ-images.js
 *
 * Notes:
 *   - The API key is read from the GEMINI_API_KEY environment variable and is
 *     NOT stored in this script or anywhere else on disk.
 *   - Existing images at the target path are skipped (delete the file to regen).
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('GEMINI_API_KEY env var not set. Aborting.');
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, '..', 'assets', 'images', 'civs');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Each entry: { id, prompt }. Prompts target a small circular icon with a
// distinct civ/era look — works well behind a padlock overlay when locked.
const UNITS = [
  { id: 'ancient-beginnings', prompt: 'Ancient Greek hoplite helmet with red plume, side profile, isometric 3D cartoon icon, warm bronze tones, simple background, clean illustration.' },
  { id: 'medieval-clashes', prompt: 'Medieval European knight helmet with visor and crossed swords, isometric 3D cartoon icon, silver and crimson, simple background, clean illustration.' },
  { id: 'napoleonic-era', prompt: 'Napoleonic French bicorne hat with gold trim and tricolor cockade, isometric 3D cartoon icon, royal blue and gold, simple background, clean illustration.' },
  { id: 'great-war', prompt: 'WWI British Brodie helmet over a barbed wire trench silhouette, isometric 3D cartoon icon, muted olive and brown, simple background, clean illustration.' },
  { id: 'world-war-2', prompt: 'WWII fighter plane and tank silhouette badge, isometric 3D cartoon icon, steel grey and olive green, simple background, clean illustration.' },
  { id: 'ancient-asia', prompt: 'Ancient Chinese warrior with dao sword and dragon motif, isometric 3D cartoon icon, jade green and gold, simple background, clean illustration.' },
  { id: 'mongol-conquests', prompt: 'Mongol horseback archer with composite bow, isometric 3D cartoon icon, leather brown and steppe gold, simple background, clean illustration.' },
  { id: 'samurai-era', prompt: 'Japanese samurai kabuto helmet with horn ornament, isometric 3D cartoon icon, lacquered black and red, simple background, clean illustration.' },
  { id: 'pacific-theater', prompt: 'WWII Pacific carrier plane over ocean waves, isometric 3D cartoon icon, navy blue and white, simple background, clean illustration.' },
  { id: 'ancient-africa', prompt: 'Ancient Egyptian pharaoh khopesh sword crossed with a Carthaginian shield, isometric 3D cartoon icon, sandstone and turquoise, simple background, clean illustration.' },
  { id: 'colonial-resistance', prompt: 'African Zulu warrior with iklwa spear and isihlangu shield, isometric 3D cartoon icon, earthy ochre and black, simple background, clean illustration.' },
  { id: 'north-africa-ww2', prompt: 'WWII desert tank with palm silhouette and sand dunes, isometric 3D cartoon icon, tan and dusty orange, simple background, clean illustration.' },
  { id: 'american-revolution', prompt: 'American Revolutionary tricorne hat with crossed muskets and 13-star flag, isometric 3D cartoon icon, navy blue and white, simple background, clean illustration.' },
  { id: 'american-civil-war', prompt: 'American Civil War kepi cap with Union eagle, isometric 3D cartoon icon, navy blue and brass, simple background, clean illustration.' },
  { id: 'latin-american-wars', prompt: 'Latin American revolutionary with bicorne hat and saber over Andes peaks, isometric 3D cartoon icon, sun gold and earthy red, simple background, clean illustration.' },
  { id: 'roman-empire', prompt: 'Roman legionary galea helmet with red crest, isometric 3D cartoon icon, polished bronze and crimson, simple background, clean illustration.' },
  { id: 'crusades', prompt: 'Crusader knight helmet with white surcoat and red cross, isometric 3D cartoon icon, white and crimson, simple background, clean illustration.' },
  { id: 'naval-supremacy', prompt: 'Tall sailing warship with cannons and billowing sails, isometric 3D cartoon icon, ocean blue and weathered wood, simple background, clean illustration.' },
  { id: 'indian-subcontinent', prompt: 'Mughal war elephant with armored howdah and curved tulwar sword, isometric 3D cartoon icon, saffron and emerald, simple background, clean illustration.' },
  { id: 'korean-glory', prompt: 'Korean turtle ship (geobukseon) with iron spikes and dragon head, isometric 3D cartoon icon, dark teal and gold, simple background, clean illustration.' },
  { id: 'african-resistance', prompt: 'Mahdist warrior with crescent banner and curved sword, isometric 3D cartoon icon, desert sand and deep crimson, simple background, clean illustration.' },
  { id: 'conquest-of-americas', prompt: 'Aztec eagle warrior headdress crossed with a Spanish conquistador morion helmet, isometric 3D cartoon icon, jade green and steel grey, simple background, clean illustration.' },
  { id: 'modern-americas', prompt: 'Modern 20th-century soldier helmet with crossed rifles, isometric 3D cartoon icon, olive drab and silver, simple background, clean illustration.' },
];

const MODEL = 'gemini-2.5-flash-image';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

async function generateOne(unit) {
  const outPath = path.join(OUT_DIR, `${unit.id}.png`);
  if (fs.existsSync(outPath)) {
    console.log(`SKIP ${unit.id} (already exists)`);
    return;
  }

  const body = {
    contents: [{ parts: [{ text: unit.prompt }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  };

  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`FAIL ${unit.id}: HTTP ${res.status} ${errText.slice(0, 300)}`);
    return;
  }

  const json = await res.json();
  const parts = json?.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p) => p.inlineData && p.inlineData.data);
  if (!imgPart) {
    console.error(`FAIL ${unit.id}: no image in response (${JSON.stringify(json).slice(0, 200)})`);
    return;
  }

  const buf = Buffer.from(imgPart.inlineData.data, 'base64');
  fs.writeFileSync(outPath, buf);
  console.log(`OK   ${unit.id} -> ${outPath} (${buf.length} bytes)`);
}

(async () => {
  for (const unit of UNITS) {
    try {
      await generateOne(unit);
    } catch (e) {
      console.error(`ERR  ${unit.id}: ${e.message}`);
    }
    // Tiny pacing to be polite to the API
    await new Promise((r) => setTimeout(r, 500));
  }
})();
