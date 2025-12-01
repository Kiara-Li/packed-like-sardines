
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
      <pre className="text-xl sm:text-2xl leading-none whitespace-pre text-ink-black animate-float font-bold font-mono">
        {fishAscii}
      </pre>
      
      {/* Tear Drops Logic - Adjusted for horizontal fish <º... eye is roughly at char index 1 */}
      {sardineState.isCrying && (
        <>
          <div className="absolute top-5 left-[1.8ch] animate-fall text-lg leading-none">💧</div>
          <div className="absolute top-6 left-[2.5ch] animate-fall text-lg leading-none" style={{ animationDelay: '0.4s' }}>💧</div>
          <div className="absolute top-5 left-[1.2ch] animate-fall text-lg leading-none" style={{ animationDelay: '0.8s' }}>💧</div>
        </>
      )}
    </div>
  );
};

export default SardineMascot;
