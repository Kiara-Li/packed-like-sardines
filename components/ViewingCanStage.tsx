import React, { useState } from 'react';
import { UserCanData, ReleasedSardine } from '../types';
import { generateFishAscii, generateCanLines } from '../constants';
import { saveReleasedSardine } from '../services/storageService';

interface ViewingCanStageProps {
  canData: UserCanData;
  onBack: () => void;
  onGoHome: () => void;
}

const STAMPS = [
    { label: 'ME TOO', icon: '( T_T)' },
    { label: 'HUG', icon: '(>^_^)><(^o^<)' },
    { label: 'RESPECT', icon: 'd(-_- )' },
    { label: 'REAL', icon: '[REAL]' },
    { label: 'IT PASSES', icon: '>>>>>' },
];

const ViewingCanStage: React.FC<ViewingCanStageProps> = ({ canData, onBack, onGoHome }) => {
  const [adviceText, setAdviceText] = useState('');
  const [selectedStamps, setSelectedStamps] = useState<string[]>([]);
  const [hasResponded, setHasResponded] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Regenerate visual assets based on the stored data
  const fishAscii = generateFishAscii(canData.text.length, false); 
  // PASS INDUSTRY HERE
  const canLines = generateCanLines(fishAscii, canData.industry);

  // Handle Slider Change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    if (val >= 99) {
        setIsUnlocked(true);
        handleRelease();
    }
  };

  const addStamp = (stampLabel: string) => {
    if (selectedStamps.includes(stampLabel)) {
        setSelectedStamps(prev => prev.filter(s => s !== stampLabel));
    } else {
        if (selectedStamps.length < 3) {
            setSelectedStamps(prev => [...prev, stampLabel]);
        }
    }
  };

  const handleRelease = () => {
    // Construct final advice with stamps
    let finalAdvice = adviceText.trim();
    const stampsStr = selectedStamps.map(s => `[${s}]`).join(' ');
    
    if (stampsStr) {
        finalAdvice = `${stampsStr} ${finalAdvice}`;
    }
    
    // Save to history
    const releasedFish: ReleasedSardine = {
        id: crypto.randomUUID(),
        originalCanId: canData.id,
        textLength: canData.text.length,
        adviceGiven: finalAdvice || (sliderValue >= 99 ? "[VALIDATED]" : "No advice"),
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
                <pre className="absolute text-2xl font-bold animate-float whitespace-pre font-mono text-black">
                    {generateFishAscii(canData.text.length, true)}
                </pre>
             </div>

            <h2 className="text-2xl font-bold uppercase mb-4 font-mono tracking-tighter">
                Ticket Validated
            </h2>
            <div className="w-16 h-1 bg-black mb-6 mx-auto"></div>
            <p className="text-sm font-bold mb-10 max-w-xs text-gray-600 font-mono">
                You have helped this thought move forward. 
                <br/>
                It has re-entered the flow on Line 4.
            </p>
            
            <div className="space-y-4 w-full max-w-xs">
                <button 
                    onClick={onGoHome}
                    className="w-full px-8 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] font-mono"
                >
                    Return to Platform
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto pt-6 px-4 animate-fade-in pb-10">
      
      {/* Top Bar - Ticket Header Style */}
      <div className="border-2 border-b-0 border-black p-4 bg-gray-50 flex justify-between items-center font-mono">
        <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Origin</span>
            <span className="text-sm font-bold">{canData.industry}</span>
        </div>
        <div className="flex flex-col text-right">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Request</span>
            <span className="text-sm font-bold bg-black text-white px-2">{canData.adviceNeeded}</span>
        </div>
      </div>

      {/* The Content - Ticket Body */}
      <div className={`border-2 border-black p-6 mb-8 bg-white relative transition-opacity duration-500 ${isUnlocked ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
        {/* Decorative Ticket Holes */}
        <div className="absolute -left-3 top-1/2 w-6 h-6 bg-paper-white rounded-full border-r-2 border-black"></div>
        <div className="absolute -right-3 top-1/2 w-6 h-6 bg-paper-white rounded-full border-l-2 border-black"></div>

        <div className="flex flex-col items-center mb-6 w-full">
            <pre className="text-[10px] sm:text-xs leading-none whitespace-pre text-black font-bold font-mono opacity-80 text-center inline-block">
                {canLines.join('\n')}
            </pre>
            {canData.ingredients && (
                <div className="mt-2 text-center">
                   <p className="text-[10px] italic text-gray-400">{canData.ingredients.join(' + ')}</p>
                </div>
            )}
        </div>

        <p className="font-mono text-sm md:text-base font-bold leading-relaxed whitespace-pre-wrap text-center px-2">
            "{canData.text}"
        </p>

        <div className="mt-6 border-t border-dashed border-gray-300 pt-4 flex justify-between text-[10px] text-gray-400 font-bold uppercase">
             <span>ID: {canData.id.slice(0,8)}</span>
             <span>{new Date(canData.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Interaction Zone - Validation Station */}
      {!isUnlocked && (
          <div className="space-y-6">
            
            {/* Resonance Stamps */}
            <div>
                <label className="text-[10px] font-bold uppercase tracking-widest mb-2 block text-gray-500">
                    Apply Reaction Stamp (Max 3)
                </label>
                <div className="flex flex-wrap gap-2">
                    {STAMPS.map((stamp) => {
                        const isSelected = selectedStamps.includes(stamp.label);
                        return (
                            <button
                                key={stamp.label}
                                onClick={() => addStamp(stamp.label)}
                                className={`px-3 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider border-2 transition-all font-mono flex items-center gap-2 ${
                                    isSelected
                                        ? 'bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(100,100,100,0.5)] transform -translate-y-1' 
                                        : 'bg-white text-gray-500 border-gray-300 hover:border-black hover:text-black'
                                }`}
                            >
                                <span>{stamp.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Manual Note */}
            <div className="relative group">
                <textarea
                    value={adviceText}
                    onChange={(e) => setAdviceText(e.target.value)}
                    placeholder="Write a note to this passenger..."
                    className="w-full h-20 border-2 border-black p-3 text-sm font-bold resize-none focus:outline-none focus:bg-gray-50 placeholder-gray-400 font-mono transition-shadow focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                />
                <div className="absolute bottom-2 right-2 text-[10px] text-gray-400 font-mono">
                    {adviceText.length}/140
                </div>
            </div>

            {/* Slide to Validate UI */}
            <div className="relative w-full h-16 bg-white border-2 border-black flex items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mt-4">
                <div 
                    className="absolute left-0 top-0 bottom-0 bg-black transition-all duration-75" 
                    style={{ width: `${sliderValue}%` }}
                />
                
                {/* Track lines */}
                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none opacity-20">
                    {Array.from({ length: 20 }).map((_, i) => (
                         <div key={i} className="w-[1px] h-2 bg-black"></div>
                    ))}
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mix-blend-difference">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-white font-mono">
                        {sliderValue < 50 ? '>>> SLIDE TO VALIDATE >>>' : '>>> PROCESSING... >>>'}
                    </span>
                </div>
                
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={sliderValue} 
                    onChange={handleSliderChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                
                {/* Visual Thumb - Ticket Puncher */}
                <div 
                    className="absolute top-0 bottom-0 w-16 bg-white border-r-2 border-black flex items-center justify-center pointer-events-none transition-all z-10"
                    style={{ left: `calc(${sliderValue}% - ${sliderValue * 0.64}px)` }}
                >
                    <span className="text-xl rotate-90">✄</span>
                </div>
            </div>

            <button 
                onClick={onBack}
                className="w-full text-center text-[10px] font-bold uppercase text-gray-400 hover:text-black underline pt-2 font-mono"
            >
                Return to rack (Cancel)
            </button>
          </div>
      )}
    </div>
  );
};

export default ViewingCanStage;