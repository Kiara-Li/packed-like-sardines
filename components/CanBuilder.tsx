import React, { useState, useEffect } from 'react';
import { UserCanData } from '../types';
import { generateFishAscii, generateCanLines } from '../constants';
import { analyzeCanContent } from '../services/geminiService';

interface CanBuilderProps {
  initialData: UserCanData;
  onComplete: (finalData: UserCanData) => void;
  onBack: () => void;
}

const CanBuilder: React.FC<CanBuilderProps> = ({ initialData, onComplete, onBack }) => {
  const [industry, setIndustry] = useState('');
  const [adviceType, setAdviceType] = useState('Just listen');
  const [ingredients, setIngredients] = useState<string[]>(['Processing...']);
  const [isSealing, setIsSealing] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      const generated = await analyzeCanContent(initialData.text);
      setIngredients(generated);
    };
    fetchIngredients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleSeal = () => {
    setIsSealing(true);
    setTimeout(() => {
      onComplete({
        ...initialData,
        industry,
        adviceNeeded: adviceType,
        ingredients
      });
    }, 1500);
  };

  // Generate the specific fish based on the user's input text length
  const fishAscii = generateFishAscii(initialData.text.length, true);
  
  // Generate the can lines dynamically
  const canLines = generateCanLines(fishAscii);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 animate-fade-in">
      <h2 className="text-xl mb-8 font-bold text-center uppercase tracking-widest border-b-2 border-black pb-2 font-mono">
        [ Canning Station ]
      </h2>

      {/* The Visual Can */}
      <div className="mb-10 relative group flex justify-center">
        <pre className="text-xs sm:text-sm md:text-base leading-none whitespace-pre text-black font-bold font-mono">
          {canLines.join('\n')}
        </pre>
        
        {/* Visual Sticker Overlay - Positioned roughly over the center/bottom */}
        {(industry || ingredients.length > 1) && (
            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-2 sm:p-3 text-xs font-bold rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black max-w-[200px] z-10 font-mono">
                <div className="uppercase border-b-2 border-black mb-2 pb-1 flex justify-between">
                    <span>NET WT: HEAVY</span>
                    <span>{new Date().toLocaleDateString()}</span>
                </div>
                {industry && <div className="mb-2 text-sm bg-black text-white inline-block px-1">IND: {industry}</div>}
                <div className="text-[10px] leading-tight uppercase">
                    INGR: {ingredients.join(', ')}
                </div>
            </div>
        )}
      </div>

      {/* The Form */}
      <div className="w-full space-y-6 border-2 border-black p-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold uppercase font-mono">Select Line / Industry</label>
          <select 
            value={industry} 
            onChange={(e) => setIndustry(e.target.value)}
            className="bg-white border-b-2 border-black py-2 focus:outline-none text-sm font-bold font-mono"
          >
            <option value="" disabled>Choose...</option>
            <option value="Tech">Line 1: Tech / Dev</option>
            <option value="Finance">Line 2: Finance / Corp</option>
            <option value="Creative">Line 3: Creative / Art</option>
            <option value="Service">Line 4: Service / Retail</option>
            <option value="Student">Line 5: Academic</option>
            <option value="Unemployed">Line 0: Between Jobs</option>
            <option value="Other">Line X: Other</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-xs font-bold uppercase font-mono">Required Output</label>
          <div className="flex flex-wrap gap-2">
            {['Listen', 'Advice', 'Quit!', 'Hug'].map((opt) => (
              <button
                key={opt}
                onClick={() => setAdviceType(opt)}
                className={`px-4 py-2 text-xs font-bold border-2 transition-all font-mono ${
                  adviceType === opt 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-gray-400 border-gray-200 hover:border-black hover:text-black'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full gap-4 mt-8">
        <button 
            onClick={onBack}
            className="flex-1 py-4 text-sm font-bold border-2 border-transparent text-gray-500 hover:text-red-600 hover:underline uppercase tracking-widest font-mono"
        >
            Recycle
        </button>
        <button 
            onClick={handleSeal}
            disabled={!industry || isSealing}
            className={`flex-1 py-4 text-sm font-bold border-2 uppercase tracking-widest transition-all font-mono ${
                industry 
                ? 'bg-black text-white border-black hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)]' 
                : 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
            }`}
        >
            {isSealing ? 'Sealing...' : 'Seal Can'}
        </button>
      </div>
    </div>
  );
};

export default CanBuilder;