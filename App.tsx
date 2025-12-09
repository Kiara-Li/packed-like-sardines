
import React, { useState, useEffect } from 'react';
import InputStage from './components/InputStage';
import CanBuilder from './components/CanBuilder';
import BrowsingStage from './components/BrowsingStage';
import ViewingCanStage from './components/ViewingCanStage';
import HomeStage from './components/HomeStage';
import HistoryStage from './components/HistoryStage';
import { AppStage, UserCanData } from './types';
import { generateFishAscii, generateCanLines } from './constants';
import { saveCan, getRandomCan, getReleasedSardines, simulateCommunityResponse } from './services/storageService';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INPUT);
  const [userData, setUserData] = useState<UserCanData>({
    id: '',
    text: '',
    industry: '',
    adviceNeeded: '',
    mood: '',
    timestamp: '',
  });
  
  // Check if user has history to decide initial screen
  useEffect(() => {
    const history = getReleasedSardines();
    if (history.length > 0) {
        setStage(AppStage.HOME);
    } else {
        setStage(AppStage.INPUT);
    }
  }, []);

  const [viewingCan, setViewingCan] = useState<UserCanData | null>(null);

  const handleInputComplete = (text: string) => {
    setUserData(prev => ({
      ...prev,
      id: crypto.randomUUID(),
      text,
      timestamp: new Date().toISOString()
    }));
    setStage(AppStage.PACKAGING);
  };

  const handlePackagingComplete = (finalData: UserCanData) => {
    setUserData(finalData);
    saveCan(finalData); 
    simulateCommunityResponse(finalData);
    setStage(AppStage.COMPLETED);
  };

  const handleRestart = () => {
    setStage(AppStage.INPUT);
    setUserData({
        id: '',
        text: '',
        industry: '',
        adviceNeeded: '',
        mood: '',
        timestamp: ''
    });
  };

  const goToBrowsing = () => {
    setStage(AppStage.BROWSING);
  };

  const goToHistory = () => {
    setStage(AppStage.HISTORY);
  };

  const handleFindCan = (industry: string, adviceType: string) => {
    const found = getRandomCan(industry || undefined, adviceType || undefined);
    if (found) {
        setViewingCan(found);
        setStage(AppStage.VIEWING);
    } else {
        alert("No cans found with those labels. Try different criteria.");
    }
  };

  const handleCloseViewing = () => {
    setViewingCan(null);
    setStage(AppStage.HOME); 
  };

  const finalFish = generateFishAscii(userData.text.length, true);
  const finalCanLines = generateCanLines(finalFish, userData.industry);

  return (
    <div className="min-h-screen bg-paper-white text-ink-black font-mono flex flex-col">
      <main className="flex-1 flex flex-col w-full h-full mx-auto">
        
        {stage === AppStage.HOME && (
            <HomeStage 
                onStart={() => setStage(AppStage.INPUT)} 
                onBrowse={goToBrowsing} 
                onHistory={goToHistory}
            />
        )}

        {stage === AppStage.INPUT && (
            <div className="w-full max-w-3xl mx-auto h-full">
                <InputStage onNext={handleInputComplete} />
            </div>
        )}

        {stage === AppStage.PACKAGING && (
             <div className="w-full max-w-3xl mx-auto h-full">
                <CanBuilder 
                    initialData={userData} 
                    onComplete={handlePackagingComplete} 
                    onBack={() => setStage(AppStage.INPUT)}
                />
            </div>
        )}

        {stage === AppStage.COMPLETED && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in my-auto pb-20 pt-10 w-full max-w-3xl mx-auto overflow-hidden relative font-mono">
                
                {/* Animation: Can Rumble/Shake */}
                <div className="mb-12 animate-rumble flex justify-center w-full">
                    <pre className="text-xs sm:text-sm leading-none whitespace-pre text-black font-bold font-mono text-center inline-block">
                        {finalCanLines.join('\n')}
                    </pre>
                </div>

                {/* Stack simulation */}
                <div className="absolute bottom-0 opacity-5 pointer-events-none flex flex-col items-center scale-90 translate-y-20 z-[-1] w-full">
                     <pre className="text-[10px] leading-none whitespace-pre text-black font-bold font-mono mb-2 text-center">{finalCanLines.join('\n')}</pre>
                     <pre className="text-[10px] leading-none whitespace-pre text-black font-bold font-mono text-center">{finalCanLines.join('\n')}</pre>
                </div>

                <div className="opacity-0 animate-[fadeIn_0.5s_ease-out_0.5s_forwards] w-full max-w-md mx-auto">
                    <h2 className="text-xl font-bold mb-4 uppercase tracking-tight">
                        Item Stored in Public Grid
                    </h2>
                    
                    {/* Flat Ticket Style for Success Message */}
                    <div className="mx-auto p-4 border border-black bg-white w-full max-w-xs text-left mb-12">
                        <div className="flex justify-between border-b border-black pb-2 mb-4">
                            <span className="text-[10px] uppercase font-bold">Manifest</span>
                            <span className="text-[10px] font-mono">#{userData.id.slice(0,6)}</span>
                        </div>
                        <p className="text-sm mb-1 font-normal text-black"><span className="text-[10px] uppercase text-gray-500 mr-2">IND</span> {userData.industry}</p>
                        <p className="text-sm mb-4 font-normal text-black"><span className="text-[10px] uppercase text-gray-500 mr-2">REQ</span> {userData.adviceNeeded}</p>
                        <div className="pt-2 border-t border-black text-[10px] text-gray-500 uppercase">
                            Status: In Circulation (Line 4)
                        </div>
                    </div>
                    
                    <div className="space-y-4 w-full max-w-xs mx-auto">
                         <button 
                            onClick={handleRestart}
                            className="block w-full px-8 py-3 bg-white border border-black text-black font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors"
                        >
                            Process Another
                        </button>
                        <button 
                            onClick={() => setStage(AppStage.HOME)}
                            className="block w-full px-8 py-3 bg-black text-white border border-black font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                        >
                            Return to Main Station
                        </button>
                    </div>
                </div>
            </div>
        )}

        {stage === AppStage.BROWSING && (
             <div className="w-full max-w-3xl mx-auto h-full">
                <BrowsingStage onFindCan={handleFindCan} onBack={() => setStage(AppStage.HOME)} />
            </div>
        )}
        
        {stage === AppStage.HISTORY && (
            <div className="w-full max-w-3xl mx-auto h-full">
               <HistoryStage onBack={() => setStage(AppStage.HOME)} />
           </div>
        )}

        {stage === AppStage.VIEWING && viewingCan && (
             <div className="w-full max-w-3xl mx-auto h-full">
                <ViewingCanStage 
                    canData={viewingCan} 
                    onBack={() => setStage(AppStage.BROWSING)} 
                    onGoHome={handleCloseViewing}
                />
            </div>
        )}

      </main>
    </div>
  );
};

export default App;
