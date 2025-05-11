'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Card from '@/components/Card';
import Words from '@/api/wordlist.json';
import useTimer from '@/hooks/useTimer';

const modes = new Set<string>(['all-roles', 'active-roles', 'bloodwars']);
const keyboardLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
];

const KeyButton = React.memo(({
    letter,
    pressed,
    onClick
}: {
    letter: string;
    pressed: boolean;
    onClick: () => void;
}) => (
    <button
        className={`relative w-16 h-16 bg-black rounded-md
      shadow-[0_4px_0_#222222,0_5px_5px_rgba(0,0,0,0.7)]
      text-white text-lg font-bold cursor-pointer
      transition-all duration-100 ease-in-out
      border-t-0 border-[#222222] border-l-0 border-b-0 border-r-2
      ${pressed ? 'translate-y-1 bg-gray-500 cursor-default shadow-[0_2px_2px_rgba(0,0,0,0.7)]' : ''}`}
        onClick={onClick}
        disabled={pressed}
    >
        {letter.toUpperCase()}
    </button>
));

const KeyboardRow = React.memo(({
    row,
    pressedKeys,
    onClick
}: {
    row: string[];
    pressedKeys: Set<string>;
    onClick: (key: string) => void;
}) => (
    <div className='flex gap-10 justify-center m-10'>
        {row.map(key => (
            <KeyButton
                key={key}
                letter={key}
                pressed={pressedKeys.has(key)}
                onClick={() => onClick(key)}
            />
        ))}
    </div>
));

export default function HangmanGame() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mode = searchParams.get('mode');
    const [isClient, setIsClient] = useState(false);
    const [gameSettings, setGameSettings] = useState({
        timerSetting: 0,
        totalLives: 5
    });

    // Initialize client-side state and settings
    useEffect(() => {
        setIsClient(true);
        if (!mode || !modes.has(mode)) {
            router.push('/');
            return;
        }

        const timerSetting = parseInt(localStorage.getItem('timeState') || '0');
        const totalLives = parseInt(localStorage.getItem('lives') || '5');
        setGameSettings({ timerSetting, totalLives });

        if (!localStorage.getItem('lives')) localStorage.setItem('lives', '5');
        if (!localStorage.getItem('timeState')) localStorage.setItem('timeState', '0');
    }, [mode, router]);

    // Timer logic - fixed to properly handle both start modes
    const { displayTime, start } = useTimer(gameSettings.timerSetting === 0);
    const timerStartedRef = useRef(false);

    // Game state
    const [lives, setLives] = useState(gameSettings.totalLives);
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const word = useMemo(() => {
        if (!isClient || !mode) return '';
        return Words[mode as keyof typeof Words][
            Math.floor(Math.random() * Words[mode as keyof typeof Words].length)
        ];
    }, [mode, isClient]);

    const [wordArr, setWordArr] = useState<(string | "_")[]>([]);

    useEffect(() => {
        if (word) {
            setWordArr([...word].map((c: string) => (c === " " ? " " : "_")));
        }
    }, [word]);

    const wordCount = useMemo(() =>
        wordArr.join("").split(" "),
        [wordArr]
    );

    const handleKeyPress = useCallback((key: string) => {
        setPressedKeys(prev => {
            const newSet = new Set(prev);

            if (word.includes(key)) {
                setWordArr(prevArr =>
                    prevArr.map((char, i) =>
                        word[i] === key ? key : char
                    )
                );
            }

            if (!newSet.has(key)) {
                if (gameSettings.timerSetting === 1 && !timerStartedRef.current) {
                    start();
                    timerStartedRef.current = true;
                }
                newSet.add(key);
            }
            return newSet;
        });
    }, [gameSettings.timerSetting, start, word]);

    // Physical keyboard handler
    useEffect(() => {
        if (!isClient) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            if (/^[a-z]$/.test(key)) {
                handleKeyPress(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isClient, handleKeyPress]);

    if (!isClient || !mode || !modes.has(mode)) {
        return null; // Or loading spinner during initialization
    }

    return (
        <div className="bg-[url('/background.jpg')] bg-no-repeat bg-cover flex flex-col items-center justify-between min-h-screen py-2">
            <div className="flex w-full justify-between items-center p-8 pt-0">
                <div className="flex h-min">
                    {[...Array(lives)].map((_, i) => (
                        <Image src="/heart.png" width={30} height={30} alt="heart" key={`heart-${i}`} />
                    ))}
                    {[...Array(gameSettings.totalLives - lives)].map((_, i) => (
                        <Image src="/broken_heart.png" width={30} height={30} alt="broken heart" key={`broken-${i}`} />
                    ))}
                </div>
                <div className="text-xl font-bold">{displayTime}</div>
                <Card onClick={() => { }} className="w-min-content">Give Up</Card>
            </div>

            <div>
                <h1 className="text-xl font-bold text-black">
                    {wordArr.map((c: string | '_' | ' ', i) => (
                        <span className="mr-4" key={i}>
                            {c === ' ' ? ' ' : c === '_' ? '_' : c}
                        </span>
                    ))}
                </h1>
                <div className="flex justify-around text-2xl font-bold text-black">
                    {wordCount.map((c: string, i) => (
                        <span key={i} className="flex justify-center" style={{ width: `${c.length * 2 - 1}ch` }}>
                            {c.length}
                        </span>
                    ))}
                </div>
            </div>

            <div className="">
                {keyboardLayout.map((row, rowIndex) => (
                    <KeyboardRow
                        key={rowIndex}
                        row={row}
                        pressedKeys={pressedKeys}
                        onClick={handleKeyPress}
                    />
                ))}
            </div>
        </div>
    );
}