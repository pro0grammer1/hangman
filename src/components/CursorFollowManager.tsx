"use client";

import { useEffect, useRef } from "react";
import { subscribeToCursor } from "@/hooks/useCursor";

export default function CursorFollowManager({ selector = ".circle" }: { selector?: string }) {
  const activeTarget = useRef<HTMLElement | null>(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const speedRef = useRef(0.18);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function onPointerOver(e: PointerEvent) {
      const t = (e.target as Element).closest?.(selector) as HTMLElement | null;
      if (!t || t === activeTarget.current) return;

      activeTarget.current = t;
      const sp = parseFloat(t.dataset.followSpeed || '');
      speedRef.current = Number.isFinite(sp) ? Math.max(0, Math.min(1, sp)) : (prefersReducedMotion ? 1 : 0.18);
      
      const rect = t.getBoundingClientRect();
      t.style.setProperty("--follow-x", `${e.clientX - rect.left}px`);
      t.style.setProperty("--follow-y", `${e.clientY - rect.top}px`);

      if (rafRef.current === null) rafRef.current = requestAnimationFrame(tick);
    }

    function onPointerOut(e: PointerEvent) {
      const related = e.relatedTarget as Node | null;
      if (activeTarget.current && related && activeTarget.current.contains(related)) return;
      
      if (activeTarget.current) {
        activeTarget.current.style.removeProperty("--follow-x");
        activeTarget.current.style.removeProperty("--follow-y");
        activeTarget.current = null;
      }
    }

    const listenerOptions = { passive: true };
    document.addEventListener("pointerover", onPointerOver, listenerOptions);
    document.addEventListener("pointerout", onPointerOut, listenerOptions);

    const unsubscribe = subscribeToCursor((p) => {
      if (!activeTarget.current) return;
      targetPos.current = p;
    });

    function tick() {
      const t = activeTarget.current;
      if (!t) {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
        return;
      }

      const sp = speedRef.current;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * sp;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * sp;

      const rect = t.getBoundingClientRect();
      const cx = Math.max(0, Math.min(rect.width, currentPos.current.x - rect.left));
      const cy = Math.max(0, Math.min(rect.height, currentPos.current.y - rect.top));
      t.style.setProperty("--follow-x", `${cx}px`);
      t.style.setProperty("--follow-y", `${cy}px`);

      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      unsubscribe();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      if (activeTarget.current) {
        activeTarget.current.style.removeProperty("--follow-x");
        activeTarget.current.style.removeProperty("--follow-y");
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selector]);

  return null;
}
