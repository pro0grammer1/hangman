'use client';

import { useState, useEffect, useRef } from 'react';

const useTimer = (startImmediately: boolean) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(startImmediately);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    if (isActive) {
      startTimeRef.current = performance.now();
      const updateTimer = (timestamp: number) => {
        const elapsed = timestamp - startTimeRef.current;
        setTime(elapsed);
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      };
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive]);

  const start = () => setIsActive(true);
  const stop = () => setIsActive(false);
  const reset = () => {
    setTime(0);
    setIsActive(startImmediately);
  };

  const formatTime = () => `${(time / 1000).toFixed(2)}s`;

  return { 
    displayTime: formatTime(),
    rawTime: time,
    start,
    stop,
    reset
  };
};

export default useTimer;