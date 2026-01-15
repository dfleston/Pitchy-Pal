
import React, { useState, useEffect, useRef } from 'react';

interface PitchBallProps {
  yPercent: number;
  isActive: boolean;
  pitch: number;
}

export const PitchBall: React.FC<PitchBallProps> = ({ yPercent, isActive, pitch }) => {
  const [vibration, setVibration] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number>(0);

  // Micro-vibration logic
  useEffect(() => {
    const animate = (time: number) => {
      if (isActive && pitch > 0) {
        // High pitch: high frequency, small amplitude (fast jitter)
        // Low pitch: low frequency, larger amplitude (slow wobble)
        
        // Normalize pitch factor for vibration
        // Low (100Hz) -> High (800Hz)
        const freqFactor = (pitch - 100) / 700; 
        
        // Frequency: higher pitch means faster oscillation
        const speed = 0.01 + (freqFactor * 0.05); 
        // Amplitude: higher pitch means smaller movement
        const amp = 4 - (freqFactor * 3); 

        const offsetX = Math.sin(time * speed) * amp;
        const offsetY = Math.cos(time * speed * 1.1) * amp;
        
        setVibration({ x: offsetX, y: offsetY });
      } else {
        // Gentle "breathing" float when inactive
        const floatY = Math.sin(time * 0.002) * 5;
        setVibration({ x: 0, y: floatY });
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive, pitch]);

  return (
    <div 
      className="absolute left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-out"
      style={{ 
        bottom: `${yPercent}%`,
        transform: `translateX(-50%) translate(${vibration.x}px, ${vibration.y}px)`
      }}
    >
      <div className={`relative w-24 h-24 rounded-full shadow-2xl transition-all duration-500 ${
        isActive 
          ? 'bg-gradient-to-tr from-yellow-300 via-orange-400 to-pink-500 ring-4 ring-white shadow-orange-500/50 scale-110' 
          : 'bg-gradient-to-tr from-blue-400 to-indigo-600 ring-2 ring-white/20 scale-100'
      }`}>
        
        {/* Face */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Eyes container */}
            <div className="flex space-x-5 mb-2">
                <div className={`w-4 h-4 bg-white rounded-full relative transition-all duration-300 ${isActive && pitch > 500 ? 'scale-y-125' : ''}`}>
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <div className={`w-4 h-4 bg-white rounded-full relative transition-all duration-300 ${isActive && pitch > 500 ? 'scale-y-125' : ''}`}>
                    <div className="absolute top-1 left-1.5 w-1.5 h-1.5 bg-black rounded-full" />
                </div>
            </div>
            
            {/* Mouth */}
            <div className={`transition-all duration-300 rounded-full border-white ${
                isActive 
                    ? pitch > 400 
                        ? 'w-8 h-4 border-b-4 -mt-1' // Big smile for high pitch
                        : 'w-6 h-6 border-4' // O-mouth for low pitch
                    : 'w-4 h-1 bg-white/40' // Relaxed line
            }`} />
        </div>

        {/* Glow / Aura */}
        {isActive && (
          <div className="absolute inset-0 -z-10 bg-white/30 rounded-full blur-xl animate-pulse" />
        )}
        
        {/* Sparkles for high pitch */}
        {isActive && pitch > 600 && (
            <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-2 h-2 bg-yellow-200 rounded-full animate-ping" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-white rounded-full animate-ping delay-75" />
            </div>
        )}
      </div>
    </div>
  );
};
