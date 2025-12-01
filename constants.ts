
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

// Helper to generate dynamic fish ASCII
// 10 chars = <º))))>< (4 segments)
// 20 chars = <º)))))>< (5 segments)
export const generateFishAscii = (charCount: number, mouthOpen: boolean): string => {
    // Base 4 segments
    const segments = 4 + Math.floor(charCount / 10);
    
    // Head logic
    // Open: <º
    // Closed: =º 
    const head = mouthOpen ? '<º' : '=º';
    
    const body = ')'.repeat(segments);
    const tail = '><';
    
    return `${head}${body}${tail}`;
};

// Generates an "exquisite" ASCII can that wraps the content
export const generateCanLines = (fishAscii: string): string[] => {
    const fishLength = fishAscii.length;
    const padding = 8; // generous padding
    const minWidth = 32;
    const innerWidth = Math.max(minWidth, fishLength + padding);
    
    const lineTop      = '  .' + '─'.repeat(innerWidth) + '.  ';
    const lineRimTop   = ' /' + ' '.repeat(innerWidth) + '\\ ';
    
    // Detailed Lid
    const pullTabStart = Math.floor((innerWidth - 10) / 2); // Center the "lid" art roughly
    const lidSpace = ' '.repeat(innerWidth);
    const lidLine = '| ' + ' '.repeat(innerWidth) + ' |';

    // A simple "pull tab" graphic on the lid
    // We'll just keep the lid simple but textured
    const lineLid1     = '| ' + ' '.repeat(5) + '_______' + ' '.repeat(innerWidth - 12) + ' |';
    const lineLid2     = '| ' + ' '.repeat(4) + '(  PULL  )' + ' '.repeat(innerWidth - 14) + ' |';
    
    const lineWall     = '| ' + ' '.repeat(innerWidth) + ' |';
    
    // Center the fish
    const leftPad = Math.floor((innerWidth - fishLength) / 2);
    const rightPad = innerWidth - fishLength - leftPad;
    const lineFish     = '| ' + ' '.repeat(leftPad) + fishAscii + ' '.repeat(rightPad) + ' |';
    
    const lineBottom   = '|' + '_'.repeat(innerWidth) + '|';
    const lineCurve    = ' \\' + '_'.repeat(innerWidth) + '/ ';

    return [
        lineTop,
        lineRimTop,
        lineLid1,
        lineLid2,
        lineWall,
        lineFish,
        lineWall,
        lineBottom,
        lineCurve
    ];
};
