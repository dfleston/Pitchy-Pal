
import React from 'react';

interface EnvironmentProps {
  heightPercent: number;
}

export const Environment: React.FC<EnvironmentProps> = ({ heightPercent }) => {
  // Logic to determine background colors based on height
  // Low (0-20%): Deep Sea (Dark Blue)
  // Mid (20-80%): Sky (Light Blue)
  // High (80-100%): Space (Purple/Black)

  let bgColor = 'from-sky-300 to-sky-500';
  if (heightPercent < 20) {
    bgColor = 'from-blue-800 to-blue-600';
  } else if (heightPercent > 85) {
    bgColor = 'from-indigo-900 via-purple-900 to-black';
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-b ${bgColor} transition-colors duration-1000 ease-in-out`}>
      {/* Stars for High Pitch */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${heightPercent > 80 ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 50}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Clouds for Mid Pitch */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${heightPercent > 30 && heightPercent < 85 ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/30 rounded-full blur-2xl"
            style={{
              top: `${Math.random() * 40 + 20}%`,
              left: `${Math.random() * 120 - 10}%`,
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 60 + 40}px`,
            }}
          />
        ))}
      </div>

      {/* Fish/Bubbles for Low Pitch */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${heightPercent < 30 ? 'opacity-100' : 'opacity-0'}`}>
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute border-2 border-white/20 rounded-full animate-bounce"
            style={{
              bottom: `${Math.random() * 20}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 10}px`,
              height: `${Math.random() * 20 + 10}px`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          />
        ))}
      </div>
      
      {/* Floor / Horizon */}
      <div 
        className="absolute bottom-0 w-full h-1/4 bg-blue-900/20 backdrop-blur-sm pointer-events-none transition-transform duration-1000"
        style={{ transform: `translateY(${heightPercent * 0.5}%)` }}
      />
    </div>
  );
};
