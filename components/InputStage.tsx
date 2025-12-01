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
    <div className="flex flex-col h-full w-full max-w-2xl mx-auto relative pt-8 px-4">
      
      {/* Header */}
      <div className="mb-8 text-center border-b-2 border-black pb-4">
         <h1 className="text-3xl font-bold tracking-tighter text-ink-black uppercase">
            Subway Sardine
         </h1>
         <p className="text-sm text-gray-600 font-bold mt-2">
            STATION: INPUT_W1 // TICKET: 1-WAY
         </p>
      </div>

      {/* Input Area */}
      <div className="flex-1 relative">
        <label className="block text-xs font-bold mb-2 uppercase tracking-wider">
           > Describe your current compression level:
        </label>
        <textarea
            value={text}
            onChange={handleInputChange}
            placeholder="I feel compressed because..."
            className="w-full h-48 bg-white border-2 border-black p-4 text-ink-black resize-none focus:outline-none focus:bg-gray-50 text-base leading-relaxed placeholder-gray-400 font-bold"
            spellCheck={false}
        />
        <div className="flex justify-between items-center mt-2">
             <div className="text-xs font-bold text-gray-500">
                AUTO-SCALING FISH PROTOCOL ENGAGED
            </div>
            <div className="text-xs font-bold">
                LEN: {text.length}
            </div>
        </div>
      </div>

      {/* Bottom Interaction Area */}
      <div className="py-8 flex flex-col items-center justify-end">
        
        {/* The Mascot */}
        <div className="mb-8 transition-transform duration-300 min-h-[60px] flex items-center justify-center">
            <SardineMascot sardineState={sardineState} textLength={text.length} />
        </div>

        {/* Action Button */}
        {text.length > 2 && (
            <button
                onClick={handleSubmit}
                className="w-full max-w-sm border-2 border-black bg-white text-black py-4 text-sm font-bold hover:bg-black hover:text-white transition-all duration-200 uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none"
            >
                Start Canning Process
            </button>
        )}
      </div>
    </div>
  );
};

export default InputStage;