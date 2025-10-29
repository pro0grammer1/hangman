'use client';

import HangmanAnim from "@/components/hangmanAnim";
import Image from "next/image";
import Card from "@/components/Card";
import CursorFollowManager from "@/components/CursorFollowManager";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [mode, setMode] = useState<'menu' | 'offline' | 'online'>();
  const router = useRouter();
  const spinner = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMode('menu');
    spinner.current?.classList.toggle("animate-bounce");
  }, []);

  return (
    <div className={`bganimate bg-size-[200%] bg-linear-to-br from-secondary from-30% to-tertiary bg-no-repeat bg-secondary flex flex-col items-center justify-center w-full  min-h-dvh py-2`}>
      <p className="text-6xl font-bold text-shadow-sm text-shadow-black text-white flex">Han<span ref={spinner} className="animate-bounce">g</span>man</p>
      <CursorFollowManager />

      {mode === 'menu' && (
        <div>
          <HangmanAnim />
          <span className="mt-6 flex flex-row">
            <Card className="bg-primary flex items-center w-auto h-min gap-2 relative overflow-clip circle" onClick={() => setMode('online')}><Image src="/swords.png" alt="Multiplayer" width={30} height={30} className="m-1"></Image>Multiplayer</Card>
            <Card className="bg-primary flex items-center w-auto h-min gap-2 relative overflow-clip circle" onClick={() => setMode('offline')}><Image src="/singleplayer.png" alt="Single Player" width={30} height={30} className="m-1"></Image>Single Player</Card>
          </span>

          <div className="fixed right-10 top-[40%] flex flex-col items-center ">
            <Image width={50} height={50} alt="Logs" src='/logs.svg' className="flex flex-col items-center w-max-content mt-16" onClick={() => { router.push('/logs'); }} />
            <span className="cursor-pointer rounded-full w-9 h-9 comp items-center content-center justify-center text-center"><Image width={30} height={30} alt="Logs" src='/logs.svg' className="items-center w-max-content m-auto" onClick={() => { router.push('/logs'); }} /></span>
          </div>
        </div>

      )}
      {mode === 'offline' && (
        <span className="mt-16">
          <Card className="bg-primary flex flex-col items-center w-max-content" onClick={() => { router.push('/offline?mode=active-roles'); }}>Wolvesville Roles (Active)</Card>
          <Card className="bg-primary flex flex-col items-center w-max-content" onClick={() => { router.push('/offline?mode=all-roles'); }}>Wolvesville Roles (All)</Card>
          <Card className="bg-primary flex flex-col items-center w-max-content" onClick={() => setMode('menu')}>Main Menu</Card>
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
