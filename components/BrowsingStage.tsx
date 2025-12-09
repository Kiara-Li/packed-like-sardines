
import React, { useState } from 'react';

interface BrowsingStageProps {
  onFindCan: (industry: string, adviceType: string) => void;
  onBack: () => void;
}

const BrowsingStage: React.FC<BrowsingStageProps> = ({ onFindCan, onBack }) => {
  const [industry, setIndustry] = useState('');
  const [adviceType, setAdviceType] = useState('');

  const handleSearch = () => {
    onFindCan(industry, adviceType);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto pt-10 px-6 animate-fade-in font-mono">
      <div className="mb-12 border-b border-black pb-4">
         <h1 className="text-xl font-bold uppercase tracking-tight text-ink-black">
            Subway Archives
         </h1>
         <p className="text-[10px] text-gray-500 mt-1 uppercase">
            Public Storage Unit #404
         </p>
      </div>

      <div className="flex-1 space-y-8">
        
        {/* Filter Section - Flat List Style */}
        <div>
            <div className="flex justify-between items-center py-4 border-t border-black border-b">
                <label className="text-xs font-bold uppercase">Target Line</label>
                <select 
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)}
                    className="bg-transparent text-sm text-right focus:outline-none font-normal"
                >
                    <option value="">Any Line</option>
                    <option value="Tech">Tech</option>
                    <option value="Finance">Finance</option>
                    <option value="Creative">Creative</option>
                    <option value="Service">Service</option>
                    <option value="Student">Student</option>
                    <option value="Unemployed">Unemployed</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="flex justify-between items-center py-4 border-b border-black">
                <label className="text-xs font-bold uppercase">Signal Type</label>
                <select 
                    value={adviceType} 
                    onChange={(e) => setAdviceType(e.target.value)}
                    className="bg-transparent text-sm text-right focus:outline-none font-normal"
                >
                    <option value="">Any</option>
                    <option value="Listen">Just Listen</option>
                    <option value="Advice">Needs Advice</option>
                    <option value="Quit!">Quitting</option>
                    <option value="Hug">Needs Hug</option>
                </select>
            </div>
        </div>

        <div className="text-center text-[10px] text-gray-400 max-w-xs mx-auto normal-case leading-tight">
            Note: Opening other cans may release pressurized emotions. Proceed with empathy.
        </div>
      </div>

      <div className="pb-10 space-y-4">
        <button 
            onClick={handleSearch}
            className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
        >
            Locate Random Can
        </button>
        <button 
            onClick={onBack}
            className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black underline"
        >
            Back to Station
        </button>
      </div>
    </div>
  );
};

export default BrowsingStage;
