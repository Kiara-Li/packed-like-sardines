
import React, { useState, useEffect } from 'react';
import { getAllCans, getResponsesForCan } from '../services/storageService';
import { UserCanData, ReleasedSardine } from '../types';
import { generateFishAscii, generateCanLines } from '../constants';

interface HistoryStageProps {
  onBack: () => void;
}

const HistoryStage: React.FC<HistoryStageProps> = ({ onBack }) => {
  const [myCans, setMyCans] = useState<UserCanData[]>([]);
  const [selectedCan, setSelectedCan] = useState<UserCanData | null>(null);
  const [responses, setResponses] = useState<ReleasedSardine[]>([]);

  useEffect(() => {
    const all = getAllCans();
    const sorted = [...all].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setMyCans(sorted);
  }, []);

  const handleSelectCan = (can: UserCanData) => {
    const res = getResponsesForCan(can.id);
    setSelectedCan(can);
    setResponses(res);
  };

  // --- DETAIL VIEW ---
  if (selectedCan) {
    const fishAscii = generateFishAscii(selectedCan.text.length, true);
    const canLines = generateCanLines(fishAscii, selectedCan.industry);

    return (
        <div className="flex flex-col h-full w-full max-w-xl mx-auto pt-6 px-4 animate-fade-in pb-10 font-mono">
            <button 
                onClick={() => setSelectedCan(null)}
                className="mb-6 text-[10px] font-bold uppercase text-gray-500 hover:text-black flex items-center gap-2"
            >
                &larr; Back to Manifest
            </button>

            {/* Header Info */}
            <div className="border-t border-b border-black py-4 mb-8">
                 <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold uppercase">Item #{selectedCan.id.slice(0,6)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 uppercase ${responses.length > 0 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {responses.length > 0 ? 'Validated' : 'Pending'}
                    </span>
                 </div>
                 <div className="text-[10px] text-gray-500 uppercase">
                    Line: {selectedCan.industry} // {new Date(selectedCan.timestamp).toLocaleDateString()}
                 </div>
            </div>

            {/* Content Display */}
            <div className="flex flex-col items-center mb-8">
                <pre className="text-[10px] sm:text-xs leading-none whitespace-pre text-black font-bold font-mono opacity-80 text-center inline-block">
                   {canLines.join('\n')}
               </pre>
               <p className="mt-6 text-sm font-normal text-center max-w-sm text-gray-800 leading-relaxed">
                   "{selectedCan.text}"
               </p>
            </div>

            {/* Responses List */}
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4 border-b border-gray-200 pb-1 text-gray-500">
                Incoming Signals
            </h3>

            {responses.length === 0 ? (
                <div className="py-8 text-center text-gray-400 text-xs italic">
                    Signal scanning...
                </div>
            ) : (
                <div className="space-y-0 border-t border-black">
                    {responses.map((res) => (
                        <div key={res.id} className="py-4 border-b border-black">
                            <p className="text-sm font-normal mb-2 text-black">
                                {res.adviceGiven}
                            </p>
                            <div className="text-[9px] text-gray-400 uppercase flex justify-between">
                                <span>Anon</span>
                                <span>{new Date(res.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="flex flex-col h-full w-full max-w-xl mx-auto pt-8 px-4 animate-fade-in font-mono">
        <div className="mb-6 pb-4 border-b border-black flex justify-between items-baseline">
            <h1 className="text-xl font-bold uppercase tracking-tight text-ink-black">
                My Manifests
            </h1>
            <span className="text-[10px] font-bold">Total: {myCans.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto pb-10">
            {myCans.length === 0 && (
                <div className="text-center text-xs text-gray-400 mt-20 uppercase">
                    Log Empty.
                </div>
            )}

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 text-[9px] uppercase font-bold text-gray-400 mb-2 px-2">
                <div className="col-span-2">Date</div>
                <div className="col-span-2">Line</div>
                <div className="col-span-6">Content</div>
                <div className="col-span-2 text-right">Status</div>
            </div>

            <div className="space-y-0 border-t border-black">
                {myCans.map((can) => {
                    const resCount = getResponsesForCan(can.id).length;
                    return (
                        <button 
                            key={can.id}
                            onClick={() => handleSelectCan(can)}
                            className="w-full py-3 border-b border-black hover:bg-gray-50 transition-colors grid grid-cols-12 gap-2 text-left items-center px-2 group"
                        >
                            <div className="col-span-2 text-[10px] font-mono text-gray-500">
                                {new Date(can.timestamp).toLocaleDateString(undefined, {month:'numeric', day:'numeric'})}
                            </div>
                            <div className="col-span-2 text-[10px] font-bold uppercase">
                                {can.industry ? can.industry.slice(0,4) : 'N/A'}
                            </div>
                            <div className="col-span-6 text-xs font-normal truncate text-black group-hover:underline decoration-1 underline-offset-2">
                                {can.text}
                            </div>
                            
                            <div className="col-span-2 text-right">
                                 {resCount > 0 ? (
                                     <span className="text-[9px] font-bold bg-black text-white px-1">
                                         UPD
                                     </span>
                                 ) : (
                                     <span className="text-[9px] text-gray-300">
                                         ---
                                     </span>
                                 )}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>

        <button 
            onClick={onBack}
            className="mb-8 w-full py-4 text-xs font-bold uppercase tracking-widest text-black border-t border-black hover:bg-gray-50"
        >
            Back to Hub
        </button>
    </div>
  );
};

export default HistoryStage;
