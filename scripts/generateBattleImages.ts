/**
 * Script to generate battle images using Gemini API
 * Run with: npx ts-node scripts/generateBattleImages.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GEMINI_API_KEY = 'REDACTED_GEMINI_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent';

// All battles from the app
const battles = [
  { id: 'thermopylae', title: 'Battle of Thermopylae' },
  { id: 'marathon', title: 'Battle of Marathon' },
  { id: 'hastings', title: 'Battle of Hastings' },
  { id: 'agincourt', title: 'Battle of Agincourt' },
  { id: 'waterloo', title: 'Battle of Waterloo' },
  { id: 'austerlitz', title: 'Battle of Austerlitz' },
  { id: 'somme', title: 'Battle of the Somme' },
  { id: 'stalingrad', title: 'Battle of Stalingrad' },
  { id: 'dday', title: 'D-Day Normandy Landings' },
  { id: 'gettysburg', title: 'Battle of Gettysburg' },
  { id: 'yorktown', title: 'Siege of Yorktown' },
  { id: 'alamo', title: 'Battle of the Alamo' },
  { id: 'puebla', title: 'Battle of Puebla' },
  { id: 'ayacucho', title: 'Battle of Ayacucho' },
  { id: 'gaugamela', title: 'Battle of Gaugamela' },
  { id: 'sekigahara', title: 'Battle of Sekigahara' },
  { id: 'red-cliffs', title: 'Battle of Red Cliffs' },
  { id: 'panipat-first', title: 'First Battle of Panipat' },
  { id: 'tsushima', title: 'Battle of Tsushima' },
  { id: 'midway', title: 'Battle of Midway' },
  { id: 'zama', title: 'Battle of Zama' },
  { id: 'el-alamein', title: 'Battle of El Alamein' },
  { id: 'isandlwana', title: 'Battle of Isandlwana' },
  { id: 'adwa', title: 'Battle of Adwa' },
  { id: 'cannae', title: 'Battle of Cannae' },
  { id: 'verdun', title: 'Battle of Verdun' },
  { id: 'kursk', title: 'Battle of Kursk' },
  { id: 'tours', title: 'Battle of Tours' },
  { id: 'gallipoli', title: 'Battle of Gallipoli' },
  { id: 'lepanto', title: 'Battle of Lepanto' },
  { id: 'borodino', title: 'Battle of Borodino' },
  { id: 'trafalgar', title: 'Battle of Trafalgar' },
  { id: 'vienna-1683', title: 'Battle of Vienna 1683' },
  { id: 'plassey', title: 'Battle of Plassey' },
  { id: 'singapore', title: 'Fall of Singapore' },
  { id: 'dien-bien-phu', title: 'Battle of Dien Bien Phu' },
  { id: 'changping', title: 'Battle of Changping' },
  { id: 'omdurman', title: 'Battle of Omdurman' },
  { id: 'carthage-destruction', title: 'Destruction of Carthage' },
  { id: 'tobruk', title: 'Siege of Tobruk' },
  { id: 'saratoga', title: 'Battle of Saratoga' },
  { id: 'chacabuco', title: 'Battle of Chacabuco' },
  { id: 'new-orleans', title: 'Battle of New Orleans' },
  { id: 'boyaca', title: 'Battle of Boyaca' },
  { id: 'rorkes-drift', title: 'Battle of Rorkes Drift' },
  { id: 'iwo-jima', title: 'Battle of Iwo Jima' },
  { id: 'marne', title: 'Battle of the Marne' },
  { id: 'passchendaele', title: 'Battle of Passchendaele' },
  { id: 'bulge', title: 'Battle of the Bulge' },
  { id: 'buena-vista', title: 'Battle of Buena Vista' },
  { id: 'talas', title: 'Battle of Talas' },
  { id: 'constantinople-1453', title: 'Fall of Constantinople' },
  { id: 'nagashino', title: 'Battle of Nagashino' },
  { id: 'myeongnyang', title: 'Battle of Myeongnyang' },
  { id: 'kohima', title: 'Battle of Kohima' },
  { id: 'bach-dang', title: 'Battle of Bach Dang' },
  { id: 'panipat-third', title: 'Third Battle of Panipat' },
  { id: 'pyramids', title: 'Battle of the Pyramids' },
  { id: 'khartoum', title: 'Siege of Khartoum' },
  { id: 'tangier', title: 'Battle of Tangier' },
  { id: 'kairouan', title: 'Battle of Kairouan' },
  { id: 'tenochtitlan', title: 'Fall of Tenochtitlan' },
  { id: 'cajamarca', title: 'Battle of Cajamarca' },
  { id: 'san-juan-hill', title: 'Battle of San Juan Hill' },
  { id: 'falklands', title: 'Falklands War' },
  { id: 'chapultepec', title: 'Battle of Chapultepec' },
  { id: 'carabobo', title: 'Battle of Carabobo' },
];

async function generateBattleImage(battleTitle: string, battleId: string): Promise<Buffer | null> {
  try {
    const prompt = `Create a dramatic, historically-inspired illustration of the ${battleTitle}. Style: Epic historical painting style, dramatic lighting, no text or labels. Focus on the battle scene with soldiers, weapons, and landscape appropriate to the era. Make it visually striking and educational. 16:9 aspect ratio.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"]
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error for ${battleId}:`, response.status, errorText);
      return null;
    }

    const data = await response.json();

    const candidates = data.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData?.mimeType?.startsWith('image/')) {
          const base64Image = part.inlineData.data;
          return Buffer.from(base64Image, 'base64');
        }
      }
    }

    console.log(`No image in response for ${battleId}`);
    return null;
  } catch (error) {
    console.error(`Error generating image for ${battleId}:`, error);
    return null;
  }
}

async function main() {
  const outputDir = path.join(__dirname, '..', 'assets', 'images', 'battles');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Starting battle image generation...');
  console.log(`Output directory: ${outputDir}`);
  console.log(`Total battles: ${battles.length}`);

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const battle of battles) {
    const outputPath = path.join(outputDir, `${battle.id}.png`);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`Skipping ${battle.id} - already exists`);
      skipped++;
      continue;
    }

    console.log(`Generating image for: ${battle.title}...`);

    const imageBuffer = await generateBattleImage(battle.title, battle.id);

    if (imageBuffer) {
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`✓ Saved: ${battle.id}.png`);
      generated++;
    } else {
      console.log(`✗ Failed: ${battle.id}`);
      failed++;
    }

    // Rate limiting - wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n--- Summary ---');
  console.log(`Generated: ${generated}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log('Done!');
}

main().catch(console.error);
