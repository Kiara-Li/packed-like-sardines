import React, { useState, useEffect } from 'react';
import { UserCanData, ReleasedSardine } from '../types';
import { generateFishAscii, generateCanLines } from '../constants';
import { saveReleasedSardine } from '../services/storageService';

interface ViewingCanStageProps {
  canData: UserCanData;
  onBack: () => void;
  onGoHome: () => void;
}

const ViewingCanStage: React.FC<ViewingCanStageProps> = ({ canData, onBack, onGoHome }) => {
  const [adviceText, setAdviceText] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [hasResponded, setHasResponded] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Regenerate visual assets based on the stored data
  const fishAscii = generateFishAscii(canData.text.length, false); 
  const canLines = generateCanLines(fishAscii);

  // Handle Slider Change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (val >= 99) {
        setIsUnlocked(true);
        handleRelease();
    }
  };

  const handleRelease = () => {
    // Construct final advice with recommendation tag if present
    let finalAdvice = adviceText.trim();
    if (recommendation) {
        finalAdvice = `[${recommendation}] ${finalAdvice}`;
    }
    
    // Save to history
    const releasedFish: ReleasedSardine = {
        id: crypto.randomUUID(),
        originalCanId: canData.id,
        textLength: canData.text.length,
        adviceGiven: finalAdvice || (sliderValue >= 99 ? "Silent support (Released)" : "No advice"),
        industry: canData.industry,
        timestamp: new Date().toISOString()
    };
    saveReleasedSardine(releasedFish);

    // Trigger visual change
    setTimeout(() => {
        setHasResponded(true);
    }, 500);
  };

  // If unlocked, animation plays then we show success
  if (hasResponded) {
    return (
        <div className="flex flex-col h-full items-center justify-center p-6 animate-fade-in text-center">
             <div className="mb-8 relative h-20 w-full max-w-xs flex items-center justify-center">
                 {/* Animation of fish swimming away */}
                <pre className="absolute text-2xl font-bold animate-float whitespace-pre font-mono">
                    {generateFishAscii(canData.text.length, true)}
                </pre>
             </div>

            <h2 className="text-2xl font-bold uppercase mb-4 font-mono">Can Opened</h2>
            <p className="text-sm font-bold mb-10 max-w-xs text-gray-600 font-mono">
                You have released this sardine back into the ocean (Line 4).
            </p>
            
            <div className="space-y-4 w-full max-w-xs">
                <button 
                    onClick={onGoHome}
                    className="w-full px-8 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] font-mono"
                >
                    Return to Main Station
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto pt-6 px-4 animate-fade-in pb-10">
      
      {/* Top Bar */}
      <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-6 font-mono">
        <span className="text-xs font-bold bg-black text-white px-2 py-1">
            Ind: {canData.industry}
        </span>
        <span className="text-xs font-bold text-gray-500">
            {new Date(canData.timestamp).toLocaleDateString()}
        </span>
        <span className="text-xs font-bold border-2 border-black px-2 py-1">
            Req: {canData.adviceNeeded}
        </span>
      </div>

      {/* The Can Visual (Fades out when unlocked) */}
      <div className={`flex flex-col items-center mb-8 relative transition-opacity duration-1000 ${isUnlocked ? 'opacity-0' : 'opacity-100'}`}>
        <pre className="text-xs sm:text-sm leading-none whitespace-pre text-black font-bold font-mono">
          {canLines.join('\n')}
        </pre>
        {canData.ingredients && (
             <div className="mt-4 text-center font-mono">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Contains traces of:</p>
                <p className="text-xs font-bold italic">{canData.ingredients.join(' + ')}</p>
             </div>
        )}
      </div>

      {/* The Content */}
      <div className={`bg-gray-50 border-l-4 border-black p-4 mb-8 transition-opacity duration-500 ${isUnlocked ? 'opacity-50' : 'opacity-100'}`}>
        <p className="font-mono text-sm md:text-base font-bold leading-relaxed whitespace-pre-wrap">
            "{canData.text}"
        </p>
      </div>

      {/* Interaction Zone */}
      {!isUnlocked && (
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="flex gap-4">
                <button
                    onClick={() => setRecommendation(recommendation === 'Quit!' ? null : 'Quit!')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-2 border-black transition-all ${
                        recommendation === 'Quit!' 
                            ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(100,100,100,0.5)]' 
                            : 'bg-white hover:bg-gray-100'
                    }`}
                >
                    Quit!
                </button>
                <button
                    onClick={() => setRecommendation(recommendation === 'Endure' ? null : 'Endure')}
                    className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest border-2 border-black transition-all ${
                        recommendation === 'Endure' 
                            ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(100,100,100,0.5)]' 
                            : 'bg-white hover:bg-gray-100'
                    }`}
                >
                    Endure
                </button>
            </div>

            {/* Advice Input */}
            <div className="relative">
                <textarea
                    value={adviceText}
                    onChange={(e) => setAdviceText(e.target.value)}
                    placeholder="Add a note... (optional)"
                    className="w-full h-24 border-2 border-black p-3 text-sm font-bold resize-none focus:outline-none focus:bg-gray-50 placeholder-gray-400 font-mono"
                />
            </div>

            {/* Slide to Release UI */}
            <div className="relative w-full h-16 bg-gray-100 border-2 border-black rounded-full overflow-hidden flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div 
                    className="absolute left-0 top-0 bottom-0 bg-black opacity-10 transition-all" 
                    style={{ width: `${sliderValue}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 font-mono">
                        {sliderValue < 50 ? '>>> SLIDE TO OPEN CAN >>>' : '>>> RELEASING... >>>'}
                    </span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderValue} 
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Visual Thumb */}
                <div 
                    className="absolute top-1 bottom-1 w-14 bg-white border-2 border-black rounded-full flex items-center justify-center pointer-events-none transition-all"
                    style={{ left: `calc(${sliderValue}% - ${sliderValue * 0.6}px + 4px)` }}
                >
                    <span className="text-lg">🐟</span>
                </div>
            </div>

            <button 
                onClick={onBack}
                className="w-full text-center text-xs font-bold uppercase text-gray-400 hover:text-black underline pt-4 font-mono"
            >
                Put it back (Cancel)
            </button>
          </div>
      )}
    </div>
  );
};

export default ViewingCanStage;