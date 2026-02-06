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

// Battle data - subset for generation
const battles = [
  { id: 'thermopylae', title: 'Battle of Thermopylae' },
  { id: 'marathon', title: 'Battle of Marathon' },
  { id: 'hastings', title: 'Battle of Hastings' },
  { id: 'agincourt', title: 'Battle of Agincourt' },
  { id: 'waterloo', title: 'Battle of Waterloo' },
  { id: 'austerlitz', title: 'Battle of Austerlitz' },
  { id: 'stalingrad', title: 'Battle of Stalingrad' },
  { id: 'dday', title: 'D-Day Normandy' },
  { id: 'gettysburg', title: 'Battle of Gettysburg' },
  { id: 'sekigahara', title: 'Battle of Sekigahara' },
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

    console.log(`No image in response for ${battleId}:`, JSON.stringify(data, null, 2));
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

  for (const battle of battles) {
    const outputPath = path.join(outputDir, `${battle.id}.png`);

    // Skip if already exists
    if (fs.existsSync(outputPath)) {
      console.log(`Skipping ${battle.id} - already exists`);
      continue;
    }

    console.log(`Generating image for: ${battle.title}...`);

    const imageBuffer = await generateBattleImage(battle.title, battle.id);

    if (imageBuffer) {
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`✓ Saved: ${battle.id}.png`);
    } else {
      console.log(`✗ Failed: ${battle.id}`);
    }

    // Rate limiting - wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('Done!');
}

main().catch(console.error);
