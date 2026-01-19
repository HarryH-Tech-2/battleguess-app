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
  },
  {
    id: 'lepanto',
    title: 'Battle of Lepanto',
    date: 'October 7, 1571',
    year: 1571,
    era: 'medieval',
    continent: 'europe',
    region: 'Greece',
    conflict: 'Ottoman-Venetian Wars',
    lat: 38.3833,
    lng: 21.4333,
    sides: { aName: 'Holy League', bName: 'Ottoman Empire' },
    commanders: { a: ['Don John of Austria'], b: ['Ali Pasha'] },
    outcome: 'Holy League victory',
    shortSummary: 'The largest naval battle in Western history since antiquity. The Holy League crushed Ottoman naval power, ending the myth of Ottoman invincibility at sea.',
    whyItMatters: [
      'Ended Ottoman naval dominance in the Mediterranean',
      'Last major battle fought primarily with galleys',
      'Cervantes (Don Quixote author) fought here'
    ],
    tags: ['naval', 'ottoman', 'galley', 'mediterranean'],
    difficulty: 3,
    facts: [
      'Over 400 galleys participated',
      'Miguel de Cervantes lost use of his left hand',
      'Ottoman fleet lost 200 ships',
      'Holy League freed 12,000 Christian slaves',
      'Don John was only 24 years old'
    ]
  },
  {
    id: 'borodino',
    title: 'Battle of Borodino',
    date: 'September 7, 1812',
    year: 1812,
    era: 'napoleonic',
    continent: 'europe',
    region: 'Russia',
    conflict: 'Napoleonic Wars',
    lat: 55.5167,
    lng: 35.8167,
    sides: { aName: 'French Empire', bName: 'Russian Empire' },
    commanders: { a: ['Napoleon Bonaparte'], b: ['Mikhail Kutuzov'] },
    outcome: 'French pyrrhic victory',
    shortSummary: 'The bloodiest single day of the Napoleonic Wars. Napoleon won the field but failed to destroy the Russian army, leading to his disastrous retreat from Moscow.',
    whyItMatters: [
      'Bloodiest single day of Napoleonic Wars',
      'Russians preserved their army to fight another day',
      'Led to Napoleon\'s catastrophic Moscow campaign'
    ],
    tags: ['napoleon', 'russia', 'artillery', 'pyrrhic'],
    difficulty: 4,
    facts: [
      'Over 70,000 casualties in one day',
      'Napoleon captured Moscow a week later',
      'Kutuzov chose to retreat rather than fight again',
      'Featured in Tolstoy\'s War and Peace',
      'Napoleon called it his most terrible battle'
    ]
  },
  {
    id: 'trafalgar',
    title: 'Battle of Trafalgar',
    date: 'October 21, 1805',
    year: 1805,
    era: 'napoleonic',
    continent: 'europe',
    region: 'Spain',
    conflict: 'Napoleonic Wars',
    lat: 36.1833,
    lng: -6.0333,
    sides: { aName: 'Royal Navy', bName: 'Franco-Spanish Fleet' },
    commanders: { a: ['Admiral Horatio Nelson'], b: ['Pierre-Charles Villeneuve'] },
    outcome: 'British victory',
    shortSummary: 'Britain\'s greatest naval victory secured control of the seas for a century. Admiral Nelson was killed but became Britain\'s greatest hero.',
    whyItMatters: [
      'Established British naval supremacy for 100 years',
      'Ended Napoleon\'s invasion plans for Britain',
      'Created the legend of Admiral Nelson'
    ],
    tags: ['naval', 'nelson', 'britain', 'ships-of-the-line'],
    difficulty: 3,
    facts: [
      'Nelson signaled "England expects every man to do his duty"',
      'Nelson was shot by a French sniper',
      'British lost no ships; French-Spanish lost 22',
      'Trafalgar Square in London commemorates the battle',
      'Nelson\'s body was preserved in brandy for the voyage home'
    ]
  },
  {
    id: 'vienna-1683',
    title: 'Battle of Vienna',
    date: 'September 12, 1683',
    year: 1683,
    era: 'medieval',
    continent: 'europe',
    region: 'Austria',
    conflict: 'Great Turkish War',
    lat: 48.2083,
    lng: 16.3731,
    sides: { aName: 'Holy Roman Empire & Poland', bName: 'Ottoman Empire' },
    commanders: { a: ['Jan III Sobieski', 'Charles V of Lorraine'], b: ['Kara Mustafa Pasha'] },
    outcome: 'Christian coalition victory',
    shortSummary: 'The largest cavalry charge in history broke the Ottoman siege of Vienna, marking the beginning of the Ottoman Empire\'s decline in Europe.',
    whyItMatters: [
      'Marked the end of Ottoman expansion into Europe',
      'Largest cavalry charge in history',
      'Beginning of Ottoman decline'
    ],
    tags: ['siege', 'cavalry', 'ottoman', 'poland'],
    difficulty: 3,
    facts: [
      '18,000 cavalry in the final charge',
      'Polish Winged Hussars were decisive',
      'Kara Mustafa was executed for his failure',
      'Vienna had been besieged for 2 months',
      'Coffee houses spread across Europe after captured supplies'
    ]
  },
  {
    id: 'plassey',
    title: 'Battle of Plassey',
    date: 'June 23, 1757',
    year: 1757,
    era: 'modern',
    continent: 'asia',
    region: 'India',
    conflict: 'British Conquest of India',
    lat: 23.8000,
    lng: 88.2500,
    sides: { aName: 'British East India Company', bName: 'Nawab of Bengal' },
    commanders: { a: ['Robert Clive'], b: ['Siraj ud-Daulah'] },
    outcome: 'British victory',
    shortSummary: 'A small British force defeated the Nawab through conspiracy and bribery, beginning British colonial rule over the Indian subcontinent.',
    whyItMatters: [
      'Beginning of British colonial rule in India',
      'Established the East India Company as a political power',
      'Changed the course of Indian history'
    ],
    tags: ['colonial', 'india', 'conspiracy', 'company'],
    difficulty: 3,
    facts: [
      'Most of the Nawab\'s army was bribed not to fight',
      'British had only 3,000 troops vs 50,000',
      'Mir Jafar betrayed his own ruler',
      'Battle lasted only a few hours',
      'Clive became fabulously wealthy'
    ]
  },
  {
    id: 'singapore',
    title: 'Fall of Singapore',
    date: 'February 8-15, 1942',
    year: 1942,
    era: 'ww2',
    continent: 'asia',
    region: 'Singapore',
    conflict: 'World War II',
    lat: 1.3521,
    lng: 103.8198,
    sides: { aName: 'Imperial Japanese Army', bName: 'British Commonwealth' },
    commanders: { a: ['Tomoyuki Yamashita'], b: ['Arthur Percival'] },
    outcome: 'Japanese victory',
    shortSummary: 'The largest surrender in British military history. Japan captured the "impregnable fortress" in just one week, shocking the world.',
    whyItMatters: [
      'Largest British surrender in history',
      'Shattered the myth of European colonial invincibility',
      'Japan\'s greatest land victory of WWII'
    ],
    tags: ['ww2', 'surrender', 'colonial', 'pacific'],
    difficulty: 4,
    facts: [
      '80,000 British troops surrendered',
      'Japanese were outnumbered 3 to 1',
      'Singapore\'s guns faced the sea, not land',
      'Churchill called it the worst disaster in British history',
      'Yamashita was called "The Tiger of Malaya"'
    ]
  },
  {
    id: 'dien-bien-phu',
    title: 'Battle of Dien Bien Phu',
    date: 'March 13 - May 7, 1954',
    year: 1954,
    era: 'modern',
    continent: 'asia',
    region: 'Vietnam',
    conflict: 'First Indochina War',
    lat: 21.3833,
    lng: 103.0167,
    sides: { aName: 'Viet Minh', bName: 'French Union' },
    commanders: { a: ['Võ Nguyên Giáp'], b: ['Christian de Castries'] },
    outcome: 'Viet Minh victory',
    shortSummary: 'Vietnamese forces besieged and overwhelmed a French garrison in a remote valley, ending French colonial rule in Indochina.',
    whyItMatters: [
      'Ended French colonial rule in Vietnam',
      'Led to American involvement in Vietnam',
      'Showed that guerrilla forces could defeat a modern army'
    ],
    tags: ['colonial', 'siege', 'vietnam', 'independence'],
    difficulty: 4,
    facts: [
      'Viet Minh dragged artillery through mountains by hand',
      'French were completely surrounded in a valley',
      'Battle lasted 57 days',
      '11,000 French soldiers became prisoners',
      'Geneva Accords divided Vietnam after the battle'
    ]
  },
  {
    id: 'changping',
    title: 'Battle of Changping',
    date: '260 BC',
    year: -260,
    era: 'ancient',
    continent: 'asia',
    region: 'China',
    conflict: 'Warring States Period',
    lat: 35.6833,
    lng: 112.8500,
    sides: { aName: 'State of Qin', bName: 'State of Zhao' },
    commanders: { a: ['Bai Qi'], b: ['Zhao Kuo'] },
    outcome: 'Qin victory',
    shortSummary: 'One of the bloodiest battles in ancient history. Qin forces trapped and massacred 400,000 Zhao soldiers, paving the way for China\'s unification.',
    whyItMatters: [
      'One of the bloodiest battles in history',
      'Paved the way for Qin to unify China',
      'Bai Qi became known as the "Human Butcher"'
    ],
    tags: ['ancient', 'china', 'massacre', 'unification'],
    difficulty: 4,
    facts: [
      'Over 400,000 Zhao soldiers reportedly killed',
      'Prisoners were buried alive after surrendering',
      'Battle lasted 5 months',
      'Zhao never recovered from the loss',
      'Qin unified China 39 years later'
    ]
  },
  {
    id: 'omdurman',
    title: 'Battle of Omdurman',
    date: 'September 2, 1898',
    year: 1898,
    era: 'modern',
    continent: 'africa',
    region: 'Sudan',
    conflict: 'Mahdist War',
    lat: 15.6167,
    lng: 32.4833,
    sides: { aName: 'British-Egyptian Army', bName: 'Mahdist Sudan' },
    commanders: { a: ['Horatio Kitchener'], b: ['Abdullah al-Taashi'] },
    outcome: 'British victory',
    shortSummary: 'Modern weapons devastated the Mahdist army in the last cavalry charge in British history. Winston Churchill participated as a young officer.',
    whyItMatters: [
      'Demonstrated the devastating power of modern weapons',
      'Last significant cavalry charge in British history',
      'Secured British control over Sudan'
    ],
    tags: ['colonial', 'sudan', 'cavalry', 'machine-guns'],
    difficulty: 3,
    facts: [
      'Maxim guns mowed down charging warriors',
      'British lost 47 dead; Mahdists lost 12,000',
      'Young Winston Churchill rode in the cavalry charge',
      'Kitchener avenged General Gordon\'s death',
      'Led to the Fashoda Incident with France'
    ]
  },
  {
    id: 'carthage-destruction',
    title: 'Siege of Carthage',
    date: '149-146 BC',
    year: -146,
    era: 'ancient',
    continent: 'africa',
    region: 'Tunisia',
    conflict: 'Third Punic War',
    lat: 36.8528,
    lng: 10.3233,
    sides: { aName: 'Roman Republic', bName: 'Carthage' },
    commanders: { a: ['Scipio Aemilianus'], b: ['Hasdrubal the Boetharch'] },
    outcome: 'Roman victory',
    shortSummary: 'Rome completely destroyed its ancient rival. The city was razed, inhabitants killed or enslaved, and salt allegedly sown into the earth.',
    whyItMatters: [
      'Complete destruction of Rome\'s greatest rival',
      'Established Roman dominance over the Mediterranean',
      'Became a symbol of total annihilation'
    ],
    tags: ['siege', 'rome', 'carthage', 'destruction'],
    difficulty: 3,
    facts: [
      'Siege lasted 3 years',
      'Survivors were sold into slavery',
      'City was burned for 17 days',
      'Scipio allegedly wept over the ruins',
      'Legend says Romans salted the earth'
    ]
  },
  {
    id: 'tobruk',
    title: 'Siege of Tobruk',
    date: 'April 10 - December 7, 1941',
    year: 1941,
    era: 'ww2',
    continent: 'africa',
    region: 'Libya',
    conflict: 'World War II',
    lat: 32.0833,
    lng: 23.9333,
    sides: { aName: 'Allied Forces (Australia, Britain)', bName: 'Axis (Germany, Italy)' },
    commanders: { a: ['Leslie Morshead'], b: ['Erwin Rommel'] },
    outcome: 'Allied defensive victory',
    shortSummary: 'Australian and British forces held the Libyan port against Rommel\'s Afrika Korps for 241 days, becoming known as the "Rats of Tobruk."',
    whyItMatters: [
      'First time German forces were stopped in WWII',
      'Crucial supply port for the North African campaign',
      'Boosted Allied morale worldwide'
    ],
    tags: ['siege', 'desert', 'australia', 'rommel'],
    difficulty: 4,
    facts: [
      'Defenders were called "Rats of Tobruk"',
      'Siege lasted 241 days',
      'Rommel could not bypass the fortress',
      'Supplied by sea despite constant attacks',
      'Australian 9th Division held longest'
    ]
  },
  {
    id: 'saratoga',
    title: 'Battle of Saratoga',
    date: 'September 19 - October 7, 1777',
    year: 1777,
    era: 'modern',
    continent: 'americas',
    region: 'United States',
    conflict: 'American Revolutionary War',
    lat: 43.0062,
    lng: -73.6458,
    sides: { aName: 'Continental Army', bName: 'British Army' },
    commanders: { a: ['Horatio Gates', 'Benedict Arnold'], b: ['John Burgoyne'] },
    outcome: 'American victory',
    shortSummary: 'The turning point of the American Revolution. British surrender convinced France to ally with America, changing the war\'s outcome.',
    whyItMatters: [
      'Turning point of the American Revolution',
      'Convinced France to enter the war on America\'s side',
      'First major American victory over a British army'
    ],
    tags: ['revolution', 'america', 'france', 'turning-point'],
    difficulty: 3,
    facts: [
      'British General Burgoyne surrendered 6,000 troops',
      'Benedict Arnold was the hero before his treason',
      'France recognized American independence after',
      'Burgoyne\'s plan to split colonies failed',
      'Also called "Battles of Freeman\'s Farm"'
    ]
  },
  {
    id: 'chacabuco',
    title: 'Battle of Chacabuco',
    date: 'February 12, 1817',
    year: 1817,
    era: 'modern',
    continent: 'americas',
    region: 'Chile',
    conflict: 'Chilean War of Independence',
    lat: -32.8333,
    lng: -70.6000,
    sides: { aName: 'Army of the Andes', bName: 'Spanish Royalists' },
    commanders: { a: ['José de San Martín', 'Bernardo O\'Higgins'], b: ['Rafael Maroto'] },
    outcome: 'Patriot victory',
    shortSummary: 'San Martín\'s army crossed the Andes and defeated the Spanish, liberating Chile from colonial rule.',
    whyItMatters: [
      'Secured Chilean independence',
      'One of history\'s great mountain crossings',
      'San Martín became South America\'s liberator'
    ],
    tags: ['independence', 'andes', 'chile', 'liberation'],
    difficulty: 3,
    facts: [
      'San Martín crossed the Andes with 5,000 men',
      'Crossing took 21 days at 12,000 feet',
      'O\'Higgins led the main attack despite orders',
      'Battle lasted only 2 hours',
      'Chile declared independence days later'
    ]
  },
  {
    id: 'new-orleans',
    title: 'Battle of New Orleans',
    date: 'January 8, 1815',
    year: 1815,
    era: 'modern',
    continent: 'americas',
    region: 'United States',
    conflict: 'War of 1812',
    lat: 29.9417,
    lng: -89.9600,
    sides: { aName: 'United States', bName: 'British Empire' },
    commanders: { a: ['Andrew Jackson'], b: ['Edward Pakenham'] },
    outcome: 'American victory',
    shortSummary: 'Andrew Jackson\'s ragtag army crushed a British invasion force, making him a national hero. The battle was fought after peace had already been signed.',
    whyItMatters: [
      'Made Andrew Jackson a national hero and future president',
      'Fought after the peace treaty was signed',
      'Decisive American victory in the War of 1812'
    ],
    tags: ['war-of-1812', 'america', 'jackson', 'ironic'],
    difficulty: 2,
    facts: [
      'Peace treaty was signed 2 weeks before the battle',
      'British lost 2,000 casualties; Americans lost 71',
      'Jackson\'s army included pirates, slaves, and militiamen',
      'General Pakenham was killed leading the attack',
      'Jackson became the 7th US President'
    ]
  },
  {
    id: 'boyaca',
    title: 'Battle of Boyacá',
    date: 'August 7, 1819',
    year: 1819,
    era: 'modern',
    continent: 'americas',
    region: 'Colombia',
    conflict: 'Colombian War of Independence',
    lat: 5.4500,
    lng: -73.4167,
    sides: { aName: 'Gran Colombian Patriots', bName: 'Spanish Royalists' },
    commanders: { a: ['Simón Bolívar', 'Francisco de Paula Santander'], b: ['José María Barreiro'] },
    outcome: 'Patriot victory',
    shortSummary: 'Bolívar\'s decisive victory that secured independence for New Granada (Colombia). The Spanish army was destroyed in just two hours.',
    whyItMatters: [
      'Secured Colombian independence',
      'Established Bolívar as "The Liberator"',
      'Led to the creation of Gran Colombia'
    ],
    tags: ['independence', 'bolivar', 'colombia', 'liberation'],
    difficulty: 3,
    facts: [
      'Battle lasted only 2 hours',
      'Spanish commander was captured',
      'Bolívar entered Bogotá 3 days later',
      'Colombia celebrates August 7 as a holiday',
      'Only 66 patriots were killed'
    ]
  },
  {
    id: 'rorkes-drift',
    title: 'Battle of Rorke\'s Drift',
    date: 'January 22-23, 1879',
    year: 1879,
    era: 'modern',
    continent: 'africa',
    region: 'South Africa',
    conflict: 'Anglo-Zulu War',
    lat: -28.3500,
    lng: 30.5333,
    sides: { aName: 'British Army', bName: 'Zulu Kingdom' },
    commanders: { a: ['John Chard', 'Gonville Bromhead'], b: ['Prince Dabulamanzi kaMpande'] },
    outcome: 'British victory',
    shortSummary: 'About 150 British soldiers held a mission station against 4,000 Zulu warriors for 12 hours, earning 11 Victoria Crosses.',
    whyItMatters: [
      'Most Victoria Crosses awarded for a single action',
      'Restored British morale after Isandlwana disaster',
      'Became legendary symbol of British courage'
    ],
    tags: ['colonial', 'zulu', 'defense', 'heroism'],
    difficulty: 3,
    facts: [
      '150 defenders vs 4,000 Zulu warriors',
      '11 Victoria Crosses were awarded',
      'Defense lasted 12 hours through the night',
      'Same day as Isandlwana massacre nearby',
      'Defenders built barriers from mealie bags'
    ]
  },
  {
    id: 'iwo-jima',
    title: 'Battle of Iwo Jima',
    date: 'February 19 - March 26, 1945',
    year: 1945,
    era: 'ww2',
    continent: 'asia',
    region: 'Japan',
    conflict: 'World War II',
    lat: 24.7833,
    lng: 141.3167,
    sides: { aName: 'United States Marines', bName: 'Imperial Japanese Army' },
    commanders: { a: ['Holland Smith'], b: ['Tadamichi Kuribayashi'] },
    outcome: 'American victory',
    shortSummary: 'Marines captured a volcanic island fortress in some of the bloodiest fighting of WWII. The flag raising became an iconic image.',
    whyItMatters: [
      'Iconic flag-raising photograph defined WWII imagery',
      'Provided vital airfields for bombing Japan',
      'Demonstrated fierce Japanese resistance'
    ],
    tags: ['pacific', 'marines', 'island-hopping', 'ww2'],
    difficulty: 4,
    facts: [
      'Iconic flag raising photographed on Mount Suribachi',
      'Nearly all 21,000 Japanese defenders killed',
      '6,800 American Marines killed',
      'Island was 8 square miles of volcanic rock',
      '27 Medals of Honor awarded'
    ]
  },
  {
    id: 'marne',
    title: 'First Battle of the Marne',
    date: 'September 5-12, 1914',
    year: 1914,
    era: 'ww1',
    continent: 'europe',
    region: 'France',
    conflict: 'World War I',
    lat: 48.9500,
    lng: 3.3833,
    sides: { aName: 'France & Britain', bName: 'German Empire' },
    commanders: { a: ['Joseph Joffre', 'Joseph Gallieni'], b: ['Helmuth von Moltke'] },
    outcome: 'Allied victory',
    shortSummary: 'The "Miracle of the Marne" stopped the German advance on Paris and ended hopes for a quick victory, leading to four years of trench warfare.',
    whyItMatters: [
      'Saved Paris and prevented quick German victory',
      'Led to the stalemate of trench warfare',
      'Taxis rushed troops from Paris to the front'
    ],
    tags: ['ww1', 'france', 'trench', 'turning-point'],
    difficulty: 4,
    facts: [
      'Paris taxis rushed 6,000 troops to the front',
      'Ended the German Schlieffen Plan',
      'Over 500,000 total casualties',
      'Gap opened in German lines',
      'Both sides dug trenches afterward'
    ]
  },
  {
    id: 'passchendaele',
    title: 'Battle of Passchendaele',
    date: 'July 31 - November 10, 1917',
    year: 1917,
    era: 'ww1',
    continent: 'europe',
    region: 'Belgium',
    conflict: 'World War I',
    lat: 50.9000,
    lng: 3.0167,
    sides: { aName: 'British Empire & Allies', bName: 'German Empire' },
    commanders: { a: ['Douglas Haig'], b: ['Crown Prince Rupprecht'] },
    outcome: 'British pyrrhic victory',
    shortSummary: 'Three months of fighting in mud and rain gained five miles at the cost of half a million casualties. The name became synonymous with senseless slaughter.',
    whyItMatters: [
      'Symbol of the futility of WWI',
      'Half a million casualties for 5 miles',
      'Soldiers drowned in shell-crater mud'
    ],
    tags: ['ww1', 'mud', 'attrition', 'belgium'],
    difficulty: 4,
    facts: [
      'Men drowned in mud-filled shell craters',
      'Constant rain turned battlefield to swamp',
      'Over 500,000 total casualties',
      'Gained only 5 miles in 3 months',
      'Also known as Third Battle of Ypres'
    ]
  },
  {
    id: 'bulge',
    title: 'Battle of the Bulge',
    date: 'December 16, 1944 - January 25, 1945',
    year: 1944,
    era: 'ww2',
    continent: 'europe',
    region: 'Belgium',
    conflict: 'World War II',
    lat: 50.1833,
    lng: 5.9667,
    sides: { aName: 'Allied Forces', bName: 'Nazi Germany' },
    commanders: { a: ['Dwight Eisenhower', 'George Patton'], b: ['Gerd von Rundstedt'] },
    outcome: 'Allied victory',
    shortSummary: 'Germany\'s last major offensive in the West. The surprise attack created a "bulge" in Allied lines before being crushed, hastening Germany\'s defeat.',
    whyItMatters: [
      'Germany\'s last major offensive of WWII',
      'Largest battle fought by the US Army',
      'Depleted Germany\'s last reserves'
    ],
    tags: ['ww2', 'winter', 'offensive', 'ardennes'],
    difficulty: 4,
    facts: [
      'Largest battle in US Army history',
      '19,000 American soldiers killed',
      'Germans used English-speaking infiltrators',
      'Siege of Bastogne became legendary',
      'German Commander McAuliffe replied "Nuts!" to surrender demand'
    ]
  },
  {
    id: 'buena-vista',
    title: 'Battle of Buena Vista',
    date: 'February 22-23, 1847',
    year: 1847,
    era: 'modern',
    continent: 'americas',
    region: 'Mexico',
    conflict: 'Mexican-American War',
    lat: 25.0450,
    lng: -100.9167,
    sides: { aName: 'United States', bName: 'Mexico' },
    commanders: { a: ['Zachary Taylor'], b: ['Antonio López de Santa Anna'] },
    outcome: 'American victory',
    shortSummary: 'Outnumbered American forces defeated Santa Anna\'s large army, securing northern Mexico and making Zachary Taylor a national hero.',
    whyItMatters: [
      'Secured American control of northern Mexico',
      'Made Zachary Taylor a future president',
      'Demonstrated American military strength'
    ],
    tags: ['mexican-war', 'america', 'taylor', 'underdog'],
    difficulty: 3,
    facts: [
      'Taylor had 4,500 men vs 15,000 Mexicans',
      'Santa Anna retreated despite winning the first day',
      'Taylor became 12th US President',
      'Jefferson Davis (future Confederate president) fought here',
      'Famous for "A little more grape, Captain Bragg"'
    ]
  },
  {
    id: 'talas',
    title: 'Battle of Talas',
    date: 'July 751',
    year: 751,
    era: 'medieval',
    continent: 'asia',
    region: 'Kazakhstan',
    conflict: 'Arab-Tang Conflict',
    lat: 42.5167,
    lng: 72.2333,
    sides: { aName: 'Abbasid Caliphate', bName: 'Tang Dynasty China' },
    commanders: { a: ['Ziyad ibn Salih'], b: ['Gao Xianzhi'] },
    outcome: 'Abbasid victory',
    shortSummary: 'Arab forces defeated the Chinese Tang Dynasty, halting Chinese expansion westward and spreading papermaking to the Islamic world.',
    whyItMatters: [
      'Stopped Chinese expansion into Central Asia',
      'Spread papermaking technology to the West',
      'Defined the boundary between Islamic and Chinese spheres'
    ],
    tags: ['tang', 'arab', 'silk-road', 'technology'],
    difficulty: 3,
    facts: [
      'Chinese prisoners taught Arabs papermaking',
      'Karluk Turks switched sides mid-battle',
      'Paper reached Europe centuries later via this route',
      'Only major battle between Arab and Chinese forces',
      'Both empires soon faced internal problems'
    ]
  },
  {
    id: 'constantinople-1453',
    title: 'Fall of Constantinople',
    date: 'May 29, 1453',
    year: 1453,
    era: 'medieval',
    continent: 'asia',
    region: 'Turkey',
    conflict: 'Ottoman Conquest',
    lat: 41.0082,
    lng: 28.9784,
    sides: { aName: 'Ottoman Empire', bName: 'Byzantine Empire' },
    commanders: { a: ['Mehmed II'], b: ['Constantine XI'] },
    outcome: 'Ottoman victory',
    shortSummary: 'The Ottomans conquered the Byzantine capital using massive cannons, ending the Roman Empire after 1,500 years and reshaping world history.',
    whyItMatters: [
      'Ended the Byzantine/Eastern Roman Empire',
      'Established Ottoman control of East-West trade routes',
      'Spurred European exploration for new trade routes'
    ],
    tags: ['ottoman', 'byzantine', 'siege', 'cannons'],
    difficulty: 4,
    facts: [
      'Mehmed was only 21 years old',
      'Massive cannons breached the legendary walls',
      'Constantine XI died fighting on the walls',
      'Ottoman ships were dragged overland into the harbor',
      'Hagia Sophia was converted to a mosque'
    ]
  },
  {
    id: 'nagashino',
    title: 'Battle of Nagashino',
    date: 'June 29, 1575',
    year: 1575,
    era: 'medieval',
    continent: 'asia',
    region: 'Japan',
    conflict: 'Sengoku Period Wars',
    lat: 34.9333,
    lng: 137.5667,
    sides: { aName: 'Oda-Tokugawa Alliance', bName: 'Takeda Clan' },
    commanders: { a: ['Oda Nobunaga', 'Tokugawa Ieyasu'], b: ['Takeda Katsuyori'] },
    outcome: 'Oda-Tokugawa victory',
    shortSummary: 'Oda Nobunaga used massed firearms behind wooden palisades to devastate the famous Takeda cavalry, revolutionizing Japanese warfare.',
    whyItMatters: [
      'First major use of firearms in Japanese warfare',
      'Ended the dominance of cavalry charges',
      'Advanced Oda Nobunaga\'s unification of Japan'
    ],
    tags: ['firearms', 'samurai', 'cavalry', 'japan'],
    difficulty: 3,
    facts: [
      '3,000 arquebusiers fired in rotating volleys',
      'Takeda cavalry was destroyed',
      'Wooden palisades protected the gunners',
      'Changed Japanese military tactics forever',
      'Nobunaga had studied European firearms'
    ]
  },
  {
    id: 'myeongnyang',
    title: 'Battle of Myeongnyang',
    date: 'October 26, 1597',
    year: 1597,
    era: 'medieval',
    continent: 'asia',
    region: 'Korea',
    conflict: 'Japanese Invasions of Korea',
    lat: 34.5667,
    lng: 126.3083,
    sides: { aName: 'Joseon Korea', bName: 'Toyotomi Japan' },
    commanders: { a: ['Admiral Yi Sun-sin'], b: ['Todo Takatora'] },
    outcome: 'Korean victory',
    shortSummary: 'Admiral Yi Sun-sin with just 13 ships defeated a Japanese fleet of 333 ships using the narrow strait\'s currents to his advantage.',
    whyItMatters: [
      'One of history\'s greatest naval victories',
      'Prevented Japanese conquest of Korea',
      'Admiral Yi is considered one of history\'s greatest admirals'
    ],
    tags: ['naval', 'korea', 'japan', 'underdog'],
    difficulty: 4,
    facts: [
      '13 Korean ships vs 333 Japanese ships',
      'Yi used the strait\'s treacherous currents',
      '31 Japanese ships sunk, none Korean',
      'Yi had been stripped of rank but reinstated',
      'Turtle ships were not used in this battle'
    ]
  },
  {
    id: 'kohima',
    title: 'Battle of Kohima',
    date: 'April 4 - June 22, 1944',
    year: 1944,
    era: 'ww2',
    continent: 'asia',
    region: 'India',
    conflict: 'World War II',
    lat: 25.6667,
    lng: 94.1000,
    sides: { aName: 'British-Indian Forces', bName: 'Imperial Japan' },
    commanders: { a: ['Montagu Stopford'], b: ['Kotoku Sato'] },
    outcome: 'British-Indian victory',
    shortSummary: 'British and Indian forces stopped the Japanese invasion of India in brutal fighting around a tennis court, turning the tide in Burma.',
    whyItMatters: [
      'Stopped Japanese invasion of India',
      'Turning point of the Burma Campaign',
      'Voted Britain\'s greatest battle in 2013'
    ],
    tags: ['ww2', 'burma', 'india', 'turning-point'],
    difficulty: 4,
    facts: [
      'Fierce fighting around the DC\'s tennis court',
      'Japanese supply lines completely failed',
      'Both sides suffered from disease and starvation',
      'Called the "Stalingrad of the East"',
      'Led to the largest defeat in Japanese history'
    ]
  },
  {
    id: 'bach-dang',
    title: 'Battle of Bạch Đằng',
    date: '938 AD',
    year: 938,
    era: 'medieval',
    continent: 'asia',
    region: 'Vietnam',
    conflict: 'Vietnamese Independence War',
    lat: 20.8500,
    lng: 106.7500,
    sides: { aName: 'Vietnamese Forces', bName: 'Southern Han China' },
    commanders: { a: ['Ngô Quyền'], b: ['Liu Hongcao'] },
    outcome: 'Vietnamese victory',
    shortSummary: 'Vietnamese forces used iron-tipped stakes hidden underwater to destroy the Chinese fleet, ending 1,000 years of Chinese rule.',
    whyItMatters: [
      'Ended 1,000 years of Chinese domination',
      'Established Vietnamese independence',
      'Brilliant use of tides as a weapon'
    ],
    tags: ['naval', 'vietnam', 'china', 'independence'],
    difficulty: 3,
    facts: [
      'Iron-tipped stakes were hidden at high tide',
      'Chinese fleet was trapped at low tide',
      'Liu Hongcao was killed in battle',
      'Vietnam remained independent for centuries',
      'Tactic was used again in later invasions'
    ]
  },
  {
    id: 'panipat-third',
    title: 'Third Battle of Panipat',
    date: 'January 14, 1761',
    year: 1761,
    era: 'modern',
    continent: 'asia',
    region: 'India',
    conflict: 'Maratha-Durrani War',
    lat: 29.3909,
    lng: 76.9635,
    sides: { aName: 'Durrani Empire', bName: 'Maratha Empire' },
    commanders: { a: ['Ahmad Shah Durrani'], b: ['Sadashivrao Bhau'] },
    outcome: 'Durrani victory',
    shortSummary: 'One of the largest and bloodiest 18th century battles, the Afghan victory devastated the Marathas and changed Indian history.',
    whyItMatters: [
      'One of the bloodiest battles in 18th century',
      'Ended Maratha expansion northward',
      'Paved the way for British dominance in India'
    ],
    tags: ['maratha', 'afghan', 'india', 'massive'],
    difficulty: 4,
    facts: [
      'Over 100,000 combatants on each side',
      'Up to 70,000 killed in one day',
      'Maratha leader Bhau was killed',
      'Afghan artillery proved decisive',
      'Weakened India before British expansion'
    ]
  },
  {
    id: 'pyramids',
    title: 'Battle of the Pyramids',
    date: 'July 21, 1798',
    year: 1798,
    era: 'napoleonic',
    continent: 'africa',
    region: 'Egypt',
    conflict: 'French Campaign in Egypt',
    lat: 29.9765,
    lng: 31.1313,
    sides: { aName: 'French Republic', bName: 'Mamluk Egypt' },
    commanders: { a: ['Napoleon Bonaparte'], b: ['Murad Bey'] },
    outcome: 'French victory',
    shortSummary: 'Napoleon\'s army defeated the Mamluk cavalry using infantry squares, conquering Egypt and beginning modern Egyptology.',
    whyItMatters: [
      'Demonstrated the power of modern infantry tactics',
      'French occupation sparked modern Egyptology',
      'Discovery of the Rosetta Stone'
    ],
    tags: ['napoleon', 'egypt', 'cavalry', 'squares'],
    difficulty: 3,
    facts: [
      'Napoleon said "Soldiers, 40 centuries look down upon you"',
      'French infantry squares defeated Mamluk cavalry',
      'French lost only 300 men vs 6,000 Mamluks',
      'Led to discovery of the Rosetta Stone',
      'Britain later destroyed the French fleet'
    ]
  },
  {
    id: 'khartoum',
    title: 'Siege of Khartoum',
    date: 'March 13, 1884 - January 26, 1885',
    year: 1885,
    era: 'modern',
    continent: 'africa',
    region: 'Sudan',
    conflict: 'Mahdist War',
    lat: 15.5007,
    lng: 32.5599,
    sides: { aName: 'Mahdist Sudan', bName: 'Egyptian-British Forces' },
    commanders: { a: ['Muhammad Ahmad (The Mahdi)'], b: ['General Charles Gordon'] },
    outcome: 'Mahdist victory',
    shortSummary: 'Mahdist forces captured Khartoum and killed General "Chinese" Gordon, shocking Victorian Britain and creating a legendary martyr.',
    whyItMatters: [
      'Created the legend of General Gordon',
      'Shocked Victorian Britain',
      'Led to eventual British reconquest of Sudan'
    ],
    tags: ['colonial', 'siege', 'sudan', 'martyrdom'],
    difficulty: 3,
    facts: [
      'Gordon was killed two days before relief arrived',
      'Siege lasted 317 days',
      'Gordon became a Victorian hero and martyr',
      'Led to the Omdurman campaign 13 years later',
      'The Mahdi died months after the victory'
    ]
  },
  {
    id: 'tangier',
    title: 'Battle of Alcácer Quibir',
    date: 'August 4, 1578',
    year: 1578,
    era: 'medieval',
    continent: 'africa',
    region: 'Morocco',
    conflict: 'Portuguese-Moroccan War',
    lat: 35.0000,
    lng: -5.9333,
    sides: { aName: 'Saadian Morocco', bName: 'Kingdom of Portugal' },
    commanders: { a: ['Ahmad al-Mansur'], b: ['King Sebastian I'] },
    outcome: 'Moroccan victory',
    shortSummary: 'Three kings died in this battle as Morocco crushed Portuguese ambitions in North Africa, leading to the end of Portuguese independence.',
    whyItMatters: [
      'Three kings died - "Battle of the Three Kings"',
      'Ended Portuguese expansion in Africa',
      'Led to Spanish annexation of Portugal'
    ],
    tags: ['portugal', 'morocco', 'kings', 'crusade'],
    difficulty: 3,
    facts: [
      'All three kings died in battle',
      'Sebastian\'s body was never confirmed found',
      'Portugal was annexed by Spain two years later',
      'Morocco\'s golden age followed',
      'Sebastian became a messianic figure in Portugal'
    ]
  },
  {
    id: 'kairouan',
    title: 'Battle of Kairouan',
    date: '683 AD',
    year: 683,
    era: 'medieval',
    continent: 'africa',
    region: 'Tunisia',
    conflict: 'Arab Conquest of North Africa',
    lat: 35.6781,
    lng: 10.0963,
    sides: { aName: 'Berber Forces', bName: 'Umayyad Caliphate' },
    commanders: { a: ['Kusaila'], b: ['Uqba ibn Nafi'] },
    outcome: 'Berber victory',
    shortSummary: 'Berber forces ambushed and killed the Arab conqueror Uqba ibn Nafi, temporarily halting the Arab conquest of North Africa.',
    whyItMatters: [
      'Temporarily stopped Arab expansion in Africa',
      'Showed Berber military capability',
      'Arab conquest eventually succeeded'
    ],
    tags: ['berber', 'arab', 'conquest', 'ambush'],
    difficulty: 3,
    facts: [
      'Uqba had reached the Atlantic Ocean',
      'Kusaila was a Christian Berber chief',
      'Arabs returned to conquer within decades',
      'Uqba is revered as a martyr in Islam',
      'Kairouan became a holy city'
    ]
  },
  {
    id: 'tenochtitlan',
    title: 'Fall of Tenochtitlan',
    date: 'May 26 - August 13, 1521',
    year: 1521,
    era: 'modern',
    continent: 'americas',
    region: 'Mexico',
    conflict: 'Spanish Conquest of the Aztec Empire',
    lat: 19.4326,
    lng: -99.1332,
    sides: { aName: 'Spanish-Tlaxcalan Alliance', bName: 'Aztec Empire' },
    commanders: { a: ['Hernán Cortés'], b: ['Cuauhtémoc'] },
    outcome: 'Spanish victory',
    shortSummary: 'Cortés and his indigenous allies conquered the Aztec capital after a brutal siege, ending one of history\'s great civilizations.',
    whyItMatters: [
      'Ended the Aztec Empire',
      'Beginning of Spanish Mexico',
      'One of history\'s most dramatic conquests'
    ],
    tags: ['conquest', 'aztec', 'spain', 'siege'],
    difficulty: 4,
    facts: [
      'Smallpox killed more Aztecs than Spanish weapons',
      'Cortés built ships to attack the island city',
      'Indigenous allies provided most of the soldiers',
      'City was largely destroyed in the siege',
      'Mexico City was built on the ruins'
    ]
  },
  {
    id: 'cajamarca',
    title: 'Battle of Cajamarca',
    date: 'November 16, 1532',
    year: 1532,
    era: 'modern',
    continent: 'americas',
    region: 'Peru',
    conflict: 'Spanish Conquest of the Inca Empire',
    lat: -7.1617,
    lng: -78.5127,
    sides: { aName: 'Spanish Conquistadors', bName: 'Inca Empire' },
    commanders: { a: ['Francisco Pizarro'], b: ['Atahualpa'] },
    outcome: 'Spanish victory',
    shortSummary: 'Pizarro captured the Inca emperor Atahualpa in a surprise attack, beginning the fall of the mighty Inca Empire.',
    whyItMatters: [
      'Led to the fall of the Inca Empire',
      'One of history\'s most audacious ambushes',
      'Changed South American history forever'
    ],
    tags: ['conquest', 'inca', 'spain', 'ambush'],
    difficulty: 3,
    facts: [
      '168 Spanish captured the Inca emperor',
      'Atahualpa filled a room with gold as ransom',
      'The Spanish executed Atahualpa anyway',
      'Inca army of 80,000 fled in panic',
      'Horses and guns terrified the Incas'
    ]
  },
  {
    id: 'san-juan-hill',
    title: 'Battle of San Juan Hill',
    date: 'July 1, 1898',
    year: 1898,
    era: 'modern',
    continent: 'americas',
    region: 'Cuba',
    conflict: 'Spanish-American War',
    lat: 20.0167,
    lng: -75.8333,
    sides: { aName: 'United States', bName: 'Kingdom of Spain' },
    commanders: { a: ['William Shafter', 'Theodore Roosevelt'], b: ['Arsenio Linares'] },
    outcome: 'American victory',
    shortSummary: 'American forces including Roosevelt\'s Rough Riders stormed Spanish positions outside Santiago, making Teddy Roosevelt a national hero.',
    whyItMatters: [
      'Made Theodore Roosevelt a national hero',
      'Led to American victory in Cuba',
      'Established USA as an imperial power'
    ],
    tags: ['spanish-american', 'roosevelt', 'cuba', 'cavalry'],
    difficulty: 2,
    facts: [
      'Roosevelt led the Rough Riders up Kettle Hill',
      'Buffalo Soldiers played a crucial role',
      'Spanish were outnumbered but fortified',
      'Roosevelt called it his "crowded hour"',
      'He became president 3 years later'
    ]
  },
  {
    id: 'falklands',
    title: 'Falklands War',
    date: 'April 2 - June 14, 1982',
    year: 1982,
    era: 'modern',
    continent: 'americas',
    region: 'Falkland Islands',
    conflict: 'Falklands War',
    lat: -51.7963,
    lng: -59.5236,
    sides: { aName: 'United Kingdom', bName: 'Argentina' },
    commanders: { a: ['Margaret Thatcher', 'John Woodward'], b: ['Leopoldo Galtieri'] },
    outcome: 'British victory',
    shortSummary: 'Britain recaptured the Falkland Islands from Argentina in a short but intense modern war 8,000 miles from home.',
    whyItMatters: [
      'Demonstrated power projection capabilities',
      'Boosted Margaret Thatcher\'s government',
      'Led to fall of Argentine military junta'
    ],
    tags: ['modern', 'naval', 'air-war', 'britain'],
    difficulty: 3,
    facts: [
      'Britain sailed 8,000 miles to fight',
      'Exocet missiles sank British ships',
      'Argentina lost the cruiser Belgrano',
      '649 Argentines and 255 British died',
      'Led to return of democracy in Argentina'
    ]
  },
  {
    id: 'chapultepec',
    title: 'Battle of Chapultepec',
    date: 'September 12-13, 1847',
    year: 1847,
    era: 'modern',
    continent: 'americas',
    region: 'Mexico',
    conflict: 'Mexican-American War',
    lat: 19.4204,
    lng: -99.1818,
    sides: { aName: 'United States', bName: 'Mexico' },
    commanders: { a: ['Winfield Scott'], b: ['Nicolás Bravo'] },
    outcome: 'American victory',
    shortSummary: 'American forces stormed Chapultepec Castle, where young Mexican cadets died defending it, becoming the legendary "Niños Héroes."',
    whyItMatters: [
      'Led to capture of Mexico City',
      'Created Mexican national heroes - Niños Héroes',
      'Ended the Mexican-American War'
    ],
    tags: ['mexican-war', 'heroes', 'siege', 'america'],
    difficulty: 3,
    facts: [
      'Six teenage cadets died defending the castle',
      'They are honored as Niños Héroes in Mexico',
      'Marines reference this in their hymn',
      'Mexico City fell the next day',
      'U.S. gained California and the Southwest'
    ]
  },
  {
    id: 'carabobo',
    title: 'Battle of Carabobo',
    date: 'June 24, 1821',
    year: 1821,
    era: 'modern',
    continent: 'americas',
    region: 'Venezuela',
    conflict: 'Venezuelan War of Independence',
    lat: 10.2167,
    lng: -68.0167,
    sides: { aName: 'Gran Colombian Patriots', bName: 'Spanish Royalists' },
    commanders: { a: ['Simón Bolívar', 'José Antonio Páez'], b: ['Miguel de la Torre'] },
    outcome: 'Patriot victory',
    shortSummary: 'Bolívar\'s decisive victory secured Venezuelan independence and opened the path to liberating the rest of northern South America.',
    whyItMatters: [
      'Secured Venezuelan independence',
      'Key step in South American liberation',
      'Demonstrated Bolívar\'s military genius'
    ],
    tags: ['independence', 'bolivar', 'venezuela', 'liberation'],
    difficulty: 3,
    facts: [
      'Battle lasted less than an hour',
      'British Legion played a crucial role',
      'Spanish lost 3,000 men',
      'Venezuela celebrates this as Independence Day',
      'Bolívar went on to liberate more nations'
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
