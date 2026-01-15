
import React from 'react';
import { Mic, Music, Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 bg-gradient-to-b from-blue-400 to-indigo-600 text-white p-6">
      <div className="text-center animate-bounce">
        <div className="bg-white p-4 rounded-full inline-block shadow-xl mb-4">
          <Music size={64} className="text-indigo-600" />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-fredoka text-center drop-shadow-lg">
        Pitchy Pal
      </h1>
      
      <p className="text-xl md:text-2xl text-center max-w-md font-bold text-blue-100">
        Sing, hum, or whistle to move the magical ball up and down!
      </p>

      <button
        onClick={onStart}
        className="group relative flex items-center space-x-4 bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-10 py-6 rounded-3xl text-3xl font-fredoka transition-all transform hover:scale-110 active:scale-95 shadow-2xl"
      >
        <Play size={40} fill="currentColor" />
        <span>Let's Play!</span>
      </button>

      <div className="flex items-center space-x-3 bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
        <Mic size={24} />
        <span className="text-sm font-bold">Needs Microphone Access</span>
      </div>

      <div className="absolute bottom-8 text-white/50 animate-pulse text-sm">
        Best played with headphones for no echo!
      </div>
    </div>
  );
};
