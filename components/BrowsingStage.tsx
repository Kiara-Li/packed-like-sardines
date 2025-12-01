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
    <div className="flex flex-col h-full w-full max-w-lg mx-auto pt-10 px-6 animate-fade-in">
      <div className="mb-10 text-center border-b-2 border-black pb-4">
         <h1 className="text-2xl font-bold uppercase tracking-widest text-ink-black font-mono">
            Subway Archives
         </h1>
         <p className="text-xs text-gray-600 font-bold mt-2 uppercase font-mono">
            Accessing Public Storage Unit #404
         </p>
      </div>

      <div className="flex-1 space-y-8">
        <div className="p-6 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-sm font-bold uppercase mb-4 border-b-2 border-black pb-2 font-mono">Filter Signal</h3>
            
            <div className="flex flex-col space-y-4">
                <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold uppercase font-mono">Target Industry</label>
                    <select 
                        value={industry} 
                        onChange={(e) => setIndustry(e.target.value)}
                        className="bg-white border-b-2 border-black py-2 focus:outline-none text-sm font-bold font-mono"
                    >
                        <option value="">Any / Static Noise</option>
                        <option value="Tech">Tech / Dev</option>
                        <option value="Finance">Finance / Corp</option>
                        <option value="Creative">Creative / Art</option>
                        <option value="Service">Service / Retail</option>
                        <option value="Student">Academic</option>
                        <option value="Unemployed">Between Jobs</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold uppercase font-mono">Advice Request</label>
                    <select 
                        value={adviceType} 
                        onChange={(e) => setAdviceType(e.target.value)}
                        className="bg-white border-b-2 border-black py-2 focus:outline-none text-sm font-bold font-mono"
                    >
                        <option value="">Any</option>
                        <option value="Listen">Just Listen</option>
                        <option value="Advice">Needs Advice</option>
                        <option value="Quit!">Thinking of Quitting</option>
                        <option value="Hug">Needs a Hug</option>
                    </select>
                </div>
            </div>
        </div>

        <div className="text-center text-xs font-bold text-gray-500 max-w-xs mx-auto font-mono">
            WARNING: Opening other cans may release pressurized emotions.
        </div>
      </div>

      <div className="pb-10 space-y-4">
        <button 
            onClick={handleSearch}
            className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] hover:bg-gray-800 transition-all hover:translate-y-1 hover:shadow-none font-mono"
        >
            Locate Random Can
        </button>
        <button 
            onClick={onBack}
            className="w-full py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black underline font-mono"
        >
            Return to Station
        </button>
      </div>
    </div>
  );
};

export default BrowsingStage;