import { Suspense } from 'react';
import HangmanGame from './OfflineClient';

export default function OfflinePage() {
  return (
    <Suspense fallback={<div className="text-white">Loading game...</div>}>
      <HangmanGame />
    </Suspense>
  );
}
