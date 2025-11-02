'use client';

import HangmanAnim from "@/components/hangmanAnim";
import LogsAnim from '@/components/logsAnim';
import Image from "next/image";
import Card from "@/components/Card";
import CursorFollowManager from "@/components/CursorFollowManager";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [mode, setMode] = useState<'menu' | 'offline' | 'online'>();
  const router = useRouter();
  const loaded = useRef(false);
  const spinner = useRef<HTMLInputElement>(null);
  const [letters, setLetters] = useState<Array<{ id: number; x: number; char: string }>>([]);

  useEffect(() => {
    setMode('menu');
    spinner.current?.classList.toggle("animate-bounce");
    loaded.current = true;

    // Create letters periodically
    const interval = setInterval(() => {
      const newLetter = {
        id: Date.now() + Math.random(),
        // normalizing random position to avoid clipping on sides
        x: Math.random() * 90 + 5,
        char: String.fromCharCode(65 + Math.floor(Math.random() * 26)) // Random A-Z
      };
      setLetters(prev => [...prev, newLetter]);

      // Remove letter after animation completes
      setTimeout(() => {
        setLetters(prev => prev.filter(l => l.id !== newLetter.id));
      }, 3000);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loaded.current) {
      if (spinner.current?.classList.contains("animate-bounce")) {
        spinner.current?.classList.remove("animate-bounce");
      }
    }
  }, [mode]);

  return (
    <div className={`bganimate bg-size-[150%] bg-linear-to-br from-secondary from-30% to-tertiary bg-no-repeat bg-secondary flex flex-col items-center justify-center w-full min-h-dvh py-2 overflow-hidden`}>
      {/* Falling letters */}
      {letters.map(letter => (
        <div
          key={letter.id}
          className="letter opacity-45 text-4xl md:text-8xl text-white absolute top-0 animate-fall pointer-events-none"
          style={{ left: `${letter.x}%` }}
        >
          {letter.char}
        </div>
      ))}
      
      <p id="hangman-heading" className="text-6xl font-bold text-shadow-sm text-shadow-black text-white flex">Han<span ref={spinner} className="animate-bounce">g</span>man</p>
      <CursorFollowManager />

      {mode === 'menu' && (
        <div className="relative">
          <HangmanAnim />
          <span className="mt-6 flex flex-row">
            <Card className="bg-primary flex items-center w-auto h-min gap-2 relative overflow-clip circle" onClick={() => setMode('online')}><Image src="/swords.png" alt="Multiplayer" width={30} height={30} className="m-1"></Image>Multiplayer</Card>
            <Card className="bg-primary flex items-center w-auto h-min gap-2 relative overflow-clip circle" onClick={() => setMode('offline')}><Image src="/singleplayer.png" alt="Single Player" width={30} height={30} className="m-1"></Image>Single Player</Card>
          </span>

          <div className="absolute flex w-full justify-around -bottom-20">
            <LogsAnim />
            <Image width={40} height={40} alt="Settings" src='/settings.svg' className="w-10 h-10 cursor-pointer hover:rotate-180 hover:transition-transform" onClick={() => { router.push('/logs'); }} />
          </div>
        </div>
      )}
      {mode === 'offline' && (
        <span className="mt-16">
          <Card className="bg-primary flex flex-col items-center w-max-content relative overflow-clip circle" onClick={() => { router.push('/offline?mode=active-roles'); }}>Wolvesville Roles (Active)</Card>
          <Card className="bg-primary flex flex-col items-center w-max-content relative overflow-clip circle" onClick={() => { router.push('/offline?mode=all-roles'); }}>Wolvesville Roles (All)</Card>
          <Card className="bg-primary flex flex-col items-center w-max-content relative overflow-clip circle" onClick={() => setMode('menu')}>Main Menu</Card>
        </span>
      )}
      {mode === 'online' && (
        <span className="mt-16">
          <Card className="bg-primary flex flex-col items-center w-max-content">Wolvesville Roles (Active)</Card>
          <Card className="bg-primary flex flex-col items-center w-max-content" onClick={() => setMode('offline')}>Wolvesville Roles (All)</Card>
          <Card className="bg-primary flex flex-col items-center w-max-content" onClick={() => setMode('menu')}>Main Menu</Card>
        </span>
      )}

    </div>
  );
}
