import { Suspense } from 'react';
import LogComponent from './LogClient';

export default function OfflinePage() {
  return (
    <Suspense fallback={<div className="text-white">Loading game...</div>}>
      <LogComponent />
    </Suspense>
  );
}
