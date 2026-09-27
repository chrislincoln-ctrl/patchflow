import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE, SLIDE_COUNT } from './content';

// ── Tuning ────────────────────────────────────────────────────────────────────
const TRANSITION_S = 0.78; // slide transition duration
const EXIT_S = 0.66; // outgoing slide duration (slightly shorter → overlap feel)
const LOCK_MS = 850; // total input lock around a transition (gesture debounce)
const WHEEL_THRESHOLD = 24; // accumulated |deltaY| needed to trigger a slide change
const WHEEL_RESET_MS = 220; // reset the accumulator when gestures are this far apart
const SWIPE_MIN_PX = 48; // min vertical travel for a touch swipe
const SWIPE_MAX_MS = 700; // max duration for a touch swipe

const variants = {
  enter: (dir: number) => ({
    y: dir >= 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
    zIndex: 2,
  }),
  center: {
    y: '0%',
    opacity: 1,
    scale: 1,
    zIndex: 2,
    transition: { duration: TRANSITION_S, ease: EASE },
  },
  exit: (dir: number) => ({
    y: dir >= 0 ? '-22%' : '22%',
    opacity: 0,
    scale: 0.985,
    zIndex: 1,
    transition: { duration: EXIT_S, ease: EASE },
  }),
};

export interface ScrollStoryProps {
  slides: ReactNode[];
  currentSlide: number;
  onSlideChange: (index: number) => void;
}

function targetElement(e: Event): Element | null {
  return e.target instanceof Element ? e.target : null;
}

/**
 * Full-screen slide deck with deliberate, debounced scroll navigation.
 *
 * - One wheel/trackpad gesture advances ~one slide (delta is accumulated per
 *   gesture burst, so a single fast flick cannot skip multiple slides).
 * - A short input lock spans each transition so gestures queue, not spam.
 * - Keyboard: Arrow/PageDown/Space next · Arrow/PageUp prev · Home/End jump.
 * - Touch: vertical swipe (48px within 700ms).
 * - Incoming slide rises from below (or drops from above) while the outgoing
 *   slide fades/scales back — transform/opacity only, GPU-friendly.
 */
export default function ScrollStory({ slides, currentSlide, onSlideChange }: ScrollStoryProps) {
  const [direction, setDirection] = useState(0);
  const lockedUntilRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const wheelLastAtRef = useRef(0);
  const touchStartRef = useRef<{ y: number; at: number } | null>(null);
  const currentRef = useRef(currentSlide);
  useEffect(() => {
    currentRef.current = currentSlide;
  }, [currentSlide]);
  const reducedMotion = useReducedMotion();

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(SLIDE_COUNT - 1, next));
      if (clamped === currentRef.current) return;
      const now = performance.now();
      if (now < lockedUntilRef.current) return; // input locked mid-transition
      lockedUntilRef.current = now + LOCK_MS;
      setDirection(clamped > currentRef.current ? 1 : -1);
      onSlideChange(clamped);
    },
    [onSlideChange],
  );

  const step = useCallback(
    (delta: number) => {
      goTo(currentRef.current + delta);
    },
    [goTo],
  );

  // Wheel — accumulate delta within a gesture burst; fire once per burst.
  // Inner [data-scrollable] areas scroll natively; at their boundary the
  // gesture chains into slide navigation.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (now - wheelLastAtRef.current > WHEEL_RESET_MS) {
        wheelAccumRef.current = 0; // new gesture
      }
      wheelLastAtRef.current = now;

      const scroller = targetElement(e)?.closest('[data-scrollable]') as HTMLElement | null;
      if (scroller) {
        const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
        const atStart = scroller.scrollTop <= 0;
        const canScroll = e.deltaY > 0 ? !atEnd : !atStart;
        if (canScroll) return; // let the inner area scroll
      }

      // Slide already in motion — ignore the rest of the burst.
      if (now < lockedUntilRef.current) return;

      wheelAccumRef.current += e.deltaY;
      if (Math.abs(wheelAccumRef.current) < WHEEL_THRESHOLD) return;

      const dir = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      step(dir);
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel);
  }, [step]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = targetElement(e);
      if (
        el instanceof HTMLElement &&
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)
      )
        return;

      switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          step(1);
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          step(-1);
          break;
        case 'Home':
          e.preventDefault();
          goTo(0);
          break;
        case 'End':
          e.preventDefault();
          goTo(SLIDE_COUNT - 1);
          break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, step]);

  // Touch swipe — skipped when the gesture starts inside a scrollable area
  // (native scrolling wins there; the dots remain tappable for navigation).
  useEffect(() => {
    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      if (targetElement(e)?.closest('[data-scrollable]')) return;
      touchStartRef.current = { y: e.touches[0].clientY, at: performance.now() };
    };
    const onEnd = (e: TouchEvent) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start) return;
      const dy = start.y - (e.changedTouches[0]?.clientY ?? start.y);
      const dt = performance.now() - start.at;
      if (dt <= SWIPE_MAX_MS && Math.abs(dy) >= SWIPE_MIN_PX) {
        step(dy > 0 ? 1 : -1);
      }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, [step]);

  const index = Math.max(0, Math.min(SLIDE_COUNT - 1, currentSlide));
  const slide = slides[index];

  const enterState = reducedMotion ? { opacity: 0, y: 0, scale: 1, zIndex: 2 } : 'enter';
  const centerState = reducedMotion
    ? { y: '0%', opacity: 1, scale: 1, zIndex: 2, transition: { duration: 0.01 } }
    : 'center';
  const exitState = reducedMotion
    ? { opacity: 0, y: 0, scale: 1, zIndex: 1, transition: { duration: 0.01 } }
    : 'exit';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={variants}
          initial={enterState}
          animate={centerState}
          exit={exitState}
          className="absolute inset-0"
        >
          {slide}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
