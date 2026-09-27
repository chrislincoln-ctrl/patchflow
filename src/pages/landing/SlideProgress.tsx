import { motion } from 'framer-motion';
import { EASE, SLIDE_COUNT, SLIDE_LABELS } from './content';

export interface SlideProgressProps {
  currentSlide: number;
  onSlideSelect: (index: number) => void;
}

/** Fixed right-edge scene indicator: 01–05, active scene highlighted. */
export default function SlideProgress({ currentSlide, onSlideSelect }: SlideProgressProps) {
  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-end gap-2.5"
      aria-hidden="false"
    >
      {Array.from({ length: SLIDE_COUNT }, (_, i) => {
        const isActive = i === currentSlide;
        return (
          <button
            key={i}
            onClick={() => onSlideSelect(i)}
            className="group flex items-center gap-2.5 p-0.5"
            aria-label={`Go to ${SLIDE_LABELS[i]}`}
            aria-current={isActive}
          >
            <span
              className="text-xs font-mono transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                letterSpacing: '0.1em',
                fontSize: 10,
                opacity: isActive ? 0.9 : undefined,
                textShadow: '0 1px 8px rgba(0,0,0,0.6)',
              }}
            >
              {SLIDE_LABELS[i]}
            </span>
            <motion.span
              className="font-mono rounded"
              animate={{
                color: isActive ? 'var(--accent)' : 'rgba(234,242,234,0.35)',
                scale: isActive ? 1.12 : 1,
              }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{
                fontSize: 11,
                letterSpacing: '0.08em',
                textShadow: '0 1px 8px rgba(0,0,0,0.7)',
                fontWeight: isActive ? 700 : 400,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </motion.span>
            <motion.span
              className="block rounded-full"
              animate={{
                scale: isActive ? 1 : 0.6,
                backgroundColor: isActive ? 'var(--accent)' : 'rgba(234,242,234,0.28)',
              }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{
                width: 5,
                height: 5,
                boxShadow: isActive ? '0 0 10px rgba(78, 207, 138, 0.55)' : 'none',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
