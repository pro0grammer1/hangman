'use client';
import Image from 'next/image';
import Card from '@/components/Card';

export const GameHeader = ({
  lives,
  totalLives,
  time,
  onGiveUp
}: {
  lives: number;
  totalLives: number;
  time: string;
  onGiveUp: () => void;
}) => (
  <div className="flex w-full justify-between items-center p-2 sm:p-8 pt-0">
    <div className="flex h-min">
      {[...Array(lives)].map((_, i) => (
        <Image 
          src="/heart.png" 
          width={30} 
          height={30} 
          alt="heart" 
          key={`heart-${i}`} 
          className="mr-1"
        />
      ))}
      {[...Array(totalLives - lives)].map((_, i) => (
        <Image 
          src="/broken_heart.png" 
          width={30} 
          height={30} 
          alt="broken heart" 
          key={`broken-${i}`}
          className="mr-1"
        />
      ))}
    </div>

    <div className="text-xl font-bold">{time}</div>

    <Card onClick={onGiveUp} className="w-min whitespace-nowrap">
      Give Up
    </Card>
  </div>
);