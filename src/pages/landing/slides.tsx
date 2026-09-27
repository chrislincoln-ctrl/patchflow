import { motion } from 'framer-motion';
import { Zap, CheckCircle } from 'lucide-react';
import GatewayFlow from '../../components/ui/gateway-flow';
import type { CSSProperties, ReactNode } from 'react';
import {
  bobCapabilities,
  bobFlow,
  EASE,
  howItWorks,
  patchflowSteps,
  traditionalSteps,
  workflowSteps,
} from './content';

// ── Display typography scale ──────────────────────────────────────────────────
const DISPLAY: CSSProperties = {
  fontSize: 'clamp(44px, 7.5vw, 108px)',
  lineHeight: 0.98,
  letterSpacing: '-0.035em',
  fontWeight: 700,
};

const DISPLAY_MD: CSSProperties = {
  fontSize: 'clamp(34px, 5vw, 72px)',
  lineHeight: 1.02,
  letterSpacing: '-0.03em',
  fontWeight: 700,
};

const EYEBROW: CSSProperties = {
  color: 'var(--text-secondary)',
  letterSpacing: '0.22em',
  fontSize: 11,
  fontWeight: 600,
};

// Scene content sits above the SceneBackdrop (z 0) and below header (z 50).
const CONTENT_Z = 1;

function Reveal({
  children,
  delay = 0,
  active,
  y = 28,
  className = '',
  style,
}: {
  children: ReactNode;
  delay?: number;
  active: boolean;
  y?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: y * 0.4 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 01 — HERO
// ══════════════════════════════════════════════════════════════════════════════
export interface HeroSlideProps {
  onRunDemo: () => void;
  onExplore: () => void;
  currentSlide: number;
}

export function HeroSlide({ onRunDemo, onExplore, currentSlide }: HeroSlideProps) {
  const active = currentSlide === 0;
  return (
    <section className="relative h-full w-full flex flex-col items-center justify-center text-center px-6 md:px-10 overflow-hidden">
      {/* Restored GatewayFlow animation — exactly as the original hero */}
      <div
        className="absolute overflow-hidden pointer-events-none"
        style={{ zIndex: 0, top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100vw' }}
        aria-hidden="true"
      >
        <GatewayFlow className="h-full w-full" opacity={0.55} />
      </div>

      <div className="relative max-w-5xl mx-auto w-full py-20" style={{ zIndex: 1 }}>
        <Reveal active={active} delay={0.05}>
          <div
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs mb-7 md:mb-9"
            style={{
              background: 'rgba(12,14,12,0.55)',
              border: '1px solid rgba(234, 242, 234, 0.14)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.16em',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
            AGENTIC DEBUGGING WORKFLOW
          </div>
        </Reveal>

        <Reveal active={active} delay={0.15}>
          <h1 className="uppercase" style={DISPLAY}>
            <span style={{ color: 'var(--text-primary)', textShadow: '0 2px 40px rgba(0,0,0,0.45)' }}>
              Debug the bug.
            </span>
            <br />
            <span style={{ color: 'var(--accent)', textShadow: '0 2px 44px rgba(78,207,138,0.25)' }}>
              Not the entire codebase.
            </span>
          </h1>
        </Reveal>

        <Reveal active={active} delay={0.28}>
          <p
            className="mt-6 md:mt-8 mb-8 md:mb-10 max-w-2xl text-base md:text-lg"
            style={{ color: 'rgba(234,242,234,0.78)', lineHeight: 1.6, textShadow: '0 1px 20px rgba(0,0,0,0.5)' }}
          >
            PatchFlow turns fragmented debugging into a coordinated workflow:
            investigate evidence in parallel, identify the root cause, generate the
            smallest safe patch, add regression coverage, and verify the result.
          </p>
        </Reveal>

        <Reveal active={active} delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRunDemo}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: 'var(--accent)',
                color: '#0C0D0B',
                boxShadow: '0 8px 32px rgba(78, 207, 138, 0.28)',
              }}
            >
              <Zap size={16} />
              RUN THE DEBUGGING DEMO
            </button>
            <button
              onClick={onExplore}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded font-medium text-sm transition-colors"
              style={{
                border: '1px solid rgba(234,242,234,0.22)',
                color: 'var(--text-primary)',
                background: 'rgba(12,14,12,0.4)',
                backdropFilter: 'blur(6px)',
              }}
            >
              EXPLORE THE WORKFLOW
            </button>
          </div>
        </Reveal>
      </div>

      {/* Live pipeline — full-width, animated */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 px-6 md:px-10 pb-8 pt-14"
        style={{
          zIndex: CONTENT_Z,
          background: 'linear-gradient(180deg, rgba(8,10,9,0) 0%, rgba(8,10,9,0.82) 45%, rgba(8,10,9,0.95) 100%)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease: EASE }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 md:gap-2">
          {workflowSteps.map((step, i) => (
            <HeroPipelineNode key={step.label} step={step} index={i} active={active} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function HeroPipelineNode({
  step,
  index,
  active,
}: {
  step: { label: string; color: string };
  index: number;
  active: boolean;
}) {
  return (
    <>
      <motion.div
        className="flex flex-col items-center gap-2 min-w-0"
        initial={{ opacity: 0, y: 14 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 0 }}
        transition={{ delay: 0.65 + index * 0.09, duration: 0.45, ease: EASE }}
      >
        <motion.div
          className="rounded-full"
          style={{ background: step.color, width: 10, height: 10 }}
          animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
          transition={{ delay: 0.9 + index * 0.14, duration: 0.7, repeat: 0 }}
        />
        <span
          className="font-semibold whitespace-nowrap"
          style={{
            color: step.color,
            fontSize: 'clamp(7px, 0.75vw, 11px)',
            letterSpacing: '0.14em',
          }}
        >
          {step.label}
        </span>
      </motion.div>
      {index < workflowSteps.length - 1 && (
        <div className="flex-1 flex items-center mb-5 min-w-2">
          <motion.div
            className="h-px w-full origin-left"
            style={{
              background: `linear-gradient(90deg, ${step.color}, ${workflowSteps[index + 1].color})`,
              opacity: 0.5,
            }}
            initial={{ scaleX: 0 }}
            animate={active ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ delay: 0.85 + index * 0.12, duration: 0.5, ease: EASE }}
          />
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 02 — THE PROBLEM
// ══════════════════════════════════════════════════════════════════════════════
export function ProblemSlide({ active }: { active: boolean }) {
  return (
    <section className="relative h-full w-full flex flex-col justify-center px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full py-20" data-scrollable style={{ maxHeight: '100%', overflowY: 'auto' }}>
        <Reveal active={active} delay={0.05}>
          <div style={EYEBROW} className="mb-4">01 — THE PROBLEM</div>
        </Reveal>
        <Reveal active={active} delay={0.12}>
          <h2 className="uppercase max-w-4xl" style={{ ...DISPLAY_MD, textShadow: '0 2px 36px rgba(0,0,0,0.5)' }}>
            Debugging is an{' '}
            <span style={{ color: 'var(--error)' }}>investigation problem.</span>
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-5 md:gap-8 mt-8 md:mt-12 items-start">
          {/* Traditional — fragmented */}
          <Reveal active={active} delay={0.25} y={36} className="h-full">
            <div
              className="h-full rounded-xl p-5 md:p-7"
              style={{
                background: 'rgba(14,8,9,0.66)',
                border: '1px solid rgba(255, 92, 92, 0.28)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-baseline justify-between mb-5">
                <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--error)', letterSpacing: '0.16em' }}>
                  TRADITIONAL DEBUGGING
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
                  ~11 context switches · illustrative
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
                {traditionalSteps.map((step, i) => (
                  <motion.div
                    key={step}
                    className="flex items-center gap-2.5 py-1"
                    initial={{ opacity: 0, x: -18 - (i % 4) * 7, rotate: i % 2 ? 1.2 : -1.2 }}
                    animate={active ? { opacity: 1, x: 0, rotate: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.35 + i * 0.05, ease: EASE }}
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0 font-mono"
                      style={{
                        background: 'rgba(255,92,92,0.1)',
                        color: 'var(--error)',
                        border: '1px solid rgba(255,92,92,0.22)',
                        fontSize: 9,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs md:text-sm" style={{ color: 'rgba(234,242,234,0.72)' }}>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* PatchFlow — coordinated */}
          <Reveal active={active} delay={0.38} y={36} className="h-full">
            <div
              className="h-full rounded-xl p-5 md:p-7"
              style={{
                background: 'rgba(7,13,10,0.66)',
                border: '1px solid rgba(78, 207, 138, 0.3)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-baseline justify-between mb-5">
                <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--accent)', letterSpacing: '0.16em' }}>
                  PATCHFLOW
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
                  ~2 context switches · illustrative
                </span>
              </div>
              <div className="space-y-0.5">
                {patchflowSteps.map((step, i) => (
                  <motion.div
                    key={step}
                    className="flex items-center gap-3 py-1"
                    initial={{ opacity: 0, x: 26 }}
                    animate={active ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.45, delay: 0.5 + i * 0.06, ease: EASE }}
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0 font-mono"
                      style={{ background: 'rgba(78,207,138,0.12)', color: 'var(--accent)', border: '1px solid rgba(78,207,138,0.3)', fontSize: 9 }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-xs md:text-sm" style={{ color: 'var(--text-primary)' }}>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal active={active} delay={0.7}>
          <p className="text-xs mt-4" style={{ color: 'var(--text-secondary)' }}>
            * Comparison is illustrative. Actual results depend on project complexity.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 03 — HOW IT WORKS
// ══════════════════════════════════════════════════════════════════════════════
export function WorkflowSlide({ active }: { active: boolean }) {
  return (
    <section className="relative h-full w-full flex flex-col justify-center px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full py-20" data-scrollable style={{ maxHeight: '100%', overflowY: 'auto' }}>
        <Reveal active={active} delay={0.05}>
          <div style={EYEBROW} className="mb-4 text-center">02 — HOW IT WORKS</div>
        </Reveal>
        <Reveal active={active} delay={0.12}>
          <h2 className="uppercase text-center" style={{ ...DISPLAY_MD, textShadow: '0 2px 36px rgba(0,0,0,0.55)' }}>
            Five stages. <span style={{ color: 'var(--accent)' }}>One verified fix.</span>
          </h2>
        </Reveal>
        <Reveal active={active} delay={0.2}>
          <p className="text-center text-sm md:text-base mt-4 mb-10 md:mb-14" style={{ color: 'rgba(234,242,234,0.66)' }}>
            Each stage feeds the next — evidence in, verified fix out.
          </p>
        </Reveal>

        {/* Full-width connected pipeline */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-0">
          {howItWorks.map((stage, i) => (
            <PipelineStage key={stage.number} stage={stage} index={i} active={active} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PipelineStage({
  stage,
  index,
  active,
}: {
  stage: (typeof howItWorks)[number];
  index: number;
  active: boolean;
}) {
  const Icon = stage.icon;
  return (
    <>
      <motion.div
        className="flex-1 lg:max-w-[19%] rounded-xl p-4 md:p-5"
        style={{
          background: 'rgba(8,13,10,0.6)',
          border: '1px solid rgba(234,242,234,0.12)',
          backdropFilter: 'blur(10px)',
        }}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.96 }}
        transition={{ duration: 0.55, delay: 0.3 + index * 0.22, ease: EASE }}
      >
        <div className="flex items-center justify-between mb-3 md:mb-5">
          <span className="font-mono font-bold" style={{ color: 'var(--accent)', fontSize: 12, letterSpacing: '0.12em' }}>
            {stage.number}
          </span>
          <Icon size={22} style={{ color: 'var(--accent)' }} strokeWidth={1.6} />
        </div>
        <div className="font-bold uppercase mb-1.5" style={{ fontSize: 'clamp(15px, 1.4vw, 21px)', letterSpacing: '0.06em' }}>
          {stage.title}
        </div>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(234,242,234,0.6)' }}>{stage.desc}</p>
      </motion.div>

      {index < howItWorks.length - 1 && (
        <ConnectorLine index={index} active={active} />
      )}
    </>
  );
}

function ConnectorLine({ index, active }: { index: number; active: boolean }) {
  const drawAt = 0.3 + (index + 1) * 0.22 - 0.11;
  return (
    <>
      {/* desktop: horizontal draw */}
      <div className="hidden lg:flex flex-1 items-center min-w-6 max-w-[3%]">
        <motion.div
          className="h-px w-full origin-left"
          style={{ background: 'linear-gradient(90deg, rgba(78,207,138,0.9), rgba(78,207,138,0.35))' }}
          initial={{ scaleX: 0 }}
          animate={active ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: drawAt, duration: 0.32, ease: EASE }}
        />
      </div>
      {/* mobile: vertical draw */}
      <div className="flex lg:hidden justify-center py-0.5">
        <motion.div
          className="w-px h-6 origin-top"
          style={{ background: 'linear-gradient(180deg, rgba(78,207,138,0.9), rgba(78,207,138,0.35))' }}
          initial={{ scaleY: 0 }}
          animate={active ? { scaleY: 1 } : { scaleY: 0 }}
          transition={{ delay: drawAt, duration: 0.32, ease: EASE }}
        />
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 04 — IBM BOB 2.0
// ══════════════════════════════════════════════════════════════════════════════
export function BobSlide({ active }: { active: boolean }) {
  return (
    <section className="relative h-full w-full flex flex-col justify-center px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full py-20" data-scrollable style={{ maxHeight: '100%', overflowY: 'auto' }}>
        <Reveal active={active} delay={0.05}>
          <div style={EYEBROW} className="mb-4">03 — IBM BOB 2.0</div>
        </Reveal>
        <Reveal active={active} delay={0.12}>
          <h2 className="uppercase max-w-4xl" style={{ ...DISPLAY_MD, textShadow: '0 2px 36px rgba(0,0,0,0.6)' }}>
            Built around an <span style={{ color: 'var(--info)' }}>agentic SDLC workflow.</span>
          </h2>
        </Reveal>
        <Reveal active={active} delay={0.2}>
          <p className="mt-4 mb-8 md:mb-10 max-w-2xl text-sm md:text-base" style={{ color: 'rgba(234,242,234,0.7)', lineHeight: 1.6 }}>
            PatchFlow is developed inside IBM Bob 2.0 — agent mode, parallel subagents, and
            document understanding execute the real debugging workflow, not just illustrate it.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5 md:gap-8 items-center">
          {/* Capability modules */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {bobCapabilities.map((cap, i) => (
              <motion.div
                key={cap}
                className="rounded-lg px-3.5 py-3"
                style={{
                  background: 'rgba(8,12,18,0.62)',
                  border: '1px solid rgba(95,212,227,0.2)',
                  backdropFilter: 'blur(8px)',
                }}
                initial={{ opacity: 0, y: 18 }}
                animate={active ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.32 + i * 0.08, ease: EASE }}
              >
                <div className="w-1.5 h-1.5 rounded-full mb-2" style={{ background: 'var(--info)' }} />
                <span className="text-xs md:text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
                  {cap}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Bob workflow — centerpiece column */}
          <motion.div
            className="rounded-xl p-5 md:p-6"
            style={{
              background: 'rgba(6,10,16,0.68)',
              border: '1px solid rgba(95,212,227,0.26)',
              backdropFilter: 'blur(10px)',
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={active ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.55, delay: 0.28, ease: EASE }}
          >
            <div className="text-xs font-semibold tracking-widest mb-4" style={{ color: 'var(--text-secondary)', letterSpacing: '0.16em' }}>
              BOB WORKFLOW
            </div>
            {bobFlow.map((item, i) => (
              <div key={item.label}>
                <motion.div
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={active ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.12, ease: EASE }}
                >
                  <span
                    className="rounded-full shrink-0"
                    style={{
                      background: item.color,
                      width: item.label === 'Parallel subagents' ? 10 : 7,
                      height: item.label === 'Parallel subagents' ? 10 : 7,
                      boxShadow: item.label === 'Parallel subagents' ? '0 0 12px rgba(95,212,227,0.6)' : 'none',
                    }}
                  />
                  <span
                    className="font-medium font-mono"
                    style={{
                      color: item.color,
                      letterSpacing: '0.06em',
                      fontSize: item.label === 'Parallel subagents' ? 'clamp(13px, 1.2vw, 17px)' : 'clamp(11px, 1vw, 14px)',
                      fontWeight: item.label === 'Parallel subagents' ? 700 : 500,
                    }}
                  >
                    {item.label}
                  </span>
                </motion.div>
                {i < bobFlow.length - 1 && (
                  <motion.div
                    className="ml-1.5 py-0.5"
                    style={{ width: item.label === 'Parallel subagents' || bobFlow[i + 1].label === 'Parallel subagents' ? 10 : 7 }}
                    initial={{ opacity: 0 }}
                    animate={active ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 + i * 0.12 }}
                  >
                    <span className="text-xs" style={{ color: 'rgba(234,242,234,0.32)' }}>↓</span>
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE 05 — FINAL CTA
// ══════════════════════════════════════════════════════════════════════════════
export interface FinalSlideProps {
  onRunDemo: () => void;
  onExplore: () => void;
  active: boolean;
}

export function FinalSlide({ onRunDemo, onExplore, active }: FinalSlideProps) {
  return (
    <section className="relative h-full w-full flex flex-col items-center justify-center text-center px-6 md:px-10 overflow-hidden">
      <div className="max-w-4xl mx-auto py-20">
        <Reveal active={active} delay={0.05}>
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-7"
            style={{
              background: 'rgba(12,14,12,0.6)',
              border: '1px solid rgba(78,207,138,0.35)',
              boxShadow: '0 0 40px rgba(78,207,138,0.18)',
              backdropFilter: 'blur(8px)',
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={active ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          >
            <CheckCircle size={26} style={{ color: 'var(--accent)' }} strokeWidth={1.7} />
          </motion.div>
        </Reveal>

        <Reveal active={active} delay={0.15}>
          <h2 className="uppercase" style={{ ...DISPLAY, textShadow: '0 2px 44px rgba(0,0,0,0.5)' }}>
            From bug report
            <br />
            <span style={{ color: 'var(--accent)' }}>to verified fix.</span>
          </h2>
        </Reveal>

        <Reveal active={active} delay={0.28}>
          <p
            className="mt-6 mb-9 max-w-xl mx-auto text-sm md:text-base"
            style={{ color: 'rgba(234,242,234,0.75)', lineHeight: 1.6 }}
          >
            A debugging workflow that keeps the evidence, investigation, change, and
            verification connected.
          </p>
        </Reveal>

        <Reveal active={active} delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onRunDemo}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02]"
              style={{
                background: 'var(--accent)',
                color: '#0C0D0B',
                boxShadow: '0 8px 32px rgba(78, 207, 138, 0.3)',
              }}
            >
              <Zap size={16} />
              RUN THE DEMO
            </button>
            <button
              onClick={onExplore}
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded font-medium text-sm transition-colors"
              style={{
                border: '1px solid rgba(234,242,234,0.22)',
                color: 'var(--text-primary)',
                background: 'rgba(12,14,12,0.4)',
                backdropFilter: 'blur(6px)',
              }}
            >
              OPEN WORKSPACE
            </button>
          </div>
        </Reveal>

        {/* Closing pipeline echo */}
        <Reveal active={active} delay={0.6}>
          <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
            {workflowSteps.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : {}}
                transition={{ delay: 0.7 + i * 0.07 }}
              >
                <span
                  className="rounded-full"
                  style={{ background: step.color, width: 6, height: 6 }}
                />
                <span className="text-xs font-medium" style={{ color: 'rgba(234,242,234,0.55)', fontSize: 10, letterSpacing: '0.1em' }}>
                  {step.label}
                </span>
                {i < workflowSteps.length - 1 && (
                  <span className="text-xs mx-0.5" style={{ color: 'rgba(234,242,234,0.2)' }}>·</span>
                )}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
