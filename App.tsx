import React, { useState } from 'react';
import InputStage from './components/InputStage';
import CanBuilder from './components/CanBuilder';
import { AppStage, UserCanData } from './types';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INPUT);
  const [userData, setUserData] = useState<UserCanData>({
    text: '',
    industry: '',
    adviceNeeded: '',
    mood: '',
    timestamp: '',
  });

  const handleInputComplete = (text: string) => {
    setUserData(prev => ({
      ...prev,
      text,
      timestamp: new Date().toISOString()
    }));
    setStage(AppStage.PACKAGING);
  };

  const handlePackagingComplete = (finalData: UserCanData) => {
    setUserData(finalData);
    setStage(AppStage.COMPLETED);
  };

  const handleRestart = () => {
    setStage(AppStage.INPUT);
    setUserData({
        text: '',
        industry: '',
        adviceNeeded: '',
        mood: '',
        timestamp: ''
    });
  };

  return (
    <div className="min-h-screen bg-paper-white text-ink-black font-mono flex flex-col">
      {/* Decorative Top Bar */}
      <div className="w-full h-2 border-b-2 border-black flex justify-between bg-white">
        {/* Striped pattern */}
        <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}></div>
      </div>

      <main className="flex-1 flex flex-col w-full max-w-3xl mx-auto">
        {stage === AppStage.INPUT && (
          <InputStage onNext={handleInputComplete} />
        )}

        {stage === AppStage.PACKAGING && (
          <CanBuilder 
            initialData={userData} 
            onComplete={handlePackagingComplete} 
            onBack={() => setStage(AppStage.INPUT)}
          />
        )}

        {stage === AppStage.COMPLETED && (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-fade-in my-auto pb-20">
                <div className="text-6xl mb-6">🥫</div>
                <h2 className="text-2xl font-bold mb-4 uppercase tracking-tighter">Production Complete</h2>
                <p className="text-sm text-gray-600 mb-10 max-w-sm font-bold">
                    Your worry has been successfully compressed. 
                    <br/>
                    It is now circulating on Line 4.
                </p>
                <div className="p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white w-full max-w-xs text-left transform -rotate-1">
                    <p className="text-xs uppercase font-bold border-b-2 border-black pb-2 mb-4 flex justify-between">
                        <span>Manifest</span>
                        <span>#{Math.floor(Math.random() * 99999)}</span>
                    </p>
                    <p className="text-sm mb-2 font-bold"><span className="bg-black text-white px-1 mr-2">IND</span> {userData.industry}</p>
                    <p className="text-sm mb-2 font-bold"><span className="bg-black text-white px-1 mr-2">REQ</span> {userData.adviceNeeded}</p>
                    <div className="mt-4 pt-2 border-t border-black text-xs text-gray-500 uppercase">
                        Stored: {new Date(userData.timestamp).toLocaleTimeString()}
                    </div>
                </div>
                
                <div className="mt-12 space-y-4">
                     <button 
                        onClick={handleRestart}
                        className="block w-full px-8 py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        Process Another
                    </button>
                    <button className="block w-full text-xs underline font-bold uppercase tracking-widest text-gray-500 hover:text-black">
                        View Subway Map
                    </button>
                </div>
            </div>
        )}
      </main>

      {/* Decorative Footer */}
      <footer className="py-4 text-center text-xs font-bold border-t-2 border-black bg-white">
        SUBWAY SARDINE PROJECT &copy; {new Date().getFullYear()} // v2.0
      </footer>
    </div>
  );
};

export default App;