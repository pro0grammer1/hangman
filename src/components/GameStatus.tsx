'use client';

import { useEffect } from 'react';
import Card from '@/components/Card';

type GameResult = 'win' | 'loss' | 'forfeit';

interface GameStatusProps {
  result: GameResult;
  word: string;
  time: string;
  onReset: () => void;
  onMenu: () => void;
}

export const GameStatus = ({
  result,
  word,
  time,
  onReset,
  onMenu
}: GameStatusProps) => {

  const getBackgroundColor = () => {
    switch (result) {
      case 'win':
        return 'bg-green-600';
      case 'loss':
        return 'bg-red-600';
      case 'forfeit':
        return 'bg-[#443939]';
      default:
        return 'bg-gray-800';
    }
  };

  const getResultMessage = () => {
    switch (result) {
      case 'win':
        return '🎉 You Win!';
      case 'loss':
        return '💀 You Lost!';
      case 'forfeit':
        return 'You Surrender';
      default:
        return 'Game Over';
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        onReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onReset]);

  return (
    <div className={`flex flex-col items-center justify-center w-full min-h-[100dvh] text-white ${getBackgroundColor()}`}>
      <div className="max-w-md w-full px-4 text-center">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4">
          The word was: {word}
        </h1>
        
        <h2 className="text-4xl font-bold mb-6">
          {getResultMessage()}
        </h2>

        {result === 'forfeit' && (
          <p className="text-xl mb-6 italic">You didn&rsquo;t even try :(</p>
        )}

        <div className="bg-black/20 rounded-lg p-4 mb-8">
          <p className="text-2xl">Time: {time}</p>
          <p className="text-lg mt-2">
            Letters tried: {Math.floor((word.length * 0.6))}/26
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Card 
            onClick={onReset}
            className="text-lg sm:text-xl px-8 py-3 hover:scale-105 transition-transform"
          >
            Play Again
          </Card>
          <Card 
            onClick={onMenu}
            className="text-lg sm:text-xl px-8 py-3 hover:scale-105 transition-transform"
          >
            Main Menu
          </Card>
        </div>

        <p className="mt-6 text-sm opacity-70">
          Press SPACE to play again
        </p>
      </div>
    </div>
  );
};

GameStatus.displayName = "GameStatus";