'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { GameStatus } from '@/components/GameStatus';
import { WordDisplay } from '@/components/WordDisplay';
import { GameHeader } from '@/components/GameControls';
import { KeyboardRow, keyboardLayout } from '@/components/Keyboard';
import Words from '@/api/wordlist.json';
import useTimer from '@/hooks/useTimer';
import { MODES, DEFAULT_LIVES, DEFAULT_TIMER } from '@/constants/game';

export default function HangmanGame() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const mode = searchParams.get('mode');
    const [isClient, setIsClient] = useState(false);
    const [gameSettings, setGameSettings] = useState({
        timerSetting: DEFAULT_TIMER,
        totalLives: DEFAULT_LIVES
    });
    const [gameOver, setGameOver] = useState(false);
    const [gameResult, setGameResult] = useState<'win' | 'loss' | 'forfeit' | null>(null);

    useEffect(() => {
        setIsClient(true);
        if (!mode || !MODES.has(mode)) {
            router.push('/');
            return;
        }

        const timerSetting = parseInt(localStorage.getItem('timeState') || '0');
        const totalLives = parseInt(localStorage.getItem('lives') || '5');
        setGameSettings({ timerSetting, totalLives });

        if (!localStorage.getItem('lives')) localStorage.setItem('lives', '5');
        if (!localStorage.getItem('timeState')) localStorage.setItem('timeState', '0');
    }, [mode, router]);

    const { displayTime, start, reset, stop } = useTimer(gameSettings.timerSetting === 0);
    const timerStartedRef = useRef(false);

    const [lives, setLives] = useState(gameSettings.totalLives);
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [word, setWord] = useState('');

    const getNewWord = useCallback(() => {
        if (!isClient || !mode) return '';
        const newWord = Words[mode as keyof typeof Words][
            Math.floor(Math.random() * Words[mode as keyof typeof Words].length)
        ];
        setWord(newWord);
    }, [mode, isClient]);

    const [wordArr, setWordArr] = useState<(string | "_")[]>([]);

    useEffect(() => {
        getNewWord();
    }, [getNewWord]);

    useEffect(() => {
        if (word) {
            setWordArr([...word].map((c: string) => (c === " " ? " " : "_")));
        }
    }, [word]);

    useEffect(() => {
        if (!word) return;
        if (wordArr.join("") === word) {
            stop();
            setGameOver(true);
            setGameResult('win');
        };
    }, [word, wordArr, stop, setGameOver, setGameResult]);

    const wordCount = useMemo(() =>
        wordArr.join("").split(" "),
        [wordArr]
    );

    const giveUp = () => {
        stop();
        setGameOver(true);
        setGameResult('forfeit');
    }

    const handleKeyPress = useCallback((key: string) => {

        key = key.toUpperCase();
        if (pressedKeys.has(key)) return;

        setPressedKeys(prev => {
            const newSet = new Set(prev);

            if (word.includes(key)) {
                setWordArr(prevArr =>
                    prevArr.map((char, i) =>
                        word[i] === key ? key : char
                    )
                );

            } else {
                if (lives > 1) {
                    setLives(lives - 1);
                } else {
                    stop();
                    setGameOver(true);
                    setGameResult('loss');
                }
            }

            if (!newSet.has(key)) {
                if (gameSettings.timerSetting === 1 && !timerStartedRef.current) {
                    start();Wolvesville Ro
                    timerStartedRef.current = true;
                }
                newSet.add(key);
            }
            return newSet;
        });

    }, [gameSettings.timerSetting, lives, pressedKeys, stop, start, word]);

    useEffect(() => {
        if (!isClient) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key.toUpperCase();
            if (/^[A-Z]$/.test(key)) {
                handleKeyPress(key);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isClient, handleKeyPress]);


    const resetGame = useCallback(() => {
        if (!isClient || !mode) return;

        getNewWord();

        setPressedKeys(new Set());
        setLives(gameSettings.totalLives);
        setWordArr([...word].map((c: string) => (c === " " ? " " : "_")));
        timerStartedRef.current = false;
        reset();
        setGameOver(false);
        setGameResult(null);
    }, [isClient, mode, getNewWord, word, gameSettings.totalLives, reset]);

  if (gameOver && gameResult) {
    return (
      <GameStatus
        result={gameResult}
        word={word}
        time={displayTime}
        onReset={resetGame}
        onMenu={() => router.push('/')}
      />
    );
  }

  return (
    <div className="select-none bg-[url('/background.jpg')] bg-no-repeat bg-cover flex flex-col items-center justify-between w-full min-h-[100dvh] py-2 overflow-hidden">
      <GameHeader
        lives={lives}
        totalLives={DEFAULT_LIVES}
        time={displayTime}
        onGiveUp={giveUp}
      />

      <WordDisplay
        wordArr={wordArr}
        wordCount={wordCount}
      />

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
}Wolvesville Ro