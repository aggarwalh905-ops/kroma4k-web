/**
 * Generates highly diverse, non-repetitive AI prompts by layering 
 * subjects, atmospheric conditions, and complex artistic compositions.
 */
export function generateRandomPrompt(category: string): string {
  
  const subjects: Record<string, string[]> = {
    "Anime": ["Cybernetic samurai", "Mecha pilot cockpit", "Shinto shrine in the clouds", "Street food stall in Neo-Tokyo", "High-school roof sunset", "Magical girl battle armor", "Studio Ghibli lush meadow", "Ghost in the shell style cyborg", "Lo-fi study room"],
    "Cyberpunk": ["Rain-slicked neon alley", "Underground bio-hacking clinic", "Corporate skyscraper apex", "Android jazz club", "Holographic fish market", "Cyber-punk nomad camp", "Nerve-center server room", "Flying cargo ship", "Augmented reality street fight"],
    "Nature": ["Bioluminescent mushroom forest", "Frosted mountain peaks", "Volcanic obsidian beach", "Deep underwater coral reef", "Monsoon in a tropical jungle", "Golden desert dunes", "Arctic aurora borealis", "Ancient redwood grove", "Crystal cave interior"],
    "Space": ["Black hole event horizon", "Terraformed mars colony", "Alien monolith on a moon", "Abandoned derelict space station", "Ringed gas giant sunrise", "Interstellar wormhole", "Asteroid mining rig", "Nebula cloud nursery", "Exoplanet jungle"],
    "Minimal": ["Single geometric glass prism", "Solitary lighthouse on white cliff", "Shadow of a window on a wall", "Zen sand garden patterns", "Monochrome architectural curve", "Single floating leaf", "Abstract paper fold", "Lone boat on still water"],
    "Cars": ["Hyper-car with active aero", "Vintage 1960s luxury roadster", "Post-apocalyptic armored truck", "Concept electric drift car", "Formula 1 car on a futuristic track", "Classic muscle car in a diner lot", "Levitating mag-lev vehicle", "Sleek chrome sports car"],
    "Abstract": ["Exploding liquid ink swirls", "Geometric crystalline structure", "Fractal smoke patterns", "Luminous silk flowing in air", "Macro soap bubble surface", "Iridescent melting metal", "Digital glitch datamosh", "Vibrant light-painting trails"],
    "Architecture": ["Brutalist floating library", "Glass treehouse skyscraper", "Ancient Mayan ruins with tech", "Islamic patterns in modern marble", "Underwater biodome", "Steampunk clocktower city", "Gothic cathedral with neon windows", "Eco-village in a canyon"],
    "Fantasy": ["Dragon's gold-filled lair", "Floating wizard academy", "Etherial spirit forest", "Sword forged in starlight", "Giant stone golem", "Crystal castle at dawn", "Deep sea mermaid kingdom", "Phoenix nesting in a volcano"],
    "Cinematic": ["Lone traveler in a dust storm", "Noir detective office", "Epic high-fantasy battlefield", "Romantic rainy pier at night", "Post-apocalyptic overgrown city", "Western desert standoff", "Viking longship in a storm", "Sun-drenched Mediterranean balcony"]
  };

  const atmospherics = [
    "shrouded in heavy fog", "drenched in neon rain", "bathed in golden hour light", 
    "illuminated by a solar flare", "under a double moon", "caught in a temporal rift", 
    "during a cosmic dust storm", "in a world of eternal twilight", "with glowing embers in the air",
    "under high-contrast chiaroscuro lighting", "lit by soft volumetric rays"
  ];

  const modifiers = [
    "with intricate gold filigree", "shattering into crystalline shards", "decaying into digital voxels", 
    "covered in bioluminescent moss", "floating in zero gravity", "with hyper-detailed textures", 
    "surrounded by floating sacred geometry", "featuring deep reflections and Ray Tracing",
    "weathered by centuries of sand", "infused with liquid mercury flows"
  ];

  const artistry = [
    "Hyper-realistic 8K Octane Render", "Cinematic Unreal Engine 5 style", "Hand-painted oil masterpiece", 
    "Retro-futuristic synthwave aesthetic", "Fine art photography", "Biomechanical surrealism", 
    "Architectural digest editorial", "Makoto Shinkai anime style", "Kodak Portra 400 film look"
  ];

  const composition = [
    "dramatic low-angle shot", "aerial drone panorama", "extreme macro close-up", 
    "anamorphic wide-screen perspective", "symmetrical center composition", 
    "depth-of-field with heavy bokeh", "bird's eye view", "dynamic Dutch angle"
  ];

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  
  const categoryList = subjects[category] || ["Surreal masterpiece", "Intricate conceptual art"];
  
  // To ensure the "Unique ID" doesn't just look like a string, 
  // we use it to seed a specific seed-number for AI models that support it.
  const seed = Math.floor(Math.random() * 1000000);

  /**
   * DIVERSITY LOGIC: 
   * We alternate the structure so the AI doesn't get "bored" of the same sentence flow.
   */
  const subject = pick(categoryList);
  const atmosphere = pick(atmospherics);
  const detail = pick(modifiers);
  const style = pick(artistry);
  const comp = pick(composition);

  // Randomly shuffle the order of the sentence for maximum variety
  const structures = [
    `${subject}, ${atmosphere}, ${detail}. ${style}, ${comp}, 8k resolution, seed-${seed}`,
    `${style} of ${subject}. ${detail}, ${atmosphere}, ${comp}, sharp focus, masterpiece`,
    `${comp} showing ${subject} ${detail}. ${atmosphere}, trending on ArtStation, ${style}`,
    `A masterpiece ${subject} ${atmosphere}. ${style}, ${detail}, extremely detailed 8k, unique-render-${seed}`
  ];

  return pick(structures);
}