
import { UserCanData, ReleasedSardine } from '../types';

const STORAGE_KEY = 'subway_sardine_cans_v1';
const HISTORY_KEY = 'subway_sardine_released_v1';

const MOCK_DATA: UserCanData[] = [
  {
    id: 'mock-1',
    text: 'My boss keeps scheduling meetings at 5:55 PM on Fridays. I have no life.',
    industry: 'Tech',
    adviceNeeded: 'Quit!',
    mood: 'tired',
    timestamp: new Date().toISOString(),
    ingredients: ['100% Zoom Fatigue', 'Lost Weekend']
  },
  {
    id: 'mock-2',
    text: 'I honestly don\'t know what I do all day anymore. Spreadsheets look like matrix code.',
    industry: 'Finance',
    adviceNeeded: 'Advice',
    mood: 'confused',
    timestamp: new Date().toISOString(),
    ingredients: ['Excel Dust', 'Corporate Tears']
  },
  {
    id: 'mock-3',
    text: 'Clients want the logo bigger but also smaller. Make it pop.',
    industry: 'Creative',
    adviceNeeded: 'Hug',
    mood: 'sad',
    timestamp: new Date().toISOString(),
    ingredients: ['Pixelated Hope', 'Hex Code #000000']
  }
];

// --- CANS DATABASE (My Created Cans) ---

export const saveCan = (can: UserCanData): void => {
  const existing = getAllCans();
  const updated = [can, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getAllCans = (): UserCanData[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Seed with mock data if empty
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_DATA));
    return MOCK_DATA;
  }
  return JSON.parse(stored);
};

export const getRandomCan = (filterIndustry?: string, filterAdvice?: string): UserCanData | null => {
  let all = getAllCans();
  
  if (filterIndustry) {
    all = all.filter(c => c.industry === filterIndustry);
  }
  
  if (filterAdvice) {
    all = all.filter(c => c.adviceNeeded === filterAdvice);
  }

  if (all.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * all.length);
  return all[randomIndex];
};

// --- USER HISTORY / RESPONSES (Released Sardines) ---

export const saveReleasedSardine = (sardine: ReleasedSardine): void => {
    const existing = getReleasedSardines();
    const updated = [sardine, ...existing];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const getReleasedSardines = (): ReleasedSardine[] => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
};

// Get responses specifically for a can ID (To show "My Received Advice")
export const getResponsesForCan = (canId: string): ReleasedSardine[] => {
    const allReleased = getReleasedSardines();
    return allReleased.filter(r => r.originalCanId === canId);
};

// --- SIMULATION (For Demo Purposes Only) ---
// Since there is no backend, we simulate a "stranger" replying to your can
export const simulateCommunityResponse = (can: UserCanData) => {
    const responses = [
        "[ME TOO] Hang in there, I feel exactly the same.",
        "[HUG] Sending digital warmth your way.",
        "[RESPECT] You are stronger than you think.",
        "[REAL] The commute is the only quiet time I get.",
        "[IT PASSES] This too shall pass. Keep swimming.",
        "[ME TOO] [REAL] Literally me yesterday."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const fakeResponse: ReleasedSardine = {
        id: crypto.randomUUID(),
        originalCanId: can.id,
        textLength: can.text.length,
        adviceGiven: randomResponse,
        industry: can.industry,
        timestamp: new Date().toISOString()
    };

    // Simulate delay
    setTimeout(() => {
        saveReleasedSardine(fakeResponse);
    }, 5000); // 5 seconds after creation, a "ghost" replies
};
