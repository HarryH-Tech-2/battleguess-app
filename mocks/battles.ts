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
  },
  {
    id: 'yorktown',
    title: 'Siege of Yorktown',
    date: 'September 28 - October 19, 1781',
    year: 1781,
    era: 'modern',
    continent: 'americas',
    region: 'United States',
    conflict: 'American Revolutionary War',
    lat: 37.2388,
    lng: -76.5097,
    sides: { aName: 'American & French Forces', bName: 'British Empire' },
    commanders: { a: ['George Washington', 'Comte de Rochambeau'], b: ['Lord Cornwallis'] },
    outcome: 'American-French victory',
    shortSummary: 'The decisive siege that ended the American Revolutionary War. Cornwallis surrendered his entire army, leading Britain to negotiate peace.',
    whyItMatters: [
      'Effectively ended the American Revolutionary War',
      'Secured American independence',
      'Demonstrated the importance of French alliance'
    ],
    tags: ['siege', 'independence', 'america', 'france'],
    difficulty: 2,
    facts: [
      'French navy blocked British escape by sea',
      'Over 8,000 British soldiers surrendered',
      'Washington\'s army marched 450 miles in secret',
      'Cornwallis sent a subordinate to surrender',
      'Band played "The World Turned Upside Down"'
    ]
  },
  {
    id: 'alamo',
    title: 'Battle of the Alamo',
    date: 'February 23 - March 6, 1836',
    year: 1836,
    era: 'modern',
    continent: 'americas',
    region: 'Texas',
    conflict: 'Texas Revolution',
    lat: 29.4260,
    lng: -98.4861,
    sides: { aName: 'Texan Defenders', bName: 'Mexican Army' },
    commanders: { a: ['William B. Travis', 'James Bowie', 'Davy Crockett'], b: ['Antonio López de Santa Anna'] },
    outcome: 'Mexican victory',
    shortSummary: 'A small group of Texan defenders held a former mission against thousands of Mexican soldiers for 13 days before being overwhelmed.',
    whyItMatters: [
      '"Remember the Alamo" became a rallying cry',
      'Delayed Santa Anna\'s campaign',
      'Symbol of courage and sacrifice'
    ],
    tags: ['siege', 'last-stand', 'texas', 'independence'],
    difficulty: 2,
    facts: [
      'Defenders numbered fewer than 200',
      'Mexican army had over 1,800 soldiers',
      'Davy Crockett was among the defenders',
      'The siege lasted 13 days',
      'All male defenders were killed'
    ]
  },
  {
    id: 'puebla',
    title: 'Battle of Puebla',
    date: 'May 5, 1862',
    year: 1862,
    era: 'modern',
    continent: 'americas',
    region: 'Mexico',
    conflict: 'French Intervention in Mexico',
    lat: 19.0414,
    lng: -98.2063,
    sides: { aName: 'Mexican Republic', bName: 'French Empire' },
    commanders: { a: ['Ignacio Zaragoza'], b: ['Charles de Lorencez'] },
    outcome: 'Mexican victory',
    shortSummary: 'A poorly equipped Mexican army defeated the French forces, one of the best armies in the world at the time. This is celebrated as Cinco de Mayo.',
    whyItMatters: [
      'Celebrated annually as Cinco de Mayo',
      'Boosted Mexican morale during French intervention',
      'Symbol of Mexican resistance'
    ],
    tags: ['mexico', 'france', 'independence', 'underdog'],
    difficulty: 2,
    facts: [
      'French army was considered unbeatable',
      'Mexicans were outnumbered and outgunned',
      'French lost about 500 soldiers',
      'Celebrated as Cinco de Mayo',
      'France eventually took Mexico City a year later'
    ]
  },
  {
    id: 'ayacucho',
    title: 'Battle of Ayacucho',
    date: 'December 9, 1824',
    year: 1824,
    era: 'modern',
    continent: 'americas',
    region: 'Peru',
    conflict: 'South American Wars of Independence',
    lat: -13.1588,
    lng: -74.2244,
    sides: { aName: 'Revolutionary Forces', bName: 'Spanish Royalists' },
    commanders: { a: ['Antonio José de Sucre'], b: ['José de la Serna'] },
    outcome: 'Revolutionary victory',
    shortSummary: 'The decisive battle that ended Spanish colonial rule in South America. Sucre\'s forces defeated the last major Spanish army on the continent.',
    whyItMatters: [
      'Ended Spanish rule in South America',
      'Secured independence for Peru and Bolivia',
      'Final major battle of South American liberation'
    ],
    tags: ['independence', 'liberation', 'peru', 'spain'],
    difficulty: 3,
    facts: [
      'Fought at over 3,000 meters altitude',
      'Spanish viceroy was captured',
      'Ended 300 years of Spanish rule',
      'Sucre was only 29 years old',
      'Battle lasted just over an hour'
    ]
  },
  {
    id: 'gaugamela',
    title: 'Battle of Gaugamela',
    date: 'October 1, 331 BC',
    year: -331,
    era: 'ancient',
    continent: 'asia',
    region: 'Iraq',
    conflict: 'Wars of Alexander the Great',
    lat: 36.5600,
    lng: 43.4500,
    sides: { aName: 'Macedonian Empire', bName: 'Persian Empire' },
    commanders: { a: ['Alexander the Great'], b: ['Darius III'] },
    outcome: 'Macedonian victory',
    shortSummary: 'Alexander\'s decisive victory over the Persian Empire. Despite being vastly outnumbered, his tactical genius crushed Darius\'s massive army.',
    whyItMatters: [
      'Ended the Persian Achaemenid Empire',
      'Established Alexander as ruler of Asia',
      'One of the most decisive battles in history'
    ],
    tags: ['alexander', 'persia', 'cavalry', 'tactics'],
    difficulty: 3,
    facts: [
      'Persians may have had 250,000 troops',
      'Alexander personally led the decisive charge',
      'Darius fled the battlefield',
      'Persian war elephants were present',
      'Alexander crossed enemy lines to kill Darius'
    ]
  },
  {
    id: 'sekigahara',
    title: 'Battle of Sekigahara',
    date: 'October 21, 1600',
    year: 1600,
    era: 'medieval',
    continent: 'asia',
    region: 'Japan',
    conflict: 'Sengoku Period Wars',
    lat: 35.3667,
    lng: 136.4667,
    sides: { aName: 'Eastern Army', bName: 'Western Army' },
    commanders: { a: ['Tokugawa Ieyasu'], b: ['Ishida Mitsunari'] },
    outcome: 'Eastern Army victory',
    shortSummary: 'The decisive battle that unified Japan under Tokugawa rule. Betrayals and defections turned the tide, establishing 250 years of peace.',
    whyItMatters: [
      'Established the Tokugawa Shogunate',
      'Unified Japan for 250 years',
      'Ended the Sengoku (Warring States) period'
    ],
    tags: ['samurai', 'japan', 'unification', 'betrayal'],
    difficulty: 3,
    facts: [
      'Over 160,000 samurai fought',
      'Key defections decided the battle',
      'Fog covered the battlefield initially',
      'Battle lasted only 6 hours',
      'Began the Edo period of peace'
    ]
  },
  {
    id: 'red-cliffs',
    title: 'Battle of Red Cliffs',
    date: 'Winter 208-209 AD',
    year: 208,
    era: 'ancient',
    continent: 'asia',
    region: 'China',
    conflict: 'Three Kingdoms Period',
    lat: 29.8500,
    lng: 113.6167,
    sides: { aName: 'Sun-Liu Alliance', bName: 'Cao Cao\'s Forces' },
    commanders: { a: ['Zhou Yu', 'Liu Bei'], b: ['Cao Cao'] },
    outcome: 'Allied victory',
    shortSummary: 'A pivotal naval battle where fire ships destroyed Cao Cao\'s massive fleet, preventing unification of China and establishing the Three Kingdoms.',
    whyItMatters: [
      'Prevented early unification of China',
      'Established the Three Kingdoms period',
      'One of the most famous battles in Chinese history'
    ],
    tags: ['naval', 'fire', 'china', 'three-kingdoms'],
    difficulty: 3,
    facts: [
      'Fire ships were the decisive weapon',
      'Cao Cao\'s navy was chained together',
      'A feigned defection delivered the fire ships',
      'Immortalized in Romance of Three Kingdoms',
      'Cao Cao lost most of his 200,000 troops'
    ]
  },
  {
    id: 'panipat-first',
    title: 'First Battle of Panipat',
    date: 'April 21, 1526',
    year: 1526,
    era: 'medieval',
    continent: 'asia',
    region: 'India',
    conflict: 'Mughal Conquest of India',
    lat: 29.3909,
    lng: 76.9635,
    sides: { aName: 'Mughal Empire', bName: 'Delhi Sultanate' },
    commanders: { a: ['Babur'], b: ['Ibrahim Lodi'] },
    outcome: 'Mughal victory',
    shortSummary: 'Babur\'s smaller army used gunpowder weapons and cavalry tactics to defeat the much larger Delhi Sultanate forces, founding the Mughal Empire.',
    whyItMatters: [
      'Founded the Mughal Empire in India',
      'First major use of gunpowder in Indian warfare',
      'Changed Indian military tactics forever'
    ],
    tags: ['mughal', 'india', 'gunpowder', 'cavalry'],
    difficulty: 3,
    facts: [
      'Babur had only 12,000 troops vs 100,000',
      'First use of field artillery in India',
      'Ibrahim Lodi was killed in battle',
      'Babur was a descendant of Timur and Genghis Khan',
      'Battle lasted less than a day'
    ]
  },
  {
    id: 'tsushima',
    title: 'Battle of Tsushima',
    date: 'May 27-28, 1905',
    year: 1905,
    era: 'modern',
    continent: 'asia',
    region: 'Japan',
    conflict: 'Russo-Japanese War',
    lat: 34.4000,
    lng: 129.4500,
    sides: { aName: 'Imperial Japanese Navy', bName: 'Russian Baltic Fleet' },
    commanders: { a: ['Admiral Togo Heihachiro'], b: ['Admiral Zinovy Rozhestvensky'] },
    outcome: 'Decisive Japanese victory',
    shortSummary: 'Japan annihilated the Russian fleet that had sailed halfway around the world. This shocking victory made Japan a world power.',
    whyItMatters: [
      'First Asian victory over a European power in modern times',
      'Established Japan as a major naval power',
      'Led to the Treaty of Portsmouth'
    ],
    tags: ['naval', 'japan', 'russia', 'modern-warfare'],
    difficulty: 4,
    facts: [
      'Russian fleet sailed 18,000 miles to fight',
      'Japan lost 3 torpedo boats; Russia lost 21 ships',
      'Only 3 Russian ships reached Vladivostok',
      'Admiral Togo became a national hero',
      'Theodore Roosevelt mediated the peace'
    ]
  },
  {
    id: 'midway',
    title: 'Battle of Midway',
    date: 'June 4-7, 1942',
    year: 1942,
    era: 'ww2',
    continent: 'asia',
    region: 'Pacific Ocean',
    conflict: 'World War II',
    lat: 28.2000,
    lng: -177.3500,
    sides: { aName: 'United States Navy', bName: 'Imperial Japanese Navy' },
    commanders: { a: ['Chester Nimitz', 'Raymond Spruance'], b: ['Isoroku Yamamoto'] },
    outcome: 'American victory',
    shortSummary: 'The turning point of the Pacific War. American dive bombers sank four Japanese carriers in minutes, shifting the balance of power.',
    whyItMatters: [
      'Turning point of the Pacific War',
      'Japan lost four irreplaceable carriers',
      'Shifted the initiative to the United States'
    ],
    tags: ['naval', 'carriers', 'pacific', 'turning-point'],
    difficulty: 4,
    facts: [
      'US codebreakers knew Japanese plans',
      'Four Japanese carriers sunk in 5 minutes',
      'USS Yorktown was sunk despite damage',
      'Japan lost its best naval pilots',
      'Considered the most decisive naval battle'
    ]
  },
  {
    id: 'zama',
    title: 'Battle of Zama',
    date: 'October 19, 202 BC',
    year: -202,
    era: 'ancient',
    continent: 'africa',
    region: 'Tunisia',
    conflict: 'Second Punic War',
    lat: 36.2600,
    lng: 9.4400,
    sides: { aName: 'Roman Republic', bName: 'Carthage' },
    commanders: { a: ['Scipio Africanus'], b: ['Hannibal Barca'] },
    outcome: 'Roman victory',
    shortSummary: 'The final battle between Rome and Carthage. Scipio defeated Hannibal using the general\'s own tactics against him, ending the Second Punic War.',
    whyItMatters: [
      'Ended the Second Punic War',
      'Established Roman dominance in the Mediterranean',
      'Only battle Hannibal ever lost'
    ],
    tags: ['rome', 'carthage', 'elephants', 'cavalry'],
    difficulty: 3,
    facts: [
      'Hannibal\'s only defeat in a major battle',
      'Scipio turned Hannibal\'s elephants against him',
      'Numidian cavalry decided the outcome',
      'Hannibal met Scipio before the battle',
      'Carthage was reduced to a client state'
    ]
  },
  {
    id: 'el-alamein',
    title: 'Second Battle of El Alamein',
    date: 'October 23 - November 11, 1942',
    year: 1942,
    era: 'ww2',
    continent: 'africa',
    region: 'Egypt',
    conflict: 'World War II',
    lat: 30.8333,
    lng: 28.9500,
    sides: { aName: 'British Eighth Army', bName: 'Axis (Germany & Italy)' },
    commanders: { a: ['Bernard Montgomery'], b: ['Erwin Rommel'] },
    outcome: 'British victory',
    shortSummary: 'Montgomery\'s Eighth Army broke through Rommel\'s Afrika Korps defenses, beginning the end of the North African campaign.',
    whyItMatters: [
      'Turning point in the North African campaign',
      'First major British victory against Germany',
      'Churchill said: "Before Alamein we never had a victory"'
    ],
    tags: ['desert', 'tanks', 'africa', 'turning-point'],
    difficulty: 4,
    facts: [
      'Montgomery had overwhelming material advantage',
      'Rommel was in Germany when battle started',
      'Operation Supercharge broke German lines',
      'Hitler ordered "victory or death"',
      'Over 30,000 Axis prisoners taken'
    ]
  },
  {
    id: 'isandlwana',
    title: 'Battle of Isandlwana',
    date: 'January 22, 1879',
    year: 1879,
    era: 'modern',
    continent: 'africa',
    region: 'South Africa',
    conflict: 'Anglo-Zulu War',
    lat: -28.3500,
    lng: 30.6500,
    sides: { aName: 'Zulu Kingdom', bName: 'British Empire' },
    commanders: { a: ['Ntshingwayo kaMahole'], b: ['Lord Chelmsford'] },
    outcome: 'Zulu victory',
    shortSummary: 'The Zulu army overwhelmed a British force in one of the worst defeats in British colonial history. Over 1,300 British soldiers were killed.',
    whyItMatters: [
      'Worst British defeat against indigenous forces',
      'Shocked the British Empire',
      'Demonstrated Zulu military prowess'
    ],
    tags: ['colonial', 'zulu', 'africa', 'defeat'],
    difficulty: 3,
    facts: [
      'Zulus attacked with 20,000 warriors',
      'British ammunition boxes were hard to open',
      'Eclipse of sun occurred during battle',
      'Same day as the defense of Rorke\'s Drift',
      '1,300 British soldiers killed'
    ]
  },
  {
    id: 'adwa',
    title: 'Battle of Adwa',
    date: 'March 1, 1896',
    year: 1896,
    era: 'modern',
    continent: 'africa',
    region: 'Ethiopia',
    conflict: 'First Italo-Ethiopian War',
    lat: 14.1667,
    lng: 38.8833,
    sides: { aName: 'Ethiopian Empire', bName: 'Kingdom of Italy' },
    commanders: { a: ['Emperor Menelik II'], b: ['General Oreste Baratieri'] },
    outcome: 'Ethiopian victory',
    shortSummary: 'Ethiopia crushed the Italian invasion force, becoming the only African nation to successfully resist European colonization.',
    whyItMatters: [
      'Only African nation to defeat European colonizers',
      'Preserved Ethiopian independence',
      'Symbol of African resistance to colonialism'
    ],
    tags: ['colonial', 'independence', 'africa', 'ethiopia'],
    difficulty: 3,
    facts: [
      'Ethiopians outnumbered Italians 5 to 1',
      'Italian army was poorly coordinated',
      'Ethiopia had modern weapons from France and Russia',
      'Italy lost 7,000 soldiers',
      'Ethiopia remained independent until 1936'
    ]
  },
  {
    id: 'cannae',
    title: 'Battle of Cannae',
    date: 'August 2, 216 BC',
    year: -216,
    era: 'ancient',
    continent: 'europe',
    region: 'Italy',
    conflict: 'Second Punic War',
    lat: 41.3050,
    lng: 16.1325,
    sides: { aName: 'Carthage', bName: 'Roman Republic' },
    commanders: { a: ['Hannibal Barca'], b: ['Gaius Terentius Varro'] },
    outcome: 'Carthaginian victory',
    shortSummary: 'Hannibal\'s masterpiece of tactical warfare. His double envelopment destroyed a Roman army of 80,000, killing over 50,000 in a single day.',
    whyItMatters: [
      'Textbook example of tactical encirclement',
      'One of the bloodiest single-day battles in history',
      'Still studied in military academies today'
    ],
    tags: ['tactics', 'encirclement', 'hannibal', 'rome'],
    difficulty: 4,
    facts: [
      'Romans lost 50,000-70,000 soldiers in one day',
      'Hannibal used a crescent formation',
      'Romans were surrounded and annihilated',
      'Ring of gold from dead Roman knights filled bushels',
      'Rome refused to surrender despite losses'
    ]
  },
  {
    id: 'verdun',
    title: 'Battle of Verdun',
    date: 'February 21 - December 18, 1916',
    year: 1916,
    era: 'ww1',
    continent: 'europe',
    region: 'France',
    conflict: 'World War I',
    lat: 49.1600,
    lng: 5.3800,
    sides: { aName: 'France', bName: 'German Empire' },
    commanders: { a: ['Philippe Pétain'], b: ['Erich von Falkenhayn'] },
    outcome: 'French strategic victory',
    shortSummary: 'The longest single battle of WWI. Germany tried to "bleed France white" at this symbolic fortress, but both sides suffered equally.',
    whyItMatters: [
      'Symbol of French resistance and determination',
      'Longest battle of World War I',
      '"They shall not pass" became French rallying cry'
    ],
    tags: ['trench', 'attrition', 'france', 'ww1'],
    difficulty: 4,
    facts: [
      'Battle lasted 303 days',
      'Over 700,000 total casualties',
      'Germans used poison gas extensively',
      'Pétain\'s "They shall not pass" inspired France',
      'Lunar landscape from millions of shells'
    ]
  },
  {
    id: 'kursk',
    title: 'Battle of Kursk',
    date: 'July 5 - August 23, 1943',
    year: 1943,
    era: 'ww2',
    continent: 'europe',
    region: 'Russia',
    conflict: 'World War II',
    lat: 51.7300,
    lng: 36.1900,
    sides: { aName: 'Soviet Union', bName: 'Nazi Germany' },
    commanders: { a: ['Georgy Zhukov', 'Konstantin Rokossovsky'], b: ['Erich von Manstein'] },
    outcome: 'Soviet victory',
    shortSummary: 'The largest tank battle in history. Germany\'s last major offensive on the Eastern Front was stopped cold, and the Soviets seized the initiative.',
    whyItMatters: [
      'Largest tank battle in history',
      'Germany\'s last strategic offensive in the East',
      'Soviet Union seized permanent initiative'
    ],
    tags: ['tanks', 'eastern-front', 'ww2', 'massive'],
    difficulty: 4,
    facts: [
      'Over 6,000 tanks engaged',
      'Soviets knew German plans from intelligence',
      'Prokhorovka saw 1,500 tanks clash',
      '2 million soldiers fought',
      'Germany lost 720 tanks in first week'
    ]
  },
  {
    id: 'tours',
    title: 'Battle of Tours',
    date: 'October 10, 732',
    year: 732,
    era: 'medieval',
    continent: 'europe',
    region: 'France',
    conflict: 'Umayyad Invasion of Gaul',
    lat: 47.3833,
    lng: 0.6833,
    sides: { aName: 'Frankish Kingdom', bName: 'Umayyad Caliphate' },
    commanders: { a: ['Charles Martel'], b: ['Abdul Rahman Al Ghafiqi'] },
    outcome: 'Frankish victory',
    shortSummary: 'Charles Martel halted the Umayyad advance into Western Europe, earning his nickname "The Hammer" and preserving Christendom.',
    whyItMatters: [
      'Stopped Islamic expansion into Western Europe',
      'Charles Martel became the most powerful man in Europe',
      'Grandfather of Charlemagne'
    ],
    tags: ['medieval', 'france', 'islam', 'christianity'],
    difficulty: 3,
    facts: [
      'Charles earned nickname "The Hammer"',
      'Frankish infantry held against cavalry',
      'Abdul Rahman was killed in battle',
      'Also known as Battle of Poitiers',
      'Marked the end of major Islamic expansion'
    ]
  },
  {
    id: 'gallipoli',
    title: 'Gallipoli Campaign',
    date: 'February 19, 1915 - January 9, 1916',
    year: 1915,
    era: 'ww1',
    continent: 'asia',
    region: 'Turkey',
    conflict: 'World War I',
    lat: 40.2500,
    lng: 26.3500,
    sides: { aName: 'Ottoman Empire', bName: 'Allied Forces (Britain, France, ANZAC)' },
    commanders: { a: ['Mustafa Kemal (Atatürk)'], b: ['Ian Hamilton'] },
    outcome: 'Ottoman victory',
    shortSummary: 'Allied forces attempted to seize the Dardanelles but were repelled by Ottoman defenders. The campaign launched Atatürk\'s rise to prominence.',
    whyItMatters: [
      'Defining moment for Australian and New Zealand identity',
      'Launched Mustafa Kemal Atatürk\'s career',
      'Strategic failure that prolonged WWI'
    ],
    tags: ['amphibious', 'anzac', 'ottoman', 'failure'],
    difficulty: 4,
    facts: [
      'Over 500,000 casualties on both sides',
      'ANZAC Day commemorates the landing',
      'Winston Churchill\'s plan that failed',
      'Atatürk became founder of modern Turkey',
      'Allied forces evacuated after 8 months'
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
