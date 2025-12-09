
import React, { useEffect, useState, useRef } from 'react';
import { ReleasedSardine } from '../types';
import { getReleasedSardines } from '../services/storageService';
import { generateFishAscii } from '../constants';

interface HomeStageProps {
  onStart: () => void;
  onBrowse: () => void;
  onHistory: () => void;
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

const HomeStage: React.FC<HomeStageProps> = ({ onStart, onBrowse, onHistory }) => {
  const [fishes, setFishes] = useState<FishEntity[]>([]);
  const [selectedFish, setSelectedFish] = useState<FishEntity | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const released = getReleasedSardines();
    
    // Spawn fish at random positions
    // base ASCII is <º))))>< (Head on Left)
    const entities: FishEntity[] = released.map(r => {
      // Prioritize top (10-35%) and bottom (65-90%) to avoid center text box
      const isTop = Math.random() > 0.5;
      const safeY = isTop 
        ? (Math.random() * 25 + 10) 
        : (Math.random() * 25 + 65);

      return {
        id: r.id,
        x: Math.random() * 80 + 10, // %
        y: safeY, // Initial Y
        baseY: safeY, // Anchor Y for animation
        speed: (Math.random() * 0.04) + 0.02,
        data: r,
        ascii: generateFishAscii(r.textLength, false),
        direction: Math.random() > 0.5 ? 'right' : 'left',
        offset: Math.random() * 100
      };
    });

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
       
       {/* Background Grid Lines (Optional Texture) */}
       <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px)' }}></div>

       {/* Aquarium Layer */}
       <div ref={containerRef} className="absolute inset-0 pointer-events-none z-0">
          {fishes.map(fish => (
             <div
                key={fish.id}
                onClick={() => setSelectedFish(fish)}
                className="absolute cursor-pointer pointer-events-auto hover:text-gray-600 transition-colors select-none text-black"
                style={{
                    left: `${fish.x}%`,
                    top: `${fish.y}%`,
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
           <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 p-4" onClick={() => setSelectedFish(null)}>
               <div className="bg-white border border-black p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-sm font-bold uppercase mb-2 border-b border-black pb-1">
                        Rescued Sardine
                    </h3>
                    <div className="text-[10px] text-gray-500 mb-4 uppercase">
                        Line: {selectedFish.data.industry} // {new Date(selectedFish.data.timestamp).toLocaleDateString()}
                    </div>
                    <div className="mb-6">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Response:</p>
                        <p className="text-sm font-normal">"{selectedFish.data.adviceGiven}"</p>
                    </div>
                    <button 
                        onClick={() => setSelectedFish(null)}
                        className="w-full py-3 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white"
                    >
                        Close
                    </button>
               </div>
           </div>
       )}
        
        {/* Main Menu - Minimalist Flyer Style */}
       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none">
            <div className="pointer-events-auto bg-white p-8 border border-black text-center max-w-xs w-full mx-6">
                <h1 className="text-2xl font-bold tracking-tight uppercase mb-2 leading-none">
                    packed like<br/>sardines
                </h1>
                <div className="w-8 h-px bg-black mx-auto mb-4"></div>
                <p className="text-[10px] text-gray-500 mb-8 uppercase tracking-widest font-mono">
                    Main_Hub // Pop: {fishes.length}
                </p>

                <div className="space-y-3">
                    <button 
                        onClick={onStart}
                        className="w-full py-3 bg-black text-white font-bold uppercase tracking-widest hover:bg-gray-800 transition-all text-xs border border-black"
                    >
                        Create Entry
                    </button>
                    <button 
                        onClick={onBrowse}
                        className="w-full py-3 bg-white border border-black text-black font-bold uppercase tracking-widest hover:bg-gray-50 transition-all text-xs"
                    >
                        Browse Archive
                    </button>
                     <button 
                        onClick={onHistory}
                        className="w-full py-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black underline"
                    >
                        View My Logs
                    </button>
                </div>
            </div>
            {fishes.length === 0 && (
                <div className="absolute bottom-10 text-[10px] font-bold text-gray-400 uppercase text-center px-4 bg-white/50 py-1">
                    System Empty. Begin Protocol.
                </div>
            )}
       </div>
    </div>
  );
};

export default HomeStage;
