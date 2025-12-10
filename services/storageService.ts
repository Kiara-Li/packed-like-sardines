
import { UserCanData, ReleasedSardine } from '../types';
import { SUBWAY_STATIONS } from '../constants';

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
    ingredients: ['100% Zoom Fatigue', 'Lost Weekend'],
    stationId: 'S1'
  },
  {
    id: 'mock-2',
    text: 'I honestly don\'t know what I do all day anymore. Spreadsheets look like matrix code.',
    industry: 'Finance',
    adviceNeeded: 'Advice',
    mood: 'confused',
    timestamp: new Date().toISOString(),
    ingredients: ['Excel Dust', 'Corporate Tears'],
    stationId: 'S9'
  },
  {
    id: 'mock-3',
    text: 'Clients want the logo bigger but also smaller. Make it pop.',
    industry: 'Creative',
    adviceNeeded: 'Hug',
    mood: 'sad',
    timestamp: new Date().toISOString(),
    ingredients: ['Pixelated Hope', 'Hex Code #000000'],
    stationId: 'S3'
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

// --- MAP SIGNALS (Ghost Data + Real Data) ---

// This function returns a mix of real user cans and "ambient" signals for the map
export const getMapSignals = (): UserCanData[] => {
    const realCans = getAllCans().filter(c => c.stationId); // Only cans with location
    
    // Ambient signals to make the map feel alive
    const ambientSignals: UserCanData[] = [
        { id: 'g-1', text: 'Headphones on, world off. Please don\'t look at me.', industry: 'Student', adviceNeeded: 'Listen', mood: 'quiet', timestamp: new Date().toISOString(), stationId: 'S4', ingredients: ['Static Noise'] },
        { id: 'g-2', text: 'Missed the express train. Again. Is this a metaphor?', industry: 'Service', adviceNeeded: 'Hug', mood: 'sad', timestamp: new Date().toISOString(), stationId: 'S5', ingredients: ['Late Fee'] },
        { id: 'g-3', text: 'Just saw my ex on the platform. I need to dissolve.', industry: 'Creative', adviceNeeded: 'Quit!', mood: 'panic', timestamp: new Date().toISOString(), stationId: 'S11', ingredients: ['Panic Sweat'] },
        { id: 'g-4', text: 'Someone is eating a tuna sandwich in this car. Why.', industry: 'Other', adviceNeeded: 'Listen', mood: 'angry', timestamp: new Date().toISOString(), stationId: 'S7', ingredients: ['Smell of Regret'] },
        { id: 'g-5', text: 'Does anyone else feel like a ghost in a machine?', industry: 'Tech', adviceNeeded: 'Advice', mood: 'existential', timestamp: new Date().toISOString(), stationId: 'S1', ingredients: ['Binary Tears'] },
        { id: 'g-6', text: 'My coffee spilled. My day is over.', industry: 'Finance', adviceNeeded: 'Hug', mood: 'sad', timestamp: new Date().toISOString(), stationId: 'S9', ingredients: ['Stain Remover'] },
    ];

    return [...realCans, ...ambientSignals];
};

// --- SIMULATION (For Demo Purposes Only) ---
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
        stationId: can.stationId, // Keep locality
        timestamp: new Date().toISOString()
    };

    // Simulate delay
    setTimeout(() => {
        saveReleasedSardine(fakeResponse);
    }, 5000); 
};
