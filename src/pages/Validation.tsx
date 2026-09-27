import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, ArrowRight, FileText, Wrench, Bug, FlaskConical, Package, FileCheck, Zap, ShieldCheck, CheckSquare } from 'lucide-react';
import { PageHeader, StatusChip, Note } from '../components/ui/primitives';
import { useApp } from '../context/AppContext';
import { CANONICAL_VALIDATION, VALIDATION_SUMMARY, toWorkflowState, hasReached } from '../data/canonical';

const icons: Record<string, typeof Bug> = {
  Bug, FlaskConical, CheckSquare, Package, FileCheck, Zap, Shield: ShieldCheck,
};

export default function ValidationPage() {
  const navigate = useNavigate();
  const { demo } = useApp();
  const state = toWorkflowState(demo);
  const reachedValidation = hasReached(state, 'VALIDATING');
  const verified = hasReached(state, 'VERIFIED');
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  // Reveal checks: instantly when demo has reached validation, otherwise staggered.
  useEffect(() => {
    if (reachedValidation) {
      setRevealed(new Set(CANONICAL_VALIDATION.map(c => c.id)));
      return;
    }
    const timers = CANONICAL_VALIDATION.map((check, i) =>
      setTimeout(() => setRevealed(prev => new Set([...prev, check.id])), 200 + i * 300),
    );
    return () => timers.forEach(clearTimeout);
  }, [reachedValidation]);

  const allRevealed = revealed.size === CANONICAL_VALIDATION.length;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <PageHeader
        section="PATCHFLOW / VALIDATION"
        title="Validation Center"
        subtitle="Release-gate checks. Every condition must pass before the fix is marked verified. Results mirror the executable sample project."
        actions={
          <StatusChip tone={verified ? 'accent' : allRevealed ? 'info' : 'warning'} pulse={!verified && allRevealed}>
            {verified ? VALIDATION_SUMMARY.verdict : allRevealed ? 'GATES PASSED' : 'EVALUATING'}
          </StatusChip>
        }
      />

      <div className="space-y-2 mb-4">
        {CANONICAL_VALIDATION.map((check, i) => {
          const isRevealed = revealed.has(check.id);
          const Icon = icons[check.icon] ?? CheckCircle;
          return (
            <motion.div
              key={check.id}
              className="rounded-lg p-3.5"
              style={{
                background: 'var(--surface)',
                border: `1px solid ${isRevealed ? 'rgba(78, 207, 138, 0.25)' : 'var(--border)'}`,
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: isRevealed ? 1 : 0.4, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: isRevealed ? 'rgba(78, 207, 138, 0.1)' : 'var(--elevated)' }}
                >
                  {isRevealed ? (
                    <CheckCircle size={12} style={{ color: 'var(--accent)' }} />
                  ) : (
                    <Clock size={12} style={{ color: 'var(--text-secondary)' }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{check.label}</span>
                    {isRevealed && <StatusChip tone="accent">PASS</StatusChip>}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{check.description}</div>
                </div>
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  <Icon size={12} style={{ color: isRevealed ? 'var(--text-secondary)' : 'var(--border)' }} />
                  {isRevealed && (
                    <span className="text-xs font-mono text-right" style={{ color: 'var(--accent)', fontSize: 10, maxWidth: 260 }}>
                      {check.detail}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Final verdict — only when the workflow has actually completed */}
      {allRevealed && (
        <motion.div
          className="rounded-lg p-5 mb-4 text-center"
          style={{ background: 'var(--surface)', border: '1px solid rgba(78, 207, 138, 0.3)', borderTop: '2px solid var(--accent)' }}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-3xl font-bold mb-1" style={{ color: 'var(--accent)', letterSpacing: '-0.02em' }}>
            {VALIDATION_SUMMARY.verdict}
          </div>
          <div className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
            {VALIDATION_SUMMARY.summary}
          </div>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <StatusChip tone="accent">{VALIDATION_SUMMARY.verdict}</StatusChip>
            <StatusChip tone="accent">{VALIDATION_SUMMARY.status}</StatusChip>
            <StatusChip tone="neutral">{VALIDATION_SUMMARY.demoState}</StatusChip>
          </div>
        </motion.div>
      )}

      {!allRevealed && (
        <Note tone="warning">
          <Clock size={13} className="shrink-0 mt-0.5" />
          <span>Gates are resolving — the verdict appears only when every check has passed.</span>
        </Note>
      )}

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => navigate('/patch')}
          className="flex items-center gap-2 px-4 py-2.5 rounded font-medium text-sm transition-colors hover:bg-white/5"
          style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <Wrench size={14} />
          View Diff
        </button>
        <button
          onClick={() => navigate('/impact')}
          className="flex items-center gap-2 px-4 py-2.5 rounded font-medium text-sm transition-all hover:opacity-90"
          style={{ background: 'var(--accent)', color: '#0C0D0B' }}
        >
          View Impact
          <ArrowRight size={14} />
        </button>
        <button
          onClick={() => navigate('/report')}
          className="flex items-center gap-2 px-4 py-2.5 rounded font-medium text-sm transition-colors hover:bg-white/5"
          style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        >
          <FileText size={14} />
          Generate Report
        </button>
      </div>
    </div>
  );
}
