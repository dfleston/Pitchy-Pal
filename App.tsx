
import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { GameContainer } from './components/GameContainer';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'welcome' | 'playing'>('welcome');

  const handleStartGame = () => {
    setGameState('playing');
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-sky-100">
      {gameState === 'welcome' ? (
        <WelcomeScreen onStart={handleStartGame} />
      ) : (
        <GameContainer onExit={() => setGameState('welcome')} />
      )}
    </div>
  );
};

export default App;
