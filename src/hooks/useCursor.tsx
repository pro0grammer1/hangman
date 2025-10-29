"use client";

import { useEffect } from "react";

type Point = { x: number; y: number };

// Module-level state so multiple components share a single listener/loop.
const subscribers = new Set<(p: Point) => void>();
let pointerX = 0;
let pointerY = 0;
let rafId: number | null = null;
let listenersInstalled = false;

function pointerMove(e: PointerEvent) {
  pointerX = e.clientX;
  pointerY = e.clientY;
}

function loop() {
  // broadcast the latest pointer to all subscribers
  const p: Point = { x: pointerX, y: pointerY };
  subscribers.forEach((cb) => cb(p));
  rafId = requestAnimationFrame(loop);
}

function ensureRunning() {
  if (!listenersInstalled && typeof window !== "undefined") {
    // passive listener to avoid blocking default scrolling behavior
    window.addEventListener("pointermove", pointerMove, { passive: true } as AddEventListenerOptions);
    listenersInstalled = true;
  }
  if (rafId == null) {
    rafId = requestAnimationFrame(loop);
  }
}

function teardownIfUnused() {
  if (subscribers.size === 0) {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (listenersInstalled && typeof window !== "undefined") {
      window.removeEventListener("pointermove", pointerMove as any);
      listenersInstalled = false;
    }
  }
}

/**
 * Subscribe to global cursor moves. Returns an unsubscribe function.
 * The callback is called frequently (raf cadence) with {x,y} in client coordinates.
 */
export function subscribeToCursor(cb: (p: Point) => void) {
  subscribers.add(cb);
  ensureRunning();
  return () => {
    subscribers.delete(cb);
    teardownIfUnused();
  };
}

/**
 * React hook wrapper for subscribing to cursor updates. Use in client components.
 * Example: const { subscribe } = useCursor(); useEffect(()=> subscribe(p=>...), []);
 */
export function useCursor() {
  useEffect(() => {
    // ensure the global listeners start on first hook mount
    ensureRunning();
    return () => {
      // don't teardown here — teardown happens when there are no subscribers
    };
  }, []);

  return {
    subscribe: subscribeToCursor,
    getPosition: () => ({ x: pointerX, y: pointerY }),
  } as const;
}
