
import React, { useState, useRef } from 'react';
import SardineMascot from './SardineMascot';
import { SardineState } from '../types';
import { SAD_KEYWORDS } from '../constants';

interface InputStageProps {
  onNext: (text: string) => void;
}

const InputStage: React.FC<InputStageProps> = ({ onNext }) => {
  const [text, setText] = useState('');
  const [sardineState, setSardineState] = useState<SardineState>({
    isMouthOpen: false,
    isCrying: false,
    isTalking: false,
  });
  const typingTimeoutRef = useRef<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setText(newVal);
    
    // Handle Talking Animation
    setSardineState(prev => ({ ...prev, isTalking: true }));
    
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = window.setTimeout(() => {
        setSardineState(prev => ({ ...prev, isTalking: false }));
    }, 300);

    // Handle Sadness Detection
    const lowerVal = newVal.toLowerCase();
    const isSad = SAD_KEYWORDS.some(keyword => lowerVal.includes(keyword));
    setSardineState(prev => ({ ...prev, isCrying: isSad }));
  };

  const handleSubmit = () => {
    if (text.trim().length > 0) {
      onNext(text);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-xl mx-auto relative pt-6 px-4">
      
      {/* Header - Ticket Style */}
      <div className="mb-6 border-b border-black pb-4 flex justify-between items-end">
         <div>
             <h1 className="text-2xl font-bold tracking-tight text-ink-black uppercase leading-none">
                Subway Sardine
             </h1>
             <p className="text-[10px] text-gray-500 mt-1 font-mono uppercase tracking-widest">
                Station: Input_W1
             </p>
         </div>
         <div className="text-[10px] font-bold border border-black px-2 py-1 rounded-full">
            TICKET: 1-WAY
         </div>
      </div>

      {/* Input Area */}
      <div className="flex-1 relative flex flex-col">
        <label className="block text-[10px] font-bold mb-2 uppercase tracking-wider text-gray-500">
           Description of Compression
        </label>
        
        {/* Flat Input, No Shadow, Thinner Border */}
        <textarea
            value={text}
            onChange={handleInputChange}
            placeholder="Describe your current state..."
            className="w-full h-64 bg-transparent border-y border-black p-4 text-ink-black resize-none focus:outline-none focus:bg-gray-50 text-base font-normal leading-relaxed placeholder-gray-400 font-mono"
            spellCheck={false}
        />
        
        {/* Meta Data Row */}
        <div className="flex justify-between items-center py-2 border-b border-black">
             <div className="text-[10px] text-gray-400 font-mono normal-case">
                auto-scaling fish protocol engaged
            </div>
            <div className="text-[10px] font-mono text-gray-400">
                {text.length} chars
            </div>
        </div>
      </div>

      {/* Bottom Interaction Area */}
      <div className="py-8 flex flex-col items-center justify-end">
        
        {/* The Mascot */}
        <div className="mb-8 transition-transform duration-300 min-h-[60px] flex items-center justify-center">
            <SardineMascot sardineState={sardineState} textLength={text.length} />
        </div>

        {/* Action Button - Flat Ticket Style */}
        {text.length > 2 && (
            <button
                onClick={handleSubmit}
                className="w-full border border-black bg-white text-black py-4 text-sm font-bold hover:bg-black hover:text-white transition-colors duration-200 uppercase tracking-widest font-mono"
            >
                Start Canning Process &rarr;
            </button>
        )}
      </div>
    </div>
  );
};

export default InputStage;
