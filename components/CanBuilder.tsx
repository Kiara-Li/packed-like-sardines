
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

  const fishAscii = generateFishAscii(initialData.text.length, true);
  const canLines = generateCanLines(fishAscii, industry);

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 animate-fade-in font-mono">
      
      {/* Header */}
      <div className="w-full border-b border-black pb-2 mb-8 flex justify-between items-baseline">
          <h2 className="text-lg font-bold uppercase tracking-tight">Canning Station</h2>
          <span className="text-[10px] uppercase">Step 2/3</span>
      </div>

      {/* The Visual Can Preview - Minimalist */}
      <div className="mb-10 relative group flex justify-center min-h-[180px] items-center w-full">
        <pre className="text-xs sm:text-sm leading-none whitespace-pre text-black font-bold font-mono text-center inline-block">
          {canLines.join('\n')}
        </pre>
        
        {/* Floating Label - Flat Border */}
        {(industry || ingredients.length > 1) && (
            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-2 text-[10px] border border-black max-w-[180px] z-10 font-mono rotate-2">
                <div className="uppercase border-b border-black mb-1 pb-1 flex justify-between">
                    <span>WT: HVY</span>
                    <span>{new Date().toLocaleDateString(undefined, {month:'numeric', day:'numeric'})}</span>
                </div>
                {industry && <div className="mb-1 bg-black text-white inline-block px-1">IND: {industry}</div>}
                <div className="text-[9px] leading-tight uppercase text-gray-600">
                    {ingredients.join(', ')}
                </div>
            </div>
        )}
      </div>

      {/* The Form - Receipt Style */}
      <div className="w-full space-y-0 border-t border-black">
        
        {/* Industry Select */}
        <div className="flex flex-col py-4 border-b border-black">
          <label className="text-[10px] font-bold uppercase text-gray-500 mb-2">Select Line / Industry</label>
          <select 
            value={industry} 
            onChange={(e) => setIndustry(e.target.value)}
            className="bg-transparent text-sm font-normal focus:outline-none font-mono w-full appearance-none rounded-none"
            style={{ backgroundImage: 'none' }} // Remove default arrow if possible or keep standard
          >
            <option value="" disabled>Select origin line...</option>
            <option value="Tech">Line 1: Tech / Dev</option>
            <option value="Finance">Line 2: Finance / Corp</option>
            <option value="Creative">Line 3: Creative / Art</option>
            <option value="Service">Line 4: Service / Retail</option>
            <option value="Student">Line 5: Academic</option>
            <option value="Unemployed">Line 0: Between Jobs</option>
            <option value="Other">Line X: Other</option>
          </select>
        </div>

        {/* Output Select */}
        <div className="flex flex-col py-4 border-b border-black">
          <label className="text-[10px] font-bold uppercase text-gray-500 mb-2">Required Output</label>
          <div className="flex flex-wrap gap-2">
            {['Listen', 'Advice', 'Quit!', 'Hug'].map((opt) => (
              <button
                key={opt}
                onClick={() => setAdviceType(opt)}
                className={`px-3 py-2 text-xs border transition-colors font-mono uppercase ${
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

      {/* Actions */}
      <div className="flex w-full gap-4 mt-8">
        <button 
            onClick={onBack}
            className="flex-1 py-4 text-xs font-bold border border-transparent text-gray-400 hover:text-black hover:border-black uppercase tracking-widest"
        >
            Recycle
        </button>
        <button 
            onClick={handleSeal}
            disabled={!industry || isSealing}
            className={`flex-1 py-4 text-xs font-bold border uppercase tracking-widest transition-colors ${
                industry 
                ? 'bg-black text-white border-black hover:bg-gray-800' 
                : 'bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed'
            }`}
        >
            {isSealing ? 'Sealing...' : 'Seal Can'}
        </button>
      </div>
    </div>
  );
};

export default CanBuilder;
