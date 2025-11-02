"use client";

import React from "react";
import dynamic from "next/dynamic";
import animationData from "../../public/hangmanAnim.json";
import animationDataSmall from "../../public/hangmanAnimSmall.json";

const Player = dynamic(async () => (await import("@lottiefiles/react-lottie-player")).Player, { ssr: false });

const HangmanAnim = () => {
  const largeRef = React.useRef<HTMLDivElement | null>(null);
  const smallRef = React.useRef<HTMLDivElement | null>(null);
  const [isTallScreen, setIsTallScreen] = React.useState(false);
  const [hasCollision, setHasCollision] = React.useState(false);

  // Detect screen height
  React.useEffect(() => {
    const checkHeight = () => {
      setIsTallScreen(window.innerHeight >= 750);
    };
    checkHeight();
    window.addEventListener('resize', checkHeight);
    return () => window.removeEventListener('resize', checkHeight);
  }, []);

  // Collision detection only on tall screens
  React.useEffect(() => {
    let raf = 0;
    let collisionFrames = 0;
    const COLLISION_THRESHOLD = 3; // require collision for 3 frames before switching

    function rectsIntersect(a: DOMRect, b: DOMRect) {
      return (a.bottom > b.top && a.left < b.right);
    }

    function check() {
      const largeEl = largeRef.current;
      const headingEl = document.getElementById('hangman-heading');

      if (largeEl && headingEl) {
        // Get the actual visual bounds accounting for scale transform
        const largeRect = largeEl.getBoundingClientRect();
        const headingRect = headingEl.getBoundingClientRect();

        // Add margin to make collision more sensitive (account for visual scale overflow)
        const marginW = 23.2;
        const marginH = 108;
        const expandedLargeRect = new DOMRect(
          largeRect.right - marginW,
          largeRect.top - marginH,
          largeRect.width + marginW * 2,
          largeRect.height + marginH * 2
        );

        const overlap = rectsIntersect(expandedLargeRect, headingRect);

        // Debounce: require sustained collision to avoid flicker
        if (overlap) {
          collisionFrames++;
          if (collisionFrames >= COLLISION_THRESHOLD) {
            setHasCollision(true);
          }
        } else {
          collisionFrames = 0;
          setHasCollision(false);
        }
      }

      raf = requestAnimationFrame(check);
    }

    raf = requestAnimationFrame(check);
    return () => cancelAnimationFrame(raf);
  }, [isTallScreen]);

  // Decide which animation to show
  // On tall screens: show large unless collision, otherwise show small
  // On small screens: always show small
  const showLarge = isTallScreen && !hasCollision;
  const showSmall = !showLarge; // inverse of showLarge to ensure only one renders

  return (<>
    {showLarge && (
      <div ref={largeRef} style={{ position: 'fixed', top: 0, right: 'calc( 25% - 29px )' }} className="pointer-events-none select-none">
        <Player
          autoplay
          loop={false}
          keepLastFrame={true}
          src={animationData}
          speed={1.5}
          style={{ filter: 'invert(100%)' }}
          className="scale-[1.8] hangmanAnimate"
        />
      </div>
    )}

    {showSmall && (
      <div ref={smallRef} style={{ position: 'fixed', top: '4%', right: 'calc( 50% - 74px)' }} className="pointer-events-none select-none">
        <Player
          autoplay
          loop={false}
          keepLastFrame={true}
          src={animationDataSmall}
          speed={1.5}
          style={{ filter: 'invert(100%)' }}
          className=""
        />
      </div>
    )}
  </>);
};

export default HangmanAnim;