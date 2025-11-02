import { useRef } from 'react';
import dynamic from "next/dynamic";
import animationData from '../../public/logsAnim.json';

const Player = dynamic(async () => (await import("@lottiefiles/react-lottie-player")).Player, { ssr: false });

interface LottieInstance {
  play: () => void;
  pause: () => void;
  stop: () => void;
  setDirection: (direction: 1 | -1) => void;
  setSpeed: (speed: number) => void;
}

const LogsAnim = () => {
    const playerRef = useRef<LottieInstance | null>(null);

  const handleMouseEnter = () => {
    if (playerRef.current) {
      playerRef.current?.setDirection(1);
      playerRef.current?.play();
    }
  };

  const handleMouseLeave = () => {
    if (playerRef.current) {
      playerRef.current?.setDirection(-1);
      playerRef.current?.play();
    }
  };

    return (
        <div className="logs-animation" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Player
                lottieRef={(instance) => { playerRef.current = instance; }}
                keepLastFrame
                loop={false}
                src={animationData}
                className="w-15 mr-15 h-10 cursor-pointer"
            />
        </div>
    );
}

export default LogsAnim;
