"use client";

import React from "react";
import dynamic from "next/dynamic";
import animationData from "../../public/hangmanAnim.json";

const Player = dynamic(async () => (await import("@lottiefiles/react-lottie-player")).Player, { ssr: false });

const HangmanAnim = () => {
  return (
    <Player
      autoplay
      loop={false}
      keepLastFrame={true}
      src={animationData}
      speed={1.5}
      style={{ top: '4%', right: '25%', position: 'absolute', filter: 'invert(100%)', transform: 'scale(1.3)' }}
    />
  );
};

export default HangmanAnim;