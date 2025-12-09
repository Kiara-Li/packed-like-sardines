
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

  const fishAscii = generateFishAscii(canData.text.length, false); 
  const canLines = generateCanLines(fishAscii, canData.industry);

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
    let finalAdvice = adviceText.trim();
    const stampsStr = selectedStamps.map(s => `[${s}]`).join(' ');
    
    if (stampsStr) {
        finalAdvice = `${stampsStr} ${finalAdvice}`;
    }
    
    const releasedFish: ReleasedSardine = {
        id: crypto.randomUUID(),
        originalCanId: canData.id,
        textLength: canData.text.length,
        adviceGiven: finalAdvice || (sliderValue >= 99 ? "[VALIDATED]" : "No advice"),
        industry: canData.industry,
        timestamp: new Date().toISOString()
    };
    saveReleasedSardine(releasedFish);

    setTimeout(() => {
        setHasResponded(true);
    }, 500);
  };

  // --- SUCCESS VIEW ---
  if (hasResponded) {
    return (
        <div className="flex flex-col h-full items-center justify-center p-6 animate-fade-in text-center font-mono">
             <div className="mb-10 relative h-20 w-full flex items-center justify-center">
                <pre className="absolute text-2xl font-bold animate-float whitespace-pre text-black">
                    {generateFishAscii(canData.text.length, true)}
                </pre>
             </div>

            <div className="border-t border-b border-black py-4 w-full max-w-xs mb-8">
                <h2 className="text-xl font-bold uppercase tracking-tight">Ticket Validated</h2>
                <p className="text-xs text-gray-500 mt-1 uppercase">Passage Granted</p>
            </div>
            
            <p className="text-sm font-normal mb-10 max-w-xs text-gray-600">
                You have helped this thought move forward. It has re-entered the flow.
            </p>
            
            <button 
                onClick={onGoHome}
                className="w-full max-w-xs px-8 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800"
            >
                Return to Platform
            </button>
        </div>
    );
  }

  // --- TICKET VIEW ---
  return (
    <div className="flex flex-col h-full w-full max-w-xl mx-auto pt-6 px-4 animate-fade-in pb-10">
      
      {/* TICKET CONTAINER */}
      <div className={`border border-black bg-white relative transition-opacity duration-500 ${isUnlocked ? 'opacity-50 blur-[1px]' : 'opacity-100'}`}>
        
        {/* 1. Header Section */}
        <div className="border-b border-black p-4 flex justify-between items-start">
            <div>
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Origin Line</span>
                <span className="text-base font-bold uppercase">{canData.industry}</span>
            </div>
            <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">Request</span>
                <span className="text-base font-bold bg-black text-white px-2 py-0.5 inline-block">{canData.adviceNeeded}</span>
            </div>
        </div>

        {/* 2. Visual Section */}
        <div className="p-8 flex flex-col items-center border-b border-dashed border-black">
            <pre className="text-[10px] sm:text-xs leading-none whitespace-pre text-black font-bold font-mono opacity-80 text-center inline-block">
                {canLines.join('\n')}
            </pre>
            {canData.ingredients && (
                <div className="mt-4 text-center">
                   <p className="text-[9px] uppercase tracking-wide text-gray-400">{canData.ingredients.join(' + ')}</p>
                </div>
            )}
        </div>

        {/* 3. Message Body */}
        <div className="p-4 min-h-[120px] flex items-center justify-center">
            <p className="font-mono text-sm font-normal leading-relaxed whitespace-pre-wrap text-center">
                "{canData.text}"
            </p>
        </div>

        {/* 4. Footer Meta */}
        <div className="border-t border-black p-2 flex justify-between text-[9px] font-mono text-gray-400 uppercase tracking-wider bg-gray-50">
             <span>ID: {canData.id.slice(0,8)}</span>
             <span>{new Date(canData.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      {/* INTERACTION AREA */}
      {!isUnlocked && (
          <div className="mt-8 space-y-6">
            
            {/* Stamps */}
            <div>
                <label className="text-[10px] font-bold uppercase tracking-wider mb-3 block text-gray-500 border-b border-gray-200 pb-1 w-max">
                    Reaction Stamp
                </label>
                <div className="flex flex-wrap gap-2">
                    {STAMPS.map((stamp) => {
                        const isSelected = selectedStamps.includes(stamp.label);
                        return (
                            <button
                                key={stamp.label}
                                onClick={() => addStamp(stamp.label)}
                                className={`px-3 py-2 text-[10px] uppercase border transition-all font-mono ${
                                    isSelected
                                        ? 'bg-black text-white border-black' 
                                        : 'bg-white text-gray-500 border-gray-300 hover:border-black hover:text-black'
                                }`}
                            >
                                {stamp.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Note */}
            <div>
                <textarea
                    value={adviceText}
                    onChange={(e) => setAdviceText(e.target.value)}
                    placeholder="Add a note (optional)..."
                    className="w-full h-16 border-b border-black bg-transparent p-2 text-sm font-normal resize-none focus:outline-none placeholder-gray-400 font-mono rounded-none"
                />
            </div>

            {/* Slider Button */}
            <div className="relative w-full h-14 bg-white border border-black flex items-center mt-4">
                <div 
                    className="absolute left-0 top-0 bottom-0 bg-black transition-all duration-75" 
                    style={{ width: `${sliderValue}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mix-blend-difference">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                        {sliderValue < 50 ? 'SLIDE TO VALIDATE' : 'VALIDATING...'}
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
            </div>

            <button 
                onClick={onBack}
                className="w-full text-center text-[10px] font-bold uppercase text-gray-400 hover:text-black underline"
            >
                Cancel
            </button>
          </div>
      )}
    </div>
  );
};

export default ViewingCanStage;
