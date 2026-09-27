/**
 * SceneBackdrop — cinematic per-scene background art direction.
 *
 * Layers (back → front):
 *   1. base color (var(--bg)) — guarantees no empty edges while art loads
 *   2. all five scene images, stacked, each at full cover
 *   3. cinematic gradient scrim (per-scene direction)
 *   4. vignette
 *
 * Only the ACTIVE scene image is fully opaque; the others fade/scale between
 * scenes, producing a slow camera-like crossfade. Idle drift (slow scale pan)
 * keeps scenes alive without per-frame layout work — pure transform/opacity.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from './content';

export const SCENE_BACKGROUNDS = [
  { src: '/bg/bg-a-teal-amber.png', scrim: 'rgba(6,10,9,0.62)', pos: '50% 42%' }, // HERO — teal/amber
  { src: '/bg/bg-d-red.png', scrim: 'rgba(10,5,7,0.72)', pos: '50% 50%' },        // PROBLEM — deep red/magenta
  { src: '/bg/bg-b-green.png', scrim: 'rgba(5,10,8,0.74)', pos: '50% 50%' },      // HOW IT WORKS — deep green
  { src: '/bg/bg-c-blue.png', scrim: 'rgba(4,7,12,0.72)', pos: '30% 50%' },       // BOB — black/electric blue
  { src: '/bg/bg-a-teal-amber.png', scrim: 'rgba(6,10,9,0.66)', pos: '50% 58%' }, // FINAL — teal/amber returns
] as const;

const DRIFT_S = 26; // slow idle pan per scene

export default function SceneBackdrop({ active }: { active: number }) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0, background: 'var(--bg)' }} aria-hidden="true">
      {SCENE_BACKGROUNDS.map((bg, i) => {
        const isActive = i === active;
        return (
          <motion.div
            key={`${i}-${bg.src}`}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: isActive ? 1 : 0,
              scale: isActive && !reducedMotion ? 1.06 : 1.14,
              x: isActive && !reducedMotion ? '0%' : '-1%',
            }}
            transition={{
              opacity: { duration: 0.9, ease: EASE },
              scale: { duration: reducedMotion ? 0 : DRIFT_S, ease: 'linear' },
              x: { duration: reducedMotion ? 0 : DRIFT_S, ease: 'linear' },
            }}
            style={{ willChange: 'opacity, transform' }}
          >
            <img
              src={bg.src}
              alt=""
              className="h-full w-full"
              style={{ objectFit: 'cover', objectPosition: bg.pos }}
              draggable={false}
            />
            {/* cinematic gradient + vignette */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${bg.scrim} 0%, ${bg.scrim} 55%, rgba(6,8,7,0.85) 100%)`,
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(4,6,5,0.55) 100%)',
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
