"use client";

import { useEffect, useRef } from "react";
import { subscribeToCursor } from "@/hooks/useCursor";

// Manager that shows a single follower element only when hovering certain targets.
// It copies relevant computed styles from the target's ::after pseudo-element.
export default function CursorFollowManager({ selector = ".circle" }: { selector?: string }) {
  // activeTarget will be the element whose ::after we update
  const activeTarget = useRef<HTMLElement | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(0.18);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    function onPointerOver(e: PointerEvent) {
      const t = (e.target as Element).closest?.(selector) as HTMLElement | null;
      if (t && t !== activeTarget.current) {
        activeTarget.current = t;
        // allow per-element speed via data attribute
        const sp = parseFloat((t as HTMLElement).dataset.followSpeed || '');
        speedRef.current = Number.isFinite(sp) ? Math.max(0, Math.min(1, sp)) : (prefersReducedMotion ? 1 : 0.18);
        // initialize CSS vars so the pseudo-element appears roughly where the pointer is
        const rect = t.getBoundingClientRect();
        const xpx = (e.clientX - rect.left);
        const ypx = (e.clientY - rect.top);
        t.style.setProperty("--follow-x", `${xpx}px`);
        t.style.setProperty("--follow-y", `${ypx}px`);

        // start RAF if not running
        if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
      }
    }

    function onPointerOut(e: PointerEvent) {
      const related = (e as any).relatedTarget as Node | null;
      if (activeTarget.current && related && activeTarget.current.contains(related)) return;
      if (activeTarget.current) {
        // clean up variables
        activeTarget.current.style.removeProperty("--follow-x");
        activeTarget.current.style.removeProperty("--follow-y");
        activeTarget.current = null;
      }
    }

  document.addEventListener("pointerover", onPointerOver, { passive: true } as AddEventListenerOptions);
  document.addEventListener("pointerout", onPointerOut, { passive: true } as AddEventListenerOptions);

    const unsubscribe = subscribeToCursor((p) => {
      // Only track while there's an active target to reduce work
      if (!activeTarget.current) return;
      targetPos.current.x = p.x;
      targetPos.current.y = p.y;
    });

    function tick() {
      const t = activeTarget.current;
      if (!t) {
        // stop the loop when inactive
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        return;
      }

      const sp = speedRef.current;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * sp;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * sp;

      const rect = t.getBoundingClientRect();
      // compute pixel position inside the target element
      const xpx = currentPos.current.x - rect.left;
      const ypx = currentPos.current.y - rect.top;
      // optional clamp within the element bounds
      const cx = Math.max(0, Math.min(rect.width, xpx));
      const cy = Math.max(0, Math.min(rect.height, ypx));
      t.style.setProperty("--follow-x", `${cx}px`);
      t.style.setProperty("--follow-y", `${cy}px`);

      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      unsubscribe();
  if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      if (activeTarget.current) {
        activeTarget.current.style.removeProperty("--follow-x");
        activeTarget.current.style.removeProperty("--follow-y");
        activeTarget.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector]);

  return null;
}
