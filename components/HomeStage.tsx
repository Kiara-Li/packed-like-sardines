
import React, { useEffect, useState, useRef } from 'react';
import { ReleasedSardine } from '../types';
import { getReleasedSardines } from '../services/storageService';
import { generateFishAscii } from '../constants';

interface HomeStageProps {
  onStart: () => void;
  onBrowse: () => void;
}

interface FishEntity {
  id: string;
  x: number;
  y: number;
  speed: number;
  data: ReleasedSardine;
  ascii: string;
  direction: 'left' | 'right';
}

const HomeStage: React.FC<HomeStageProps> = ({ onStart, onBrowse }) => {
  const [fishes, setFishes] = useState<FishEntity[]>([]);
  const [selectedFish, setSelectedFish] = useState<FishEntity | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const released = getReleasedSardines();
    
    // Spawn fish at random positions
    const entities: FishEntity[] = released.map(r => ({
      id: r.id,
      x: Math.random() * 80 + 5, // %
      y: Math.random() * 70 + 10, // %
      speed: (Math.random() * 0.05) + 0.02,
      data: r,
      ascii: generateFishAscii(r.textLength, false), // Mouth closed usually
      direction: Math.random() > 0.5 ? 'right' : 'left'
    }));

    setFishes(entities);
  }, []);

  // Animation Loop
  useEffect(() => {
    const animate = () => {
      setFishes(prevFishes => prevFishes.map(fish => {
        let newX = fish.x + (fish.direction === 'right' ? fish.speed : -fish.speed);
        let newDir = fish.direction;

        // Turn around at edges
        if (newX > 95) {
            newDir = 'left';
            newX = 95;
        } else if (newX < 0) {
            newDir = 'right';
            newX = 0;
        }

        return { ...fish, x: newX, direction: newDir };
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen bg-paper-white overflow-hidden animate-fade-in font-mono">
       
       {/* Aquarium Layer */}
       <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
          {fishes.map(fish => (
             <div
                key={fish.id}
                onClick={() => setSelectedFish(fish)}
                className="absolute cursor-pointer pointer-events-auto hover:text-blue-600 transition-colors select-none"
                style={{
                    left: `${fish.x}%`,
                    top: `${fish.y}%`,
                    transform: `scaleX(${fish.direction === 'left' ? -1 : 1})`,
                    fontSize: '1.2rem',
                    fontWeight: 'bold'
                }}
             >
                {fish.ascii}
             </div>
          ))}
       </div>

       {/* Floating Modal for Fish Details */}
       {selectedFish && (
           <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 p-4" onClick={() => setSelectedFish(null)}>
               <div className="bg-white border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-bold uppercase mb-2 border-b-2 border-black pb-1">
                        Rescued Sardine
                    </h3>
                    <div className="text-xs font-bold text-gray-500 mb-4 uppercase">
                        Origin: {selectedFish.data.industry} | released: {new Date(selectedFish.data.timestamp).toLocaleDateString()}
                    </div>
                    <div className="mb-4">
                        <p className="text-xs uppercase font-bold text-gray-400">You said:</p>
                        <p className="text-sm font-bold">"{selectedFish.data.adviceGiven}"</p>
                    </div>
                    <button 
                        onClick={() => setSelectedFish(null)}
                        className="w-full py-2 border-2 border-black text-xs font-bold uppercase hover:bg-black hover:text-white"
                    >
                        Close
                    </button>
               </div>
           </div>
       )}
        
        {/* Main Menu Overlay (Centered but transparent enough to see fish) */}
       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none">
            <div className="pointer-events-auto bg-white/90 p-8 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md w-full mx-4">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter uppercase mb-2">
                    Subway Sardine
                </h1>
                <p className="text-xs font-bold text-gray-500 mb-8 uppercase tracking-widest">
                    Station: Main_Hub // Population: {fishes.length}
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={onStart}
                        className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
                    >
                        I'm feeling compressed
                    </button>
                    <button 
                        onClick={onBrowse}
                        className="w-full py-4 bg-white border-2 border-black text-black font-bold uppercase tracking-widest hover:bg-gray-100 transition-all"
                    >
                        Open a Random Can
                    </button>
                </div>
            </div>
            {fishes.length === 0 && (
                <div className="absolute bottom-10 text-xs font-bold text-gray-400 uppercase">
                    The waters are empty. Start by opening a can.
                </div>
            )}
       </div>
    </div>
  );
};

export default HomeStage;
