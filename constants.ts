// Keywords that trigger the "crying" state
export const SAD_KEYWORDS = [
  '累', 'tired', 'exhausted', 
  '迷茫', 'lost', 'confused', 
  '痛苦', 'pain', 'hurt', 
  '不想干了', 'quit', 
  '压力', 'stress', 
  '加班', 'overtime',
  '烦', 'annoyed',
  '想哭', 'cry',
  '撑不住', 'broken',
  'hate', 'fail', 'stupid',
  'anxious', 'panic', 'dead',
  '死', '难受', '焦虑', '崩溃'
];

// Helper to generate dynamic fish ASCII
export const generateFishAscii = (charCount: number, mouthOpen: boolean): string => {
    // 10 chars = 4 segments (<º))))><)
    // 20 chars = 5 segments (<º)))))><)
    // Base 3 segments for 0 chars (<º)))><)
    const segments = 3 + Math.floor(charCount / 10);
    
    // Head logic for animation
    // Open: <º
    // Closed: =º (simulates chewing/talking movement)
    const head = mouthOpen ? '<º' : '=º';
    
    const body = ')'.repeat(segments);
    const tail = '><';
    
    return `${head}${body}${tail}`;
};

export const generateCanAscii = (fishAscii: string): string => {
    // Calculate width based on fish length plus padding
    const fishLength = fishAscii.length;
    const padding = 4; // 2 spaces on each side
    const innerWidth = fishLength + padding;
    
    const topBar = ' ' + '_'.repeat(innerWidth + 2);
    const lidLine = '/' + ' '.repeat(innerWidth + 2) + '\\';
    const wallLine = '| ' + ' '.repeat(innerWidth) + ' |';
    const fishLine = '|   ' + fishAscii + '   |'; // Center fish
    const bottomLine = '|' + '_'.repeat(innerWidth + 2) + '|';
    const bottomCurve = '\\' + '_'.repeat(innerWidth + 2) + '/';

    // To simplify rendering in the component, we return parts or use a pre-calculated block
    // But for the CanBuilder, we might want to render lines individually to insert the label.
    // For now, let's just return the raw string for the "Visual" part if needed, 
    // but CanBuilder will likely construct this manually to allow overlaying HTML elements.
    return ''; 
};