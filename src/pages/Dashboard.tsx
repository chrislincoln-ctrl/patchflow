import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Search, GitBranch, Wrench, CheckSquare, Play, RotateCcw,
  ChevronRight, FileText, BarChart2, Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader, StatusChip, Card, CardLabel, MetricTile, Note } from '../components/ui/primitives';
import type { ChipTone } from '../components/ui/primitives';
import {
  CANONICAL_INCIDENT,
  CANONICAL_SCENARIO,
  CANONICAL_TESTS,
  CANONICAL_EVIDENCE,
  TEST_SUMMARY,
  PATCH_TOTALS,
  WORKFLOW_STAGES,
  toWorkflowState,
  workflowProgress,
  stageStatusFor,
} from '../data/canonical';
import type { WorkflowState } from '../data/canonical';

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const duration = 900;
    const tick = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      setDisplay(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{display}</span>;
}

const stageIcons: Record<string, typeof Search> = {
  investigate: Search,
  rootcause: GitBranch,
  patch: Wrench,
  validation: CheckSquare,
  impact: BarChart2,
  report: FileText,
};

const stateTone: Record<WorkflowState, ChipTone> = {
  IDLE: 'neutral',
  INGESTING: 'info',
  INVESTIGATING: 'warning',
  SYNTHESIZING: 'warning',
  REPRODUCING: 'warning',
  PATCHING: 'info',
  TESTING: 'info',
  VALIDATING: 'info',
  REPORTING: 'info',
  VERIFIED: 'accent',
  RESOLVED: 'accent',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { demo, startDemo, resetDemo } = useApp();

  const state = toWorkflowState(demo);
  const progress = workflowProgress(state);
  const running = state !== 'IDLE' && state !== 'VERIFIED' && state !== 'RESOLVED';
  const done = state === 'VERIFIED' || state === 'RESOLVED';

  const InvestigatorsIcon = Layers;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader
        section="PATCHFLOW / OVERVIEW"
        title="Incident Command Center"
        subtitle="One incident. Four parallel investigators. One evidence-backed root cause — traced, patched, and verified."
        actions={
          running || demo.active ? (
            <button
              onClick={resetDemo}
              className="flex items-center gap-2 px-3 py-2 rounded text-xs font-medium transition-colors hover:bg-white/5"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              <RotateCcw size={13} />
              Reset Demo
            </button>
          ) : (
            <button
              onClick={startDemo}
              className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all hover:opacity-90"
              style={{ background: 'var(--accent)', color: '#0C0D0B' }}
            >
              <Play size={13} />
              Run Demo
            </button>
          )
        }
      />

      {/* ── Row 1: incident + workflow state ─────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-3 mb-3">
        <Card accent="error" className="lg:col-span-2 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255, 92, 92, 0.08)', border: '1px solid rgba(255, 92, 92, 0.2)' }}
              >
                <AlertTriangle size={16} style={{ color: 'var(--error)' }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
                    {CANONICAL_INCIDENT.id}
                  </span>
                  <StatusChip tone="error">{CANONICAL_INCIDENT.severity}</StatusChip>
                  <StatusChip tone={stateTone[state]} pulse={running}>
                    {running ? state : done ? 'RESOLVED' : 'IDLE'}
                  </StatusChip>
                </div>
                <div className="text-sm font-semibold truncate">{CANONICAL_INCIDENT.title}</div>
              </div>
            </div>
            <div className="flex items-center gap-5 text-xs shrink-0">
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>Repository</div>
                <div style={{ color: 'var(--text-primary)' }}>{CANONICAL_INCIDENT.repository}</div>
              </div>
              <div>
                <div style={{ fontSize: 10, letterSpacing: '0.08em', color: 'var(--text-secondary)' }}>Incident date</div>
                <div style={{ color: 'var(--text-primary)' }}>{CANONICAL_INCIDENT.incidentDateLabel}</div>
              </div>
              <button
                onClick={() => navigate('/investigate')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-all hover:opacity-90"
                style={{ background: 'var(--accent)', color: '#0C0D0B', fontSize: 11 }}
              >
                Investigate
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <CardLabel>WORKFLOW STATE</CardLabel>
          <div className="flex items-baseline gap-2 mb-2">
            <span
              className="text-xl font-bold font-mono"
              style={{ color: done ? 'var(--accent)' : running ? 'var(--warning)' : 'var(--text-primary)' }}
            >
              {running ? state : done ? 'RESOLVED' : 'IDLE'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            <span>{done ? 'All gates passed' : running ? 'Demo replay in progress' : 'Replay the demo to trace the workflow'}</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--elevated)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: done ? 'var(--accent)' : 'var(--warning)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </Card>
      </div>

      {/* ── Row 2: live demo log (only while running) ────────────────────── */}
      {demo.active && !done && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3">
          <Card accent="top-accent" className="p-4">
            <CardLabel right={<span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>{demo.progress}%</span>}>
              LIVE REPLAY
            </CardLabel>
            <div className="font-mono text-xs space-y-0.5 max-h-28 overflow-y-auto" style={{ color: 'var(--text-secondary)' }}>
              {demo.logs.slice(-7).map((log, i) => (
                <div
                  key={i}
                  style={{
                    color: log.startsWith('✓') ? 'var(--accent)' : log.startsWith('✗') ? 'var(--error)' : 'var(--text-secondary)',
                    fontSize: 10,
                  }}
                >
                  {log}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* ── Row 3: command-center metrics ────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-3">
        <MetricTile value={<AnimatedNumber value={CANONICAL_EVIDENCE.files.length} />} label="EVIDENCE FILES" color="var(--info)" />
        <MetricTile value={4} label="INVESTIGATORS (PARALLEL)" color="var(--text-primary)" />
        <MetricTile value={`${PATCH_TOTALS.added}/-${PATCH_TOTALS.removed}`} label="PATCH ± LINES" color="var(--accent)" hint={`${PATCH_TOTALS.files} files`} />
        <MetricTile value={<AnimatedNumber value={CANONICAL_INCIDENT.affectedOrders} />} label="AFFECTED ORDERS" color="var(--warning)" />
        <MetricTile value={TEST_SUMMARY.total} label="TESTS AFTER PATCH" color="var(--text-primary)" hint={`was ${TEST_SUMMARY.total - TEST_SUMMARY.regression}`} />
        <MetricTile
          value={done ? '✓' : '—'}
          label="VERDICT"
          color={done ? 'var(--accent)' : 'var(--text-secondary)'}
          hint={done ? 'VERIFIED FIX' : 'pending demo run'}
        />
      </div>

      {/* ── Row 4: scenario + stages ─────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-3 mb-3">
        <Card className="p-4">
          <CardLabel right={<StatusChip tone="neutral">canonical scenario</StatusChip>}>REPRODUCTION SNAPSHOT</CardLabel>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            {[
              ['Cart', CANONICAL_SCENARIO.lineItems.map(i => `${i.name} (${i.taxCode})`).join(' + ')],
              ['Coupon', `${CANONICAL_SCENARIO.coupon.code} — ${CANONICAL_SCENARIO.coupon.value}% off`],
              ['Subtotal', `₹${CANONICAL_SCENARIO.subtotal.toFixed(2)}`],
              ['Discount', `−₹${CANONICAL_SCENARIO.discount.toFixed(2)}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
            <div className="flex justify-between gap-3">
              <span style={{ color: 'var(--text-secondary)' }}>Buggy total</span>
              <span className="font-mono" style={{ color: 'var(--error)' }}>₹{CANONICAL_SCENARIO.buggyTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span style={{ color: 'var(--text-secondary)' }}>Fixed total</span>
              <span className="font-mono" style={{ color: 'var(--accent)' }}>₹{CANONICAL_SCENARIO.fixedTotal.toFixed(2)}</span>
            </div>
            <div className="col-span-2 flex justify-between gap-3 pt-1.5" style={{ borderTop: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Overcharge per order</span>
              <span className="font-mono font-bold" style={{ color: 'var(--error)' }}>
                {CANONICAL_SCENARIO.discrepancyLabel}
              </span>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)', fontSize: 10, lineHeight: 1.5 }}>
            Values are the executable outputs of <span className="font-mono">{CANONICAL_INCIDENT.reproScript}</span> in
            sample-project/.
          </p>
        </Card>

        <Card className="p-4">
          <CardLabel
            right={
              <button onClick={() => navigate('/investigate')} className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                View all <ChevronRight size={11} />
              </button>
            }
          >
            WORKFLOW STAGES
          </CardLabel>
          <div className="space-y-1">
            {WORKFLOW_STAGES.map((stage) => {
              const status = running || done ? stageStatusFor(state, stage) : 'pending';
              const Icon = stageIcons[stage.key];
              const color = status === 'complete' ? 'var(--accent)' : status === 'active' ? 'var(--warning)' : 'var(--text-secondary)';
              const indicator = status === 'complete' ? '✓' : status === 'active' ? '▸' : '—';
              return (
                <button
                  key={stage.key}
                  onClick={() => navigate(stage.path)}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-left transition-colors hover:bg-white/5"
                >
                  <Icon size={13} style={{ color }} />
                  <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{stage.label}</span>
                  <span className="text-xs" style={{ color, fontSize: 10, fontFamily: 'monospace' }}>{indicator}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Row 5: investigators + tests/evidence ───────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-3 mb-3">
        <Card className="p-4 lg:col-span-1">
          <CardLabel right={<InvestigatorsIcon size={12} style={{ color: 'var(--text-secondary)' }} />}>INVESTIGATORS</CardLabel>
          <div className="space-y-2">
            {[
              { label: 'Code', done: true },
              { label: 'Log', done: true },
              { label: 'Test', done: true },
              { label: 'Documentation', done: true },
            ].map((inv) => (
              <div key={inv.label} className="flex items-center gap-2.5">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: running ? 'var(--warning)' : 'var(--accent)' }}
                />
                <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>{inv.label}</span>
                <span className="text-xs font-mono" style={{ color: running ? 'var(--warning)' : 'var(--accent)', fontSize: 10 }}>
                  {running ? 'RUNNING' : 'COMPLETE'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <CardLabel
            right={
              <button onClick={() => navigate('/tests')} className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                Test Suite <ChevronRight size={11} />
              </button>
            }
          >
            REGRESSION & EVIDENCE
          </CardLabel>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              {CANONICAL_TESTS.slice(0, 4).map((t) => (
                <div key={t.name} className="flex items-start gap-2">
                  <CheckSquare size={11} className="mt-0.5 shrink-0" style={{ color: 'var(--accent)' }} />
                  <div className="min-w-0">
                    <div className="text-xs truncate font-mono" style={{ color: 'var(--text-primary)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 9 }}>{t.interpretation}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {CANONICAL_EVIDENCE.files.map((ev) => (
                <div key={ev.id} className="flex items-center gap-2">
                  <FileText size={11} className="shrink-0" style={{ color: 'var(--info)' }} />
                  <span className="text-xs font-mono truncate" style={{ color: 'var(--text-primary)' }}>{ev.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Note tone="neutral">
        <span style={{ color: 'var(--warning)' }}>ⓘ</span>&nbsp;
        Demo Mode replays deterministic artifacts. All totals shown are the executable outputs of{' '}
        <span className="font-mono">npm run reproduce</span> in sample-project/.
      </Note>
    </div>
  );
}
