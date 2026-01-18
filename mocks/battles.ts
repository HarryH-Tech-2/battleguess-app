import { Battle } from '@/types';

export const battles: Battle[] = [
  {
    id: 'thermopylae',
    title: 'Battle of Thermopylae',
    date: 'August 480 BC',
    year: -480,
    era: 'ancient',
    continent: 'europe',
    region: 'Greece',
    conflict: 'Greco-Persian Wars',
    lat: 38.7967,
    lng: 22.5367,
    sides: { aName: 'Greek City-States', bName: 'Persian Empire' },
    commanders: { a: ['Leonidas I', 'Themistocles'], b: ['Xerxes I', 'Mardonius'] },
    outcome: 'Persian victory, but Greeks delayed Persian advance',
    shortSummary: 'King Leonidas led 300 Spartans and 7,000 Greeks against the massive Persian army. Their heroic last stand at the narrow pass bought time for Greek forces to prepare.',
    whyItMatters: [
      'Became a symbol of courage against overwhelming odds',
      'Delayed Persian advance, allowing Greek naval victory at Salamis',
      'United Greek city-states against a common enemy'
    ],
    tags: ['sparta', 'persia', 'last-stand', 'naval'],
    difficulty: 1,
    facts: [
      'Leonidas was warned by an oracle he would die',
      'The pass was betrayed by a local named Ephialtes',
      '300 Spartans stayed for the final stand',
      'The battle lasted 3 days',
      'Xerxes army numbered over 100,000'
    ]
  },
  {
    id: 'marathon',
    title: 'Battle of Marathon',
    date: 'September 490 BC',
    year: -490,
    era: 'ancient',
    continent: 'europe',
    region: 'Greece',
    conflict: 'Greco-Persian Wars',
    lat: 38.1147,
    lng: 23.9603,
    sides: { aName: 'Athens', bName: 'Persian Empire' },
    commanders: { a: ['Miltiades', 'Callimachus'], b: ['Datis', 'Artaphernes'] },
    outcome: 'Decisive Athenian victory',
    shortSummary: 'Athenian forces defeated a Persian invasion force on the plain of Marathon. A messenger ran 26 miles to Athens to announce victory, inspiring the modern marathon race.',
    whyItMatters: [
      'First major Greek victory against Persia',
      'Proved Greek hoplites could defeat Persian forces',
      'Inspired the modern marathon race'
    ],
    tags: ['athens', 'persia', 'infantry', 'running'],
    difficulty: 1,
    facts: [
      'The messenger Pheidippides ran 26 miles to Athens',
      'Greeks were outnumbered but won decisively',
      'Athenians used a tactical encirclement',
      'About 6,400 Persians died vs 192 Greeks',
      'The battle took place on a coastal plain'
    ]
  },
  {
    id: 'hastings',
    title: 'Battle of Hastings',
    date: 'October 14, 1066',
    year: 1066,
    era: 'medieval',
    continent: 'europe',
    region: 'England',
    conflict: 'Norman Conquest',
    lat: 50.9147,
    lng: 0.4869,
    sides: { aName: 'Normans', bName: 'Anglo-Saxons' },
    commanders: { a: ['William the Conqueror'], b: ['Harold Godwinson'] },
    outcome: 'Norman victory',
    shortSummary: 'William of Normandy defeated King Harold II, ending Anglo-Saxon rule in England. Harold was killed, possibly by an arrow to the eye, as depicted in the Bayeux Tapestry.',
    whyItMatters: [
      'Changed English language, culture, and governance forever',
      'Established Norman rule in England',
      'Led to the construction of castles across England'
    ],
    tags: ['normans', 'england', 'cavalry', 'archers'],
    difficulty: 2,
    facts: [
      'Harold may have been shot in the eye with an arrow',
      'William used feigned retreats as tactics',
      'The battle lasted most of the day',
      'The Bayeux Tapestry depicts the battle',
      'Harold had just defeated Vikings at Stamford Bridge'
    ]
  },
  {
    id: 'agincourt',
    title: 'Battle of Agincourt',
    date: 'October 25, 1415',
    year: 1415,
    era: 'medieval',
    continent: 'europe',
    region: 'France',
    conflict: "Hundred Years' War",
    lat: 50.4633,
    lng: 2.1431,
    sides: { aName: 'England', bName: 'France' },
    commanders: { a: ['Henry V'], b: ['Charles d\'Albret'] },
    outcome: 'Decisive English victory',
    shortSummary: 'Henry V\'s outnumbered and exhausted English army defeated a much larger French force. English longbowmen devastated the French cavalry charges in the muddy terrain.',
    whyItMatters: [
      'Demonstrated the power of the English longbow',
      'Led to the Treaty of Troyes',
      'Made Henry V a legendary figure'
    ],
    tags: ['longbow', 'france', 'england', 'mud'],
    difficulty: 2,
    facts: [
      'English longbowmen were decisive',
      'Muddy terrain hindered French cavalry',
      'English were outnumbered roughly 4 to 1',
      'Henry V led from the front',
      'French lost many nobles that day'
    ]
  },
  {
    id: 'waterloo',
    title: 'Battle of Waterloo',
    date: 'June 18, 1815',
    year: 1815,
    era: 'napoleonic',
    continent: 'europe',
    region: 'Belgium',
    conflict: 'Napoleonic Wars',
    lat: 50.6800,
    lng: 4.4119,
    sides: { aName: 'Coalition (Britain, Prussia)', bName: 'French Empire' },
    commanders: { a: ['Duke of Wellington', 'Blücher'], b: ['Napoleon Bonaparte'] },
    outcome: 'Coalition victory',
    shortSummary: 'Napoleon\'s final defeat ended his rule and the Napoleonic Wars. Wellington\'s forces held until Prussian reinforcements arrived, crushing the French army.',
    whyItMatters: [
      'Ended Napoleon\'s rule permanently',
      'Reshaped European politics for decades',
      'Became synonymous with decisive defeat'
    ],
    tags: ['napoleon', 'wellington', 'cavalry', 'artillery'],
    difficulty: 3,
    facts: [
      'Rain the night before made the ground muddy',
      'Prussian arrival sealed French defeat',
      'Napoleon was exiled to St. Helena after',
      'Wellington called it "a close-run thing"',
      'Over 50,000 casualties in one day'
    ]
  },
  {
    id: 'austerlitz',
    title: 'Battle of Austerlitz',
    date: 'December 2, 1805',
    year: 1805,
    era: 'napoleonic',
    continent: 'europe',
    region: 'Czech Republic',
    conflict: 'Napoleonic Wars',
    lat: 49.1275,
    lng: 16.7628,
    sides: { aName: 'French Empire', bName: 'Russia & Austria' },
    commanders: { a: ['Napoleon Bonaparte'], b: ['Tsar Alexander I', 'Francis II'] },
    outcome: 'Decisive French victory',
    shortSummary: 'Napoleon\'s greatest victory. He feigned weakness to lure the Allies into a trap, then crushed their center while they overextended their flanks.',
    whyItMatters: [
      'Considered Napoleon\'s tactical masterpiece',
      'Dissolved the Holy Roman Empire',
      'Established French dominance in Europe'
    ],
    tags: ['napoleon', 'tactics', 'austria', 'russia'],
    difficulty: 3,
    facts: [
      'Known as the Battle of Three Emperors',
      'Napoleon deliberately weakened his right flank',
      'The sun broke through fog at the key moment',
      'France lost 9,000; Allies lost 36,000',
      'Fought on the first anniversary of Napoleon\'s coronation'
    ]
  },
  {
    id: 'somme',
    title: 'Battle of the Somme',
    date: 'July 1 - November 18, 1916',
    year: 1916,
    era: 'ww1',
    continent: 'europe',
    region: 'France',
    conflict: 'World War I',
    lat: 49.9333,
    lng: 2.7167,
    sides: { aName: 'Britain & France', bName: 'German Empire' },
    commanders: { a: ['Douglas Haig', 'Ferdinand Foch'], b: ['Fritz von Below'] },
    outcome: 'Inconclusive, massive casualties',
    shortSummary: 'One of the bloodiest battles in history. The first day alone saw 57,000 British casualties. Tanks were used in combat for the first time.',
    whyItMatters: [
      'Symbolizes the horror of WWI trench warfare',
      'First use of tanks in battle',
      'Over 1 million total casualties'
    ],
    tags: ['trench', 'tanks', 'attrition', 'artillery'],
    difficulty: 3,
    facts: [
      '57,000 British casualties on day one',
      'First use of tanks in warfare',
      'Battle lasted nearly 5 months',
      'Gained only 6 miles of territory',
      'Over 1 million soldiers killed or wounded'
    ]
  },
  {
    id: 'stalingrad',
    title: 'Battle of Stalingrad',
    date: 'August 23, 1942 - February 2, 1943',
    year: 1942,
    era: 'ww2',
    continent: 'europe',
    region: 'Russia',
    conflict: 'World War II',
    lat: 48.7194,
    lng: 44.5018,
    sides: { aName: 'Soviet Union', bName: 'Nazi Germany' },
    commanders: { a: ['Georgy Zhukov', 'Vasily Chuikov'], b: ['Friedrich Paulus'] },
    outcome: 'Decisive Soviet victory',
    shortSummary: 'The turning point of WWII on the Eastern Front. German 6th Army was encircled and destroyed in brutal urban combat during the harsh Russian winter.',
    whyItMatters: [
      'Turning point of WWII in Europe',
      'First major German defeat',
      'Deadliest battle in human history'
    ],
    tags: ['urban', 'encirclement', 'winter', 'turning-point'],
    difficulty: 4,
    facts: [
      'Nearly 2 million casualties total',
      'Fought building by building',
      'German 6th Army was completely destroyed',
      'Winter temperatures reached -30°C',
      'Soviet Operation Uranus encircled Germans'
    ]
  },
  {
    id: 'dday',
    title: 'D-Day (Normandy)',
    date: 'June 6, 1944',
    year: 1944,
    era: 'ww2',
    continent: 'europe',
    region: 'France',
    conflict: 'World War II',
    lat: 49.3650,
    lng: -0.8772,
    sides: { aName: 'Allied Forces', bName: 'Nazi Germany' },
    commanders: { a: ['Dwight Eisenhower', 'Bernard Montgomery'], b: ['Erwin Rommel'] },
    outcome: 'Allied victory',
    shortSummary: 'The largest amphibious invasion in history. Allied forces landed on five beaches in Normandy, establishing a foothold that would lead to the liberation of Western Europe.',
    whyItMatters: [
      'Opened the Western Front in Europe',
      'Largest amphibious invasion ever',
      'Led to liberation of France and Nazi defeat'
    ],
    tags: ['amphibious', 'beaches', 'airborne', 'liberation'],
    difficulty: 4,
    facts: [
      'Over 156,000 troops landed on day one',
      'Five beaches: Utah, Omaha, Gold, Juno, Sword',
      'Paratroopers landed behind enemy lines',
      'Codenamed Operation Overlord',
      'Rommel was away visiting his wife that day'
    ]
  },
  {
    id: 'gettysburg',
    title: 'Battle of Gettysburg',
    date: 'July 1-3, 1863',
    year: 1863,
    era: 'modern',
    continent: 'americas',
    region: 'United States',
    conflict: 'American Civil War',
    lat: 39.8109,
    lng: -77.2275,
    sides: { aName: 'Union (North)', bName: 'Confederacy (South)' },
    commanders: { a: ['George Meade'], b: ['Robert E. Lee'] },
    outcome: 'Union victory',
    shortSummary: 'The bloodiest battle of the American Civil War and a turning point. Pickett\'s Charge failed disastrously, ending Lee\'s invasion of the North.',
    whyItMatters: [
      'Turning point of the American Civil War',
      'Ended Confederate hopes of Northern invasion',
      'Site of Lincoln\'s famous Gettysburg Address'
    ],
    tags: ['civil-war', 'charge', 'turning-point', 'america'],
    difficulty: 3,
    facts: [
      'Over 50,000 total casualties in 3 days',
      'Pickett\'s Charge was a devastating failure',
      'Lincoln gave his famous address here',
      'Lee retreated to Virginia after',
      'Largest battle ever fought in North America'
    ]
  }
];

export const getBattleById = (id: string): Battle | undefined => {
  return battles.find(b => b.id === id);
};

export const getBattlesByContinent = (continent: string): Battle[] => {
  if (continent === 'all') return battles;
  return battles.filter(b => b.continent === continent);
};
