// Curated from the public project READMEs, not fetched at page-load time.
// Keep prototype limitations explicit; link to GitHub for current development status.
export const projectCategories = ['All projects', 'AI & developer tools', 'Games & tracking', 'Creative tools'] as const;

export const projects = [
  {
    name: 'PED Hunter', repo: 'ped-hunter', category: 'Games & tracking',
    kind: 'Windows desktop app', accent: 'mint',
    tagline: 'Know what your next hunt really costs.',
    description: 'A free, local-first Entropia Universe tracker that turns chat logs into a clearer picture of loot, costs, and returns.',
    details: ['Track loot, combat, crafting, and skill events.', 'Keep session history on your machine in SQLite.', 'Build a loadout and calculate weapon cost per shot.'],
    stack: ['Python', 'SQLite', 'Windows'],
    link: 'https://github.com/suttonwilliamd/ped-hunter/releases/latest', linkLabel: 'Windows releases',
    featured: true,
  },
  {
    name: 'CortexPool', repo: 'CortexPool', category: 'AI & developer tools',
    kind: 'Research prototype', accent: 'violet',
    tagline: 'Memory beyond the conversation window.',
    description: 'An experimental memory system for AI assistants, connecting entities and relationships with a pool of relevant working facts.',
    details: ['Organize episodic, semantic, and structural memories.', 'Explore graph traversal and activation spreading.', 'Vector retrieval is scaffolded, not yet functional.'],
    stack: ['TypeScript', 'Node.js', 'Graph memory'],
    featured: true,
  },
  {
    name: 'TPC Server', repo: 'tpc-server', category: 'AI & developer tools',
    kind: 'Developer tool', accent: 'mint',
    tagline: 'A shared workspace for people and AI agents.',
    description: 'Store and search thoughts and plans through a REST API, an MCP server, and a browser interface, with SQLite persistence.',
    stack: ['JavaScript', 'MCP', 'SQLite'], featured: false,
  },
  {
    name: 'SIRQ', repo: 'SIRQ', category: 'AI & developer tools',
    kind: 'Experimental prototype', accent: 'violet',
    tagline: 'Interpret the signal. Keep policy in control.',
    description: 'Explores semantic alert routing with recording, replay, and shadow-mode demos. Uses a deterministic mock evaluator; does not change production systems.',
    stack: ['Python', 'Event routing', 'Replay'], featured: false,
  },
  {
    name: 'GlyphForge', repo: 'GlyphForge', category: 'Creative tools',
    kind: 'Browser prototype', accent: 'peach',
    tagline: 'A playground for type, direction, and composition.',
    description: 'Compose stylized text on a canvas with horizontal and vertical layouts, adjustable letter spacing, rotation, and typography controls.',
    stack: ['React', 'TypeScript', 'Canvas'],
    link: 'https://glyphforge-eosin.vercel.app', linkLabel: 'Open prototype', featured: false,
  },
  {
    name: 'MeJ', repo: 'mej-music', category: 'Creative tools',
    kind: 'Generative music app', accent: 'peach',
    tagline: 'Dial in a mood. Let the music evolve.',
    description: 'Generates evolving musical patterns with Strudel and real-time Web Audio synthesis. Shape the sound with energy, complexity, atmosphere, and rhythm controls.',
    stack: ['TypeScript', 'Strudel', 'Web Audio'], featured: false,
  },
  {
    name: 'LewtNanny', repo: 'LewtNanny', category: 'Games & tracking',
    kind: 'Game analytics app', accent: 'mint',
    tagline: 'Make sense of your Entropia sessions.',
    description: 'Monitors Entropia Universe chat logs to track loot, costs, and profitability across hunting, crafting, and mining, with session analytics and data export.',
    stack: ['Python', 'Log parsing', 'Analytics'], featured: false,
  },
  {
    name: 'Pebble', repo: 'pebble', category: 'AI & developer tools',
    kind: 'Version-control experiment', accent: 'violet',
    tagline: 'Exploring version control built around binaries.',
    description: 'An in-progress alternative to Git exploring immutable snapshots and content-defined chunking for binary assets. Core VCS work is ongoing; not a drop-in Git replacement.',
    stack: ['Go', 'Version control', 'Binary storage'], featured: false,
  },
];
