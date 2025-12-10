
import React, { useEffect, useState, useRef } from 'react';
import { ReleasedSardine, UserCanData } from '../types';
import { getReleasedSardines, getMapSignals, getAllCans } from '../services/storageService';
import { generateFishAscii, SUBWAY_STATIONS, SUBWAY_LINES_SVG_PATH } from '../constants';

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

// Particle effect for reactions
interface ReactionParticle {
    id: string;
    x: number;
    y: number;
    char: string;
    life: number; // 1.0 to 0.0
    velocity: number;
}

const AMBIENT_MESSAGES = [
    { text: "Just keep swimming...", industry: "Life" },
    { text: "Is it Friday yet?", industry: "Time" },
    { text: "Looking for signal...", industry: "Tech" },
    { text: "Mind the gap.", industry: "Transit" },
    { text: "Processing...", industry: "Brain" },
    { text: "Too many people.", industry: "Social" },
    { text: "Need coffee.", industry: "Fuel" },
    { text: "Daydreaming...", industry: "Mood" }
];

const REACTION_EMOJIS = ['💖', '💕', '💗', '💪', '👏', '✨', '🔥'];

const HomeStage: React.FC<HomeStageProps> = ({ onStart, onBrowse, onHistory }) => {
  const [fishes, setFishes] = useState<FishEntity[]>([]);
  const [selectedFish, setSelectedFish] = useState<FishEntity | null>(null);
  const [reactions, setReactions] = useState<ReactionParticle[]>([]);
  
  // Map State
  const [showMap, setShowMap] = useState(false);
  const [mapSignals, setMapSignals] = useState<UserCanData[]>([]);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [viewingMapSignal, setViewingMapSignal] = useState<UserCanData | null>(null);
  const [userCurrentStationId, setUserCurrentStationId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const released = getReleasedSardines();
    
    // Create Ambient Fish (Preset)
    const ambientFish: FishEntity[] = AMBIENT_MESSAGES.map((msg, idx) => ({
        id: `ambient-${idx}`,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        baseY: Math.random() * 80 + 10,
        speed: (Math.random() * 0.02) + 0.01,
        data: {
            id: `ambient-data-${idx}`,
            originalCanId: 'sys',
            textLength: msg.text.length,
            adviceGiven: msg.text,
            industry: msg.industry,
            timestamp: new Date().toISOString()
        },
        ascii: generateFishAscii(msg.text.length, false),
        direction: Math.random() > 0.5 ? 'right' : 'left',
        offset: Math.random() * 100
    }));

    // Create User Fish
    const userFishEntities: FishEntity[] = released.map(r => {
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

    setFishes([...ambientFish, ...userFishEntities]);

    // Load Map Signals
    setMapSignals(getMapSignals());

    // Determine User Location from their last post
    const allUserCans = getAllCans();
    const sortedCans = [...allUserCans].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const latestLoc = sortedCans.find(c => c.stationId);
    if (latestLoc && latestLoc.stationId) {
        setUserCurrentStationId(latestLoc.stationId);
    }
  }, []);

  // Animation Loop
  useEffect(() => {
    let time = 0;
    const animate = () => {
      time += 0.1;
      
      // Animate Fish
      setFishes(prevFishes => prevFishes.map(fish => {
        // STOP MOVEMENT IF SELECTED
        if (selectedFish && fish.id === selectedFish.id) {
            return fish;
        }

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

      // Animate Reactions (Float up and fade out)
      setReactions(prev => prev.map(p => ({
          ...p,
          y: p.y - p.velocity, // Move up
          life: p.life - 0.015
      })).filter(p => p.life > 0));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [selectedFish]); // Add selectedFish to dep array to ensure closure has latest state

  const handleEncourage = () => {
      if (!selectedFish) return;

      const randomEmoji = REACTION_EMOJIS[Math.floor(Math.random() * REACTION_EMOJIS.length)];
      
      const newReaction: ReactionParticle = {
          id: crypto.randomUUID(),
          x: selectedFish.x, // Start at fish position
          y: selectedFish.y - 2, // Slightly above
          char: randomEmoji,
          life: 1.0,
          velocity: 0.2 + (Math.random() * 0.1)
      };

      setReactions(prev => [...prev, newReaction]);
  };

  // Filter signals for the selected station
  const stationSignals = selectedStationId 
    ? mapSignals.filter(s => s.stationId === selectedStationId)
    : [];

  const selectedStationInfo = SUBWAY_STATIONS.find(s => s.id === selectedStationId);

  return (
    <div className="relative w-full h-full min-h-screen bg-paper-white overflow-hidden animate-fade-in font-mono">
       
       {/* Map Toggle Button (Top Right) */}
       <div className="absolute top-6 right-6 z-30">
          <button 
            onClick={() => setShowMap(true)}
            className="w-12 h-12 border border-black bg-white flex flex-col items-center justify-center hover:bg-black hover:text-white transition-colors group"
          >
             <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Map</span>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-1">
               <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
             </svg>
          </button>
       </div>

       {/* MAP OVERLAY */}
       {showMap && (
         <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
            {/* Map Header */}
            <div className="p-4 border-b border-black flex justify-between items-center bg-white z-10 shadow-sm">
                <div>
                   <h2 className="text-xl font-bold uppercase tracking-tight">Signal Map</h2>
                </div>
                <button 
                    onClick={() => { setShowMap(false); setSelectedStationId(null); setViewingMapSignal(null); }}
                    className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white text-xl"
                >
                    ×
                </button>
            </div>

            {/* Map Content Area */}
            <div className="flex-1 relative bg-white flex flex-col">
                
                {/* SVG MAP CONTAINER */}
                <div className="flex-1 w-full relative flex flex-col items-center justify-center p-4">
                     
                    {/* Map Description/Title directly above map */}
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">
                        Current Location & Nearby Signals
                    </p>

                    {/* Map SVG */}
                    <div className="w-full max-w-lg aspect-square relative border border-black bg-white shadow-xl">
                        <svg viewBox="0 0 100 100" className="w-full h-full pointer-events-auto select-none">
                            {/* The Network Lines */}
                            <path 
                                d={SUBWAY_LINES_SVG_PATH} 
                                fill="none" 
                                stroke="black" 
                                strokeWidth="0.8" 
                                strokeLinecap="square"
                            />
                            
                            {/* Stations */}
                            {SUBWAY_STATIONS.map((station) => {
                                 const isSelected = selectedStationId === station.id;
                                 const isUserStation = userCurrentStationId === station.id;
                                 
                                 // Size constants
                                 const size = 3;
                                 const boxSize = 7;

                                 return (
                                    <g 
                                        key={station.id} 
                                        className="group cursor-pointer"
                                        onClick={() => setSelectedStationId(station.id)}
                                    >
                                        {/* Interaction Zone (Invisible larger area) */}
                                        <rect 
                                            x={station.x - 5} 
                                            y={station.y - 5} 
                                            width="10" 
                                            height="10" 
                                            fill="transparent" 
                                        />

                                        {/* Dashed Box Indicator (For Selected OR User Station) */}
                                        {(isSelected || isUserStation) && (
                                            <rect 
                                                x={station.x - (boxSize/2)} 
                                                y={station.y - (boxSize/2)} 
                                                width={boxSize} 
                                                height={boxSize} 
                                                fill="none" 
                                                stroke="black" 
                                                strokeWidth="0.4" 
                                                strokeDasharray="1 1"
                                                opacity={isSelected ? "1" : "0.5"} 
                                            />
                                        )}

                                        {/* Station Dot - Uniform Black Square */}
                                        <rect 
                                            x={station.x - (size/2)} 
                                            y={station.y - (size/2)} 
                                            width={size} 
                                            height={size} 
                                            fill="black" 
                                        />
                                        
                                        {/* Label */}
                                        <text 
                                            x={station.x + 4} 
                                            y={station.y + 1} 
                                            className={`text-[3px] font-mono uppercase ${isSelected || isUserStation ? 'font-bold fill-black' : 'fill-gray-400'} group-hover:fill-black transition-colors`}
                                        >
                                            {station.name}
                                        </text>
                                    </g>
                                 );
                            })}
                        </svg>
                    </div>
                </div>

                {/* STATION MANIFEST (Bottom Sheet) */}
                <div className={`bg-white border-t border-black transition-all duration-300 flex flex-col ${selectedStationId ? 'h-64' : 'h-0 overflow-hidden'}`}>
                    {selectedStationInfo && (
                        <>
                            <div className="p-3 border-b border-black bg-gray-100 flex justify-between items-center">
                                <h3 className="text-xs font-bold uppercase tracking-widest">
                                    {selectedStationInfo.name} LOG ({stationSignals.length})
                                </h3>
                                <button onClick={() => setSelectedStationId(null)} className="text-[10px] underline">CLOSE</button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {stationSignals.length === 0 ? (
                                    <div className="text-center text-[10px] text-gray-400 mt-4 italic">No active signals detected here.</div>
                                ) : (
                                    stationSignals.map(sig => (
                                        <div 
                                            key={sig.id} 
                                            onClick={() => setViewingMapSignal(sig)}
                                            className="border border-black p-3 hover:bg-black hover:text-white cursor-pointer transition-colors"
                                        >
                                            <div className="flex justify-between text-[9px] uppercase mb-1 opacity-70">
                                                <span>IND: {sig.industry}</span>
                                                <span>{new Date(sig.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                            <p className="text-xs font-normal truncate">"{sig.text}"</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* FULL SIGNAL VIEW MODAL (On top of Map) */}
            {viewingMapSignal && (
                <div className="absolute inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white border border-black w-full max-w-sm shadow-2xl animate-fade-in">
                        <div className="border-b border-black p-3 flex justify-between items-center bg-gray-50">
                             <span className="text-[10px] font-bold uppercase">Intercepted Signal</span>
                             <button onClick={() => setViewingMapSignal(null)} className="text-lg leading-none hover:text-red-500">×</button>
                        </div>
                        <div className="p-6 text-center">
                             <pre className="text-[10px] mb-4 text-black whitespace-pre font-mono leading-none">
                                {generateFishAscii(viewingMapSignal.text.length, false)}
                             </pre>
                             <p className="text-sm font-normal mb-6">"{viewingMapSignal.text}"</p>
                             <div className="flex justify-center gap-2">
                                {viewingMapSignal.ingredients?.slice(0,2).map(ing => (
                                    <span key={ing} className="text-[9px] border border-black px-2 py-1 uppercase">{ing}</span>
                                ))}
                             </div>
                        </div>
                        <div className="p-3 border-t border-black text-center">
                            <button 
                                onClick={() => setViewingMapSignal(null)}
                                className="text-[10px] font-bold uppercase tracking-widest hover:underline"
                            >
                                Acknowledge & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
         </div>
       )}

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
                    fontWeight: 'bold',
                    opacity: selectedFish && selectedFish.id !== fish.id ? 0.3 : 1, // Dim others
                }}
             >
                {fish.ascii}
             </div>
          ))}

          {/* Reaction Particles Layer */}
          {reactions.map(p => (
              <div 
                key={p.id}
                className="absolute pointer-events-none text-xl select-none z-10"
                style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    opacity: p.life,
                    transform: `translate(-50%, -50%) scale(${0.5 + p.life})`
                }}
              >
                  {p.char}
              </div>
          ))}
       </div>

       {/* Floating Modal for Fish Details (Main Hub) */}
       {selectedFish && (
           <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/90 p-4" onClick={() => setSelectedFish(null)}>
               <div className="bg-white border border-black p-6 max-w-sm w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-sm font-bold uppercase mb-2 border-b border-black pb-1">
                        Rescued Sardine
                    </h3>
                    <div className="text-[10px] text-gray-500 mb-4 uppercase">
                        Line: {selectedFish.data.industry} // {new Date(selectedFish.data.timestamp).toLocaleDateString()}
                    </div>
                    {selectedFish.data.stationId && (
                        <div className="text-[10px] bg-black text-white px-1 inline-block mb-4 mt-1">
                            📍 Last Seen: {SUBWAY_STATIONS.find(s => s.id === selectedFish.data.stationId)?.name || 'Unknown'}
                        </div>
                    )}
                    <div className="mb-6 mt-2">
                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Message:</p>
                        <p className="text-sm font-normal">"{selectedFish.data.adviceGiven}"</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={handleEncourage}
                            className="flex-1 py-3 bg-black text-white border border-black text-xs font-bold uppercase hover:bg-gray-800 tracking-widest active:scale-95 transition-transform"
                        >
                            Encourage
                        </button>
                        <button 
                            onClick={() => setSelectedFish(null)}
                            className="flex-1 py-3 border border-black text-xs font-bold uppercase hover:bg-gray-100"
                        >
                            Close
                        </button>
                    </div>
               </div>
           </div>
       )}
        
        {/* Main Menu - Minimalist Flyer Style */}
       <div className="relative z-10 flex flex-col items-center justify-center min-h-screen pointer-events-none">
            {/* Hide menu when a fish is selected to focus on detail */}
            {!selectedFish && (
                <div className="pointer-events-auto bg-white p-8 border border-black text-center max-w-xs w-full mx-6 animate-fade-in">
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
                            className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all text-xs border border-black"
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
            )}
       </div>
    </div>
  );
};

export default HomeStage;
