import React, { useEffect, useState } from 'react';
import { generateFishAscii } from '../constants';
import { SardineState } from '../types';

interface SardineMascotProps {
  sardineState: SardineState;
  textLength: number;
}

const SardineMascot: React.FC<SardineMascotProps> = ({ sardineState, textLength }) => {
  const [frame, setFrame] = useState(0);

  // Animation loop for talking
  useEffect(() => {
    let interval: number;
    if (sardineState.isTalking) {
      interval = window.setInterval(() => {
        setFrame((prev) => (prev === 0 ? 1 : 0));
      }, 150);
    } else {
      setFrame(0);
    }
    return () => clearInterval(interval);
  }, [sardineState.isTalking]);

  const mouthOpen = sardineState.isTalking ? frame === 0 : true;
  const fishAscii = generateFishAscii(textLength, mouthOpen);

  return (
    <div className="relative inline-block mt-4 select-none">
      <pre className="text-base sm:text-xl leading-none whitespace-pre text-ink-black animate-float font-bold">
        {fishAscii}
      </pre>
      
      {/* Tear Drops Logic */}
      {sardineState.isCrying && (
        <>
          <div className="absolute top-2 left-3 animate-fall text-lg">💧</div>
          <div className="absolute top-4 left-4 animate-fall text-lg" style={{ animationDelay: '0.4s' }}>💧</div>
          <div className="absolute top-3 left-2 animate-fall text-lg" style={{ animationDelay: '0.8s' }}>💧</div>
        </>
      )}
    </div>
  );
};

export default SardineMascot;