
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
  baseY: number;
  speed: number;
  data: ReleasedSardine;
  ascii: string;
  direction: 'left' | 'right';
  offset: number; // Phase offset for sine wave
}

const HomeStage: React.FC<HomeStageProps> = ({ onStart, onBrowse }) => {
  const [fishes, setFishes] = useState<FishEntity[]>([]);
  const [selectedFish, setSelectedFish] = useState<FishEntity | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const released = getReleasedSardines();
    
    // Spawn fish at random positions
    // base ASCII is <º))))>< (Head on Left)
    const entities: FishEntity[] = released.map(r => ({
      id: r.id,
      x: Math.random() * 80 + 10, // %
      y: Math.random() * 80 + 10, // %
      baseY: Math.random() * 80 + 10,
      speed: (Math.random() * 0.04) + 0.02,
      data: r,
      ascii: generateFishAscii(r.textLength, false),
      direction: Math.random() > 0.5 ? 'right' : 'left',
      offset: Math.random() * 100
    }));

    setFishes(entities);
  }, []);

  // Animation Loop
  useEffect(() => {
    let time = 0;
    const animate = () => {
      time += 0.1;
      setFishes(prevFishes => prevFishes.map(fish => {
        let newX = fish.x + (fish.direction === 'right' ? fish.speed : -fish.speed);
        let newDir = fish.direction;

        // Turn around at edges with some margin
        if (newX > 92) {
            newDir = 'left';
            newX = 92;
        } else if (newX < 8) {
            newDir = 'right';
            newX = 8;
        }

        // Natural movement: Sine wave bob + tiny random jitter
        const bob = Math.sin(time * 0.5 + fish.offset) * 0.3;
        const jitter = (Math.random() - 0.5) * 0.1;
        
        return { 
            ...fish, 
            x: newX, 
            y: fish.baseY + bob + jitter,
            direction: newDir 
        };
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
                    // ASCII <º))))>< is head-left. 
                    // If moving Left, scaleX(1). If moving Right, flip it to scaleX(-1).
                    transform: `translate(-50%, -50%) scaleX(${fish.direction === 'left' ? 1 : -1})`,
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
        
        {/* Main Menu Overlay */}
       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none">
            <div className="pointer-events-auto bg-white/95 p-6 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-sm w-full mx-6">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter uppercase mb-4">
                    packed like sardines
                </h1>
                <p className="text-xs font-bold text-gray-500 mb-8 uppercase tracking-widest">
                    Station: Main_Hub // Population: {fishes.length}
                </p>

                <div className="space-y-4">
                    <button 
                        onClick={onStart}
                        className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-all text-xs sm:text-sm"
                    >
                        I'm feeling compressed
                    </button>
                    <button 
                        onClick={onBrowse}
                        className="w-full py-4 bg-white border-2 border-black text-black font-bold uppercase tracking-widest hover:bg-gray-100 transition-all text-xs sm:text-sm"
                    >
                        Open a Random Can
                    </button>
                </div>
            </div>
            {fishes.length === 0 && (
                <div className="absolute bottom-10 text-xs font-bold text-gray-400 uppercase text-center px-4">
                    The waters are empty. Start by opening a can.
                </div>
            )}
       </div>
    </div>
  );
};

export default HomeStage;
