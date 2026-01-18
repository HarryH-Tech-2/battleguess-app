export interface EducationalArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  readTime: number;
  category: string;
}

export const educationalArticles: EducationalArticle[] = [
  {
    id: 'tactics-evolution',
    title: 'The Evolution of Military Tactics',
    summary: 'From phalanx formations to modern warfare, explore how battle tactics changed through history.',
    content: `Military tactics have evolved dramatically throughout human history. The ancient Greeks perfected the phalanx formation, where soldiers with overlapping shields created an almost impenetrable wall of spears.

The Romans adapted this into their famous legionary system, with flexible cohorts that could maneuver independently. Medieval warfare saw the rise of heavy cavalry, which dominated battlefields until the longbow and pike formations proved their vulnerability.

The introduction of gunpowder revolutionized warfare, leading to new formations like the tercio and eventually the linear tactics of the 18th century. Napoleon's mobile warfare emphasized speed and concentration of force.

World War I brought trench warfare and the first tanks, while World War II saw the development of combined arms tactics and blitzkrieg. Modern warfare continues to evolve with technology, from precision-guided weapons to cyber warfare.`,
    imageUrl: 'https://r2-pub.rork.com/generated-images/0bdecc0d-eaec-4559-8a98-2dacb5845d57.png',
    readTime: 5,
    category: 'Strategy',
  },
  {
    id: 'famous-commanders',
    title: 'History\'s Greatest Military Commanders',
    summary: 'Learn about the brilliant minds who shaped the course of history through warfare.',
    content: `Throughout history, certain military commanders have stood above the rest, their genius reshaping the political landscape of their times.

Alexander the Great conquered the known world by age 30, never losing a battle. His innovative use of the Macedonian phalanx combined with cavalry created an unstoppable force.

Hannibal Barca nearly brought Rome to its knees, crossing the Alps with elephants and winning stunning victories at Trebia, Lake Trasimene, and Cannae.

Napoleon Bonaparte revolutionized warfare with his corps system and ability to concentrate forces at decisive points. His campaigns at Austerlitz and Jena-Auerstedt are still studied today.

Other notable commanders include Julius Caesar, whose conquest of Gaul expanded Roman power; Genghis Khan, who built the largest contiguous empire in history; and more recent figures like Erwin Rommel and Georgy Zhukov.`,
    imageUrl: 'https://r2-pub.rork.com/generated-images/3ec73185-0192-4807-be1b-437be5b48ddf.png',
    readTime: 4,
    category: 'Leaders',
  },
  {
    id: 'weapons-warfare',
    title: 'Weapons That Changed Warfare',
    summary: 'Discover the technological innovations that transformed how wars were fought.',
    content: `Certain weapons have fundamentally changed the nature of warfare, rendering old tactics obsolete and creating new military paradigms.

The longbow gave English armies a devastating advantage at Crécy and Agincourt, allowing commoners to defeat armored knights.

Gunpowder weapons gradually replaced traditional arms. The arquebus and musket ended the dominance of heavy cavalry and castle fortifications.

The machine gun transformed WWI into a defensive stalemate, making traditional charges suicidal. The tank was developed to break this deadlock.

Aircraft brought warfare into the third dimension. Bombers could strike deep behind enemy lines, while fighters fought for air superiority.

Nuclear weapons changed warfare entirely, making direct conflict between major powers potentially catastrophic. This led to the Cold War doctrine of mutually assured destruction.`,
    imageUrl: 'https://r2-pub.rork.com/generated-images/02d33d06-858a-41d3-baa2-df38f15fa9b6.png',
    readTime: 4,
    category: 'Technology',
  },
  {
    id: 'decisive-battles',
    title: 'Battles That Shaped History',
    summary: 'Explore the pivotal battles that determined the fate of empires and nations.',
    content: `Some battles have consequences far beyond the immediate military outcome, reshaping the political and cultural landscape for centuries.

Marathon (490 BC) preserved Greek independence and allowed the flowering of classical civilization that would influence the entire Western world.

The Siege of Constantinople (1453) ended the Byzantine Empire and established Ottoman dominance in the Eastern Mediterranean for centuries.

Waterloo (1815) ended Napoleon's ambitions and ushered in a century of relative peace in Europe under the Concert of Nations.

Stalingrad (1942-43) marked the turning point of WWII in Europe, breaking the Wehrmacht's offensive power and beginning the Soviet march to Berlin.

Each of these battles represented a fork in history's road, where the outcome determined the rise and fall of empires and the spread of ideas and cultures.`,
    imageUrl: 'https://r2-pub.rork.com/generated-images/f9d1e7fa-c4d8-410b-b1f2-a53900c99995.png',
    readTime: 5,
    category: 'History',
  },
];
