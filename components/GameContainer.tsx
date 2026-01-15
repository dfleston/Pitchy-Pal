
import React, { useState, useEffect, useRef } from 'react';
import { usePitchDetection } from '../hooks/usePitchDetection';
import { PitchBall } from './PitchBall';
import { Environment } from './Environment';
import { X, Trophy, Music } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface GameContainerProps {
  onExit: () => void;
}

// Frequency range for kids (roughly 100Hz to 800Hz)
const MIN_FREQ = 100;
const MAX_FREQ = 800;

const getNoteFromFreq = (freq: number): string => {
  const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const i = Math.round(12 * (Math.log2(freq / 440))) + 69;
  const octave = Math.floor(i / 12) - 1;
  const note = NOTES[i % 12];
  return `${note}${octave}`;
};

export const GameContainer: React.FC<GameContainerProps> = ({ onExit }) => {
  const { pitch, clarity } = usePitchDetection(true);
  const [ballY, setBallY] = useState(50); // percentage from bottom
  const [feedback, setFeedback] = useState("Let's hear your voice!");
  const feedbackTimerRef = useRef<number | null>(null);
  
  const scoreRef = useRef(0);
  const ballYRef = useRef(ballY);
  
  const isActive = clarity > 0.85 && pitch !== null;
  const currentNote = isActive ? getNoteFromFreq(pitch!) : null;

  useEffect(() => {
    ballYRef.current = ballY;
  }, [ballY]);

  // Movement Logic: Float in middle if no sound, move to pitch if active
  useEffect(() => {
    const targetY = isActive ? (
      ((Math.log(Math.max(MIN_FREQ, Math.min(MAX_FREQ, pitch!))) - Math.log(MIN_FREQ)) / 
       (Math.log(MAX_FREQ) - Math.log(MIN_FREQ))) * 100
    ) : 50; // Floating in the middle

    // Smooth movement (denser fluid feel)
    const interpolationFactor = isActive ? 0.15 : 0.05;
    const interval = setInterval(() => {
        setBallY(prev => prev + (targetY - prev) * interpolationFactor);
    }, 16);

    return () => clearInterval(interval);
  }, [isActive, pitch]);

  // Periodic AI Feedback
  useEffect(() => {
    const getAiCheer = async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `The child is playing a pitch game. They just sang a ${currentNote || 'note'}. 
          Give a 3-word magical encouragement for a 5-year old.`,
          config: { temperature: 0.9, thinkingConfig: { thinkingBudget: 0 } }
        });
        if (response.text) setFeedback(response.text.trim());
      } catch (e) {
        console.error("AI error", e);
      }
    };
    const interval = window.setInterval(getAiCheer, 12000);
    return () => window.clearInterval(interval);
  }, [currentNote]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      <Environment heightPercent={ballY} />

      {/* Header UI */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-30">
        <div className="flex flex-col space-y-3">
          {/* Note Display */}
          <div className={`transition-all duration-300 transform ${isActive ? 'scale-110' : 'scale-100 opacity-50'}`}>
            <div className="bg-white/95 px-6 py-3 rounded-3xl shadow-2xl flex items-center space-x-4 border-4 border-indigo-400">
              <div className={`p-2 rounded-full ${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-400'} transition-colors`}>
                <Music size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-fredoka text-indigo-900 leading-none">
                  {currentNote || "---"}
                </span>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                  {isActive ? `${pitch?.toFixed(1)} Hz` : "Silence"}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-indigo-600/90 backdrop-blur-md px-5 py-2 rounded-2xl text-white font-bold text-sm shadow-xl border border-white/20">
             {feedback}
          </div>
        </div>

        <button 
          onClick={onExit}
          className="bg-red-500 hover:bg-red-400 text-white p-4 rounded-full shadow-lg transition-transform hover:rotate-90 active:scale-90"
        >
          <X size={28} />
        </button>
      </div>

      <PitchBall yPercent={ballY} isActive={isActive} pitch={pitch || 0} />

      {/* Visual Level Guide */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center space-y-4 opacity-30 pointer-events-none">
        <div className="text-white font-fredoka text-xl">HIGH</div>
        <div className="h-48 w-2 bg-gradient-to-t from-white/0 via-white to-white/0 rounded-full" />
        <div className="text-white font-fredoka text-xl">LOW</div>
      </div>

      {/* Bottom Tip */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none">
        <div className={`px-8 py-3 rounded-full backdrop-blur-md border-2 border-white/30 text-white font-bold transition-all duration-500 ${isActive ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          Sing a high note to fly up!
        </div>
      </div>
    </div>
  );
};
