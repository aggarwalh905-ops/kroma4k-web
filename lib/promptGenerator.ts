export function generateRandomPrompt(category: string): string {
  // Mapping categories to specific subjects to ensure visual accuracy
  const categorySubjects: Record<string, string[]> = {
    "Anime": ["Mecha pilot in a cockpit", "Studio Ghibli style meadow", "Cybernetic ninja", "School rooftop at sunset", "Magical girl transformation"],
    "Cyberpunk": ["Neon-drenched alleyway", "High-tech prosthetic hand", "Flying car over megacity", "Android in a rainstorm", "Cyber-bar interior"],
    "Nature": ["Mist-covered emerald valley", "Ancient giant sequoia tree", "Hidden waterfall lagoon", "Crystal-clear mountain lake", "Autumn forest path"],
    "Space": ["Swirling violet nebula", "Ringed gas giant planet", "Sleek interstellar station", "Astronaut drifting in void", "Supernova explosion"],
    "Minimal": ["Single geometric shape", "Lone tree on a white hill", "Abstract line art", "Zen stone balance", "Minimalist architectural shadow"],
    "Cars": ["Futuristic electric supercar", "Vintage muscle car in desert", "Neon drift racing car", "Luxury chrome vehicle", "Cyber-truck concept"],
    "Abstract": ["Flowing liquid gold", "Shattering glass prisms", "Digital smoke swirls", "Luminous particle waves", "Floating 3D fractals"],
    "Architecture": ["Brutalist concrete tower", "Floating marble palace", "Eco-friendly skyscraper", "Ancient ruins in jungle", "Gothic cathedral interior"],
    "Fantasy": ["Dragon guarding a castle", "Elven treehouse village", "Wizard's study with floating books", "Phoenix rising from ashes", "Enchanted sword in stone"],
    "Cinematic": ["Dark moody noir street", "Epic battlefield horizon", "Desert wanderer silhouette", "Vibrant sunset beach", "Explosive spaceship escape"]
  };

  const timeContext = [
    "at dawn", "during a solar eclipse", "in the year 3025", "at midnight", 
    "under a blood moon", "in a frozen moment", "during a cosmic storm", "in golden hour"
  ];

  const subDetails = [
    "with neon rain and reflections", "surrounded by glowing embers", "covered in golden circuits",
    "shattering into digital pixels", "entwined with ancient vines", "floating in zero gravity",
    "emerging from deep shadows", "decorated with sacred geometry", "weathered by sandstorms"
  ];

  const artisticStyles = [
    "Hyper-realistic Octane Render", "Studio Ghibli aesthetic", "Synthwave vibe", 
    "Cinematic Unreal Engine 5", "Biomechanical art", "Modern Minimalist", 
    "Cybernetic Impressionism", "Surrealism", "Vivid 4K Photography"
  ];

  const cameraAndLens = [
    "8k resolution macro lens", "Cinematic anamorphic wide-shot", "Aerial drone view",
    "Fisheye perspective", "Low-angle heroic shot", "Telephoto lens compression"
  ];

  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  
  // 1. Get subjects based on category, fallback to a general list if category is missing
  const subjects = categorySubjects[category] || ["Surreal masterpiece", "Ultra-wide landscape", "Intricate detail"];
  
  const uniqueId = (Math.random() + 1).toString(36).substring(7);

  // Formula: Category Subject + Context + Detail + Style + Camera
  return `${pick(subjects)} ${pick(timeContext)}, ${pick(subDetails)}, in the style of ${pick(artisticStyles)}, ${pick(cameraAndLens)}, sharp focus, depth of field, masterpiece, unique-id-${uniqueId}`;
}