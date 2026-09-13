import * as fs from 'fs';
import { battles } from '../../mocks/battles';
import { units } from '../../mocks/units';

const STYLE = 'Epic painterly digital matte painting, cinematic wide shot, premium strategy-game key art, bold confident brushwork, rich saturated palette with deep blues, crimson and brass gold, strong silhouettes, dramatic sky and atmospheric depth. No text, no letters, no watermark, no borders.';

const battlePrompts = battles.map(b => ({
  id: b.id,
  prompt: `${b.title}, ${b.date}, ${b.region}. ${b.sides.aName} versus ${b.sides.bName}. ${b.shortSummary} ${STYLE}`,
}));

const EMBLEM_SUBJECTS: Record<string, string> = {
  'ancient-beginnings': 'a Spartan hoplite bronze helmet with tall crimson crest and a round lambda shield',
  'medieval-clashes': 'a Norman kite shield with a longsword and a conical nasal helmet',
  'napoleonic-era': 'a French imperial eagle standard atop a brass pole with a bicorne hat and tricolour ribbons',
  'great-war': 'a WWI Brodie steel helmet resting on coiled barbed wire with a brass field whistle',
  'world-war-2': 'a WWII M1 steel helmet with a folded map and a brass compass',
  'ancient-asia': 'a Chinese Warring States bronze dragon-crest general helmet with a crossbow',
  'mongol-conquests': 'a Mongol composite recurve bow with a fur-trimmed steel helmet and horsetail banner',
  'samurai-era': 'a samurai kabuto helmet with golden crescent maedate crest and a katana',
  'pacific-theater': 'a navy aviator leather helmet with goggles beside a brass ship telegraph',
  'ancient-africa': 'an Egyptian pharaoh war crown khepresh with a Carthaginian elephant tusk ornament',
  'colonial-resistance': 'a Zulu cowhide shield with crossed iklwa spears and an Ethiopian lion crown',
  'north-africa-ww2': 'a desert-tan tank commander goggles and cap on a jerry can, sand-blasted',
  'american-revolution': 'a continental army tricorne hat with a fife and a brass drum',
  'american-civil-war': 'a Union kepi cap with a bugle and crossed cavalry sabres',
  'latin-american-wars': 'a liberator bicorne with a curved sabre and a laurel wreath',
  'roman-empire': 'a Roman legionary galea helmet with crimson crest and an SPQR eagle aquila standard',
  'crusades': 'a crusader great helm with a red cross tabard and a longsword',
  'naval-supremacy': 'a brass ship wheel with a naval officer bicorne and an anchor',
  'indian-subcontinent': 'a Mughal steel helmet with a war elephant headdress and a curved talwar',
  'korean-glory': 'a Korean turtle ship geobukseon in miniature with a general helmet and dragon head',
  'african-resistance': 'a Mahdist patched jibba banner with a curved sword and a leather shield',
  'conquest-of-americas': 'an Aztec eagle warrior helmet with a Spanish morion helmet and obsidian macuahuitl',
  'modern-americas': 'a Rough Riders campaign hat with a Krag rifle and a brass bugle',
};

const emblemPrompts = units.map(u => ({
  id: u.id,
  prompt: `Game emblem icon: ${EMBLEM_SUBJECTS[u.id]}, rendered in polished brass and dark steel with painterly stylized shading, centered, slight three-quarter view, soft warm rim light, on a plain deep navy background. Premium mobile game UI icon, clean silhouette, no text, no letters, no frame.`,
}));

const MASCOTS: Record<string, string> = {
  caesar: 'Julius Caesar: bust shot, laurel wreath, crimson cloak over a brass muscled cuirass, confident slight smile',
  napoleon: 'Napoleon Bonaparte: bust shot, bicorne hat, dark blue coat with gold epaulettes, confident slight smile',
  suntzu: 'Sun Tzu: bust shot, elderly Chinese strategist with a long grey beard, black and gold Zhou-era robes and scholar cap, wise kind smile',
  joan: 'Joan of Arc: bust shot, young woman with short dark hair, polished plate armour with a white and gold banner behind, brave warm smile',
};
const mascotPrompts = Object.entries(MASCOTS).map(([id, s]) => ({
  id,
  prompt: `Stylized painted character portrait of ${s}, as a friendly game mascot, warm brass rim light, deep navy background, premium mobile game avatar art, clean silhouette, soft painterly brushwork, no text, no letters, no frame.`,
}));

const extras = [
  { id: 'onboarding-hero', prompt: 'Vertical epic painterly matte painting: a lone commander seen from behind on a windswept ridge at dawn, cloak billowing, overlooking a vast valley where the campfires of a great army glow beneath a brass-gold sunrise breaking through deep blue storm clouds. Premium strategy-game key art, bold brushwork, rich deep blues and warm gold, strong silhouette, lots of open sky at the top. No text, no letters, no watermark.' },
  { id: 'app-icon', prompt: 'Flat game app icon: a heraldic kite shield in polished brass with a dark navy field, crossed with two brass swords behind it, a small brass laurel wreath below, centered, painterly stylized shading, soft warm rim light, on a plain deep navy background filling the whole square. Bold clean silhouette readable at small size, no text, no letters, no frame.' },
];

fs.writeFileSync('scripts/art/prompts.json', JSON.stringify({ battles: battlePrompts, emblems: emblemPrompts, mascots: mascotPrompts, extras }, null, 2));
console.log(battlePrompts.length, emblemPrompts.length, mascotPrompts.length, extras.length);
