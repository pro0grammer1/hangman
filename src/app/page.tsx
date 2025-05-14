'use client';

import Image from "next/image";
import Card from "@/components/Card";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [mode, setMode] = useState<'menu' | 'offline' | 'online'>('menu');
  const router = useRouter();

  return (
    <div className={`bg-[url('/background.jpg')] bg-no-repeat bg-cover flex flex-col items-center justify-center w-full  min-h-[100dvh] py-2`}>
      <h1 className="text-6xl font-bold text-[#F06543]">Hangman</h1>
      <hr className="w-60 border-2 border-spacing-0 border-dotted border-[#F06543]"></hr>

      {mode === 'menu' && (
        <div>
          <span className="mt-16 flex flex-row">
            <Card className="bg-[#f06643b4] flex flex-col items-center w-32 h-28" onClick={() => setMode('online')}><Image src="/internet.png" alt="Multiplayer" width={50} height={50} className="mb-4 invert"></Image>Multiplayer</Card>
            <Card className="bg-[#f06643b4] flex flex-col items-center w-32 h-28" onClick={() => setMode('offline')}><Image src="/singleplayer.png" alt="Single Player" width={50} height={50} className="mb-4 invert"></Image>Single Player</Card>
          </span>

          <Card className="bg-[#f06643b4] flex flex-col items-center w-max-content mt-16" onClick={() => { router.push('/logs'); }}>Logs</Card>
          <Card className="bg-[#f06643b4] flex flex-col items-center w-max-content mt-2" onClick={() => { router.push('/logs'); }}>Settings</Card>
        </div>
      )}
      {mode === 'offline' && (
        <span className="mt-16">
          <Card className="bg-[#f06643b4] flex flex-col items-center w-max-content" onClick={() => { router.push('/offline?mode=active-roles'); }}>Wolvesville Roles (Active)</Card>
          <Card className="bg-[#f06643b4] flex flex-col items-center w-max-content" onClick={() => { router.push('/offline?mode=all-roles'); }}>Wolvesville Roles (All)</Card>
          <Card className="bg-[#f06643b4] flex flex-col items-center w-max-content" onClick={() => setMode('menu')}>Main Menu</Card>
        </span>
      )}
      {mode === 'online' && (
        <span className="mt-16">
          <Card className="bg-[#f06643b4] flex flex-col items-center w-max-content">Wolvesville Roles (Active)</Card>
          <Card className="bg-[#f06643b4] flex flex-col items-center w-max-content" onClick={() => setMode('offline')}>Wolvesville Roles (All)</Card>
          <Card className="bg-[#f06643b4] flex flex-col items-center w-max-content" onClick={() => setMode('menu')}>Main Menu</Card>
        </span>
      )}

    </div>
  );
}
