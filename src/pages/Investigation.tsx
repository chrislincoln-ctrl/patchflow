import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle, Clock, FileCode, ArrowDown, GitMerge } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, StatusChip, Card, CardLabel, Note } from '../components/ui/primitives';
import { CANONICAL_INVESTIGATORS, CANONICAL_SCENARIO, toWorkflowState, hasReached } from '../data/canonical';
import { evidenceItems } from '../data/evidence';
import type { CanonicalInvestigator, ConfidenceLevel } from '../data/canonical';

const confTone: Record<ConfidenceLevel, 'accent' | 'warning' | 'neutral'> = {
  HIGH: 'accent',
  MEDIUM: 'warning',
  LOW: 'neutral',
};

function InvestigatorCard({
  inv,
  index,
  active,
  converged,
}: {
  inv: CanonicalInvestigator;
  index: number;
  active: boolean;
  converged: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const Icon = inv.icon;
  const refs = evidenceItems.filter(e => inv.evidenceRefs.includes(e.id));

  return (
    <motion.div
      className="rounded-lg overflow-hidden"
      style={{ background: 'var(--surface)', border: `1px solid ${converged ? 'rgba(78,207,138,0.22)' : 'var(--border)'}` }}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: active ? 1 : 0.55, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center shrink-0"
            style={{
              background: converged ? 'rgba(78,207,138,0.1)' : 'var(--elevated)',
              border: `1px solid ${converged ? 'rgba(78,207,138,0.3)' : 'var(--border)'}`,
            }}
          >
            <Icon size={15} style={{ color: converged ? 'var(--accent)' : 'var(--text-secondary)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                {String(index + 1).padStart(2, '0')} {inv.label}
              </span>
              {converged ? (
                <StatusChip tone="accent">
                  <CheckCircle size={9} /> COMPLETE
                </StatusChip>
              ) : (
                <StatusChip tone="warning" pulse>
                  RUNNING
                </StatusChip>
              )}
              <StatusChip tone={confTone[inv.confidence]}>{inv.confidence} CONFIDENCE</StatusChip>
            </div>

            <div className="flex items-center gap-4 mb-2 flex-wrap text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span className="flex items-center gap-1">
                <FileCode size={11} />
                sample-project scope
              </span>
              <span className="flex items-center gap-1">
                <Clock size={11} /> parallel task
              </span>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{inv.finding}</p>

            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {refs.map(ref => (
                <span
                  key={ref.id}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: 10 }}
                >
                  {ref.name}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded shrink-0 transition-colors hover:bg-white/5"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={expanded ? 'Collapse details' : 'Expand details'}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="pt-4 text-xs font-semibold mb-2 tracking-widest" style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                Investigation detail
              </div>
              <pre
                className="text-xs leading-relaxed whitespace-pre-wrap"
                style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace', background: 'var(--elevated)', padding: 12, borderRadius: 6 }}
              >
                {inv.details}
              </pre>
              <div className="mt-2.5 flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <StatusChip tone={confTone[inv.confidence]}>{inv.confidence} CONFIDENCE</StatusChip>
                <span style={{ fontSize: 10 }}>{inv.confidenceNote} · demo-simulated assessment, not a statistical measure</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Investigation() {
  const { demo } = useApp();
  const state = toWorkflowState(demo);
  const investigating = state === 'INVESTIGATING';
  const synthesized = hasReached(state, 'SYNTHESIZING');
  const idle = state === 'IDLE';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        section="PATCHFLOW / INVESTIGATION"
        title="Parallel Investigation"
        subtitle="One incident. Four focused investigations. One evidence-backed root cause. Each investigator works an isolated scope — no shared context accumulation."
        actions={<StatusChip tone={idle ? 'neutral' : investigating ? 'warning' : 'accent'} pulse={investigating}>{idle ? 'IDLE' : investigating ? 'IN PROGRESS' : 'CONVERGED'}</StatusChip>}
      />

      {/* ── Parallel convergence visual ─────────────────────────────────── */}
      <Card className="p-5 mb-3">
        <CardLabel right={<span className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>each node is a real artifact or task</span>}>
          INVESTIGATION TOPOLOGY
        </CardLabel>

        {/* INCIDENT */}
        <div className="flex justify-center mb-1">
          <motion.div
            className="px-3 py-1.5 rounded text-xs font-mono font-semibold"
            style={{ background: 'rgba(255,92,92,0.08)', border: '1px solid rgba(255,92,92,0.25)', color: 'var(--error)' }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {CANONICAL_SCENARIO && 'INC-2024-0847'} · INCIDENT
          </motion.div>
        </div>
        <FlowArrow active={!idle} />

        {/* EVIDENCE CORPUS */}
        <div className="flex justify-center mb-1">
          <motion.div
            className="px-3 py-1.5 rounded text-xs font-mono"
            style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: idle ? 0.6 : 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            EVIDENCE CORPUS · 5 sources
          </motion.div>
        </div>
        <FlowArrow active={investigating || synthesized} />

        {/* 4 investigators in parallel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-1">
          {CANONICAL_INVESTIGATORS.map((inv, i) => {
            const Icon = inv.icon;
            const resolved = synthesized;
            return (
              <motion.div
                key={inv.id}
                className="rounded p-2.5 flex flex-col items-center gap-1.5 text-center"
                style={{
                  background: resolved ? 'rgba(78,207,138,0.06)' : 'var(--elevated)',
                  border: `1px solid ${resolved ? 'rgba(78,207,138,0.3)' : 'var(--border)'}`,
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: idle ? 0.55 : 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.12 }}
              >
                <Icon size={14} style={{ color: resolved ? 'var(--accent)' : 'var(--text-secondary)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {inv.label.replace(' Investigator', '')}
                </span>
                <span className="text-xs font-mono" style={{ fontSize: 9, color: resolved ? 'var(--accent)' : 'var(--text-secondary)' }}>
                  {resolved ? 'FINDING ✓' : investigating ? 'SCANNING…' : 'STANDBY'}
                </span>
              </motion.div>
            );
          })}
        </div>
        <FlowArrow active={synthesized} />

        {/* CONVERGENCE */}
        <div className="flex justify-center mb-1">
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono"
            style={{
              background: synthesized ? 'rgba(95,212,227,0.08)' : 'var(--elevated)',
              border: `1px solid ${synthesized ? 'rgba(95,212,227,0.3)' : 'var(--border)'}`,
              color: synthesized ? 'var(--info)' : 'var(--text-secondary)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <GitMerge size={12} />
            CONVERGENCE — 4/4 agree
          </motion.div>
        </div>
        <FlowArrow active={synthesized} />

        {/* ROOT CAUSE */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => window.location.assign('/root-cause')}
            className="px-4 py-2 rounded text-xs font-bold font-mono transition-all hover:opacity-90"
            style={{
              background: synthesized ? 'rgba(78,207,138,0.12)' : 'var(--elevated)',
              border: `1px solid ${synthesized ? 'rgba(78,207,138,0.4)' : 'var(--border)'}`,
              color: synthesized ? 'var(--accent)' : 'var(--text-secondary)',
            }}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65 }}
          >
            ROOT CAUSE → checkout.ts ordering
          </motion.button>
        </div>
      </Card>

      <Note tone="neutral">
        <span style={{ color: 'var(--warning)' }}>ⓘ</span>&nbsp;
        Demo Mode — deterministic sample output illustrating the parallel-investigation pattern.
        Confidence levels are qualitative demo assessments, not statistical measurements.
      </Note>

      {/* ── Detailed findings ───────────────────────────────────────────── */}
      <div className="mt-3 space-y-3">
        {CANONICAL_INVESTIGATORS.map((inv, i) => (
          <InvestigatorCard key={inv.id} inv={inv} index={i} active={!idle} converged={synthesized} />
        ))}
      </div>

      <div className="mt-4">
        <Card className="p-4">
          <CardLabel>WHY PARALLEL INVESTIGATORS?</CardLabel>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Each agent works independently against a focused scope, avoiding context bleed between log analysis,
            code tracing, test review, and documentation parsing. Independent convergence on the same three-line
            region is what makes the root cause trustworthy.
          </p>
        </Card>
      </div>
    </div>
  );
}

function FlowArrow({ active }: { active: boolean }) {
  return (
    <div className="flex justify-center py-0.5">
      <motion.div
        initial={{ opacity: 0.25 }}
        animate={{ opacity: active ? 1 : 0.25 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowDown size={12} style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)' }} />
      </motion.div>
    </div>
  );
}
