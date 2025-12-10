
import { StationNode } from './types';

// Keywords that trigger the "crying" state
export const SAD_KEYWORDS = [
  // Chinese
  '累', '迷茫', '痛苦', '不想干了', '压力', '加班', '烦', '想哭', '撑不住', 
  '死', '难受', '焦虑', '崩溃', '孤独', '无助', '很难', '甚至', '讨厌',
  
  // Exhaustion / Tiredness
  'tired', 'exhausted', 'drained', 'fatigued', 'worn out', 'burned out', 
  'sleepy', 'overworked', 'exhausting', 'dead tired', 'fatigue', 'cry',
  
  // Mental Pressure
  'stress', 'stressed', 'overwhelmed', 'collapse', 'tense', 'can’t handle', 
  'breaking', 'pressure', 'burnout', 'strained',
  
  // Confusion / Lost
  'lost', 'confused', 'stuck', 'unsure', 'meaningless', 'directionless', 
  'don’t know', 'no idea', 'trapped', 'blocked',
  
  // Work Pain
  'overworked', 'underpaid', 'exploited', 'unfair', 'exhausting', 'overtime', 
  'tough day', 'bad day', 'can’t continue', 'hate', 'fail', 'stupid',
  
  // Sadness / Low Mood
  'sad', 'upset', 'hurt', 'empty', 'crying', 'heartbroken', 'down', 
  'depressed', 'miserable', 'anxious', 'panic', 'dead',
  
  // Helplessness / Loneliness
  'alone', 'lonely', 'helpless', 'no one', 'no support', 'can’t anymore', 
  'giving up', 'hopeless', 'powerless', 'isolated'
];

// --- MAP DATA (Abstract Grid) ---
export const SUBWAY_STATIONS: StationNode[] = [
    // Line 1 (Left - Tech/Creative)
    { id: 'S1', name: 'Canal St', x: 20, y: 80, line: 'Line A' },
    { id: 'S2', name: 'Houston', x: 20, y: 65, line: 'Line A' },
    { id: 'S3', name: '14th St', x: 20, y: 50, line: 'Line A' },
    { id: 'S4', name: 'Times Sq', x: 35, y: 35, line: 'Line A' }, // Transfer
    
    // Line 2 (Center - General)
    { id: 'S5', name: 'Fulton', x: 50, y: 85, line: 'Line B' },
    { id: 'S6', name: 'Brooklyn Br', x: 50, y: 75, line: 'Line B' },
    { id: 'S7', name: 'Union Sq', x: 50, y: 55, line: 'Line B' },
    { id: 'S8', name: 'Grand Central', x: 65, y: 35, line: 'Line B' }, // Transfer

    // Line 3 (Right - Finance)
    { id: 'S9', name: 'Wall St', x: 80, y: 90, line: 'Line C' },
    { id: 'S10', name: 'Broad St', x: 80, y: 80, line: 'Line C' },
    { id: 'S11', name: 'Bleecker', x: 80, y: 60, line: 'Line C' },
    { id: 'S12', name: '59th St', x: 80, y: 20, line: 'Line C' },
];

export const SUBWAY_LINES_SVG_PATH = `
    M 20 90 L 20 50 L 35 35 L 35 10
    M 50 90 L 50 10
    M 80 95 L 80 10
    M 20 50 L 50 55 L 80 60
`;

// Helper to generate dynamic fish ASCII
export const generateFishAscii = (charCount: number, mouthOpen: boolean): string => {
    // Base 4 segments
    const segments = 4 + Math.floor(charCount / 10);
    const head = mouthOpen ? '<º' : '=º';
    const body = ')'.repeat(segments);
    const tail = '><';
    return `${head}${body}${tail}`;
};

// Helper for centering text within a fixed width
const centerText = (text: string, width: number, filler: string = ' '): string => {
    const totalPadding = Math.max(0, width - text.length);
    const padLeft = Math.floor(totalPadding / 2);
    const padRight = totalPadding - padLeft;
    return filler.repeat(padLeft) + text + filler.repeat(padRight);
};

// Generates an "exquisite" ASCII can that wraps the content
export const generateCanLines = (fishAscii: string, industry: string = ''): string[] => {
    const fishLength = fishAscii.length;
    const minInnerWidth = 30;
    // Ensure width is even for better centering
    let innerWidth = Math.max(minInnerWidth, fishLength + 6);
    if (innerWidth % 2 !== 0) innerWidth++;

    // Industry specific textures
    let lidTexture = '_______';
    let wallChar = '|';
    
    // Define subtle textures to keep alignment safe
    switch (industry) {
        case 'Tech':      lidTexture = '0101010'; break;
        case 'Finance':   lidTexture = '$$$$$$$'; break;
        case 'Creative':  lidTexture = '~~~~~~~'; break;
        case 'Service':   lidTexture = '.......'; break;
        case 'Student':   lidTexture = 'AAAAAAA'; break;
        case 'Unemployed':lidTexture = '_______'; break;
        default:          lidTexture = '_______'; break;
    }

    // --- CONSTRUCTION ---
    // Top Cap:  ________ 
    // Rim Top: /        \
    // Walls:  |          |
    // Bottom: |__________|
    // Rim Bot: \________/

    const roof      = ' ' + '_'.repeat(innerWidth) + ' ';
    const rimTop    = '/' + ' '.repeat(innerWidth) + '\\';
    
    // Lid Section
    // Center the texture
    const lidContent = centerText(lidTexture, innerWidth, ' ');
    const lineLid1   = wallChar + lidContent + wallChar;
    
    // Pull Tab Section
    const pullTab    = '( PULL )';
    const lineLid2   = wallChar + centerText(pullTab, innerWidth, ' ') + wallChar;
    
    // Spacer
    const lineSpace  = wallChar + ' '.repeat(innerWidth) + wallChar;

    // Fish Section
    const lineFish   = wallChar + centerText(fishAscii, innerWidth, ' ') + wallChar;
    
    // Bottom Section
    // The bottom wall needs to be solid to look like the base
    const lineBottom = wallChar + '_'.repeat(innerWidth) + wallChar;
    const rimBottom  = '\\' + '_'.repeat(innerWidth) + '/';

    return [
        roof,
        rimTop,
        lineLid1,
        lineLid2,
        lineSpace,
        lineFish,
        lineSpace,
        lineBottom,
        rimBottom
    ];
};
