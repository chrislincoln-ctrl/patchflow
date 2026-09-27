import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitBranch, FileCode, ArrowRight, Shield } from 'lucide-react';
import { rootCause } from '../data/rootCause';
import { PageHeader, StatusChip, Card, CardLabel } from '../components/ui/primitives';
import { CANONICAL_SCENARIO } from '../data/canonical';

const chainColors = {
  incident: 'var(--error)',
  symptom: 'var(--warning)',
  codepath: 'var(--info)',
  rule: 'var(--text-secondary)',
  cause: 'var(--accent)',
};

const chainLabels = {
  incident: 'Incident',
  symptom: 'Symptom',
  codepath: 'Code path',
  rule: 'Business rule',
  cause: 'Root cause',
};

export default function RootCausePage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        section="PATCHFLOW / ROOT CAUSE"
        title="Root Cause Analysis"
        subtitle="Synthesis of four independent investigator findings, cross-referenced against evidence, code, and specification."
        actions={<StatusChip tone="accent">HIGH CONFIDENCE</StatusChip>}
      />

      {/* Verdict banner */}
      <motion.div
        className="rounded-lg p-4 mb-3"
        style={{ background: 'var(--surface)', border: '1px solid rgba(78, 207, 138, 0.25)', borderTop: '2px solid var(--accent)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center shrink-0"
            style={{ background: 'rgba(78, 207, 138, 0.1)', border: '1px solid rgba(78, 207, 138, 0.2)' }}
          >
            <GitBranch size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>Root cause identified</span>
              <StatusChip tone="accent">HIGH CONFIDENCE</StatusChip>
              <span className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
                demo-simulated assessment · converged 4/4 investigators
              </span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{rootCause.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* Executable proof strip */}
      <Card className="p-4 mb-3">
        <CardLabel right={<StatusChip tone="neutral">from npm run reproduce</StatusChip>}>EXECUTABLE PROOF</CardLabel>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            ['Subtotal', `₹${CANONICAL_SCENARIO.subtotal.toFixed(2)}`, 'var(--text-primary)'],
            ['Buggy total (tax first)', `₹${CANONICAL_SCENARIO.buggyTotal.toFixed(2)}`, 'var(--error)'],
            ['Fixed total (discount first)', `₹${CANONICAL_SCENARIO.fixedTotal.toFixed(2)}`, 'var(--accent)'],
            ['Overcharge', CANONICAL_SCENARIO.discrepancyLabel, 'var(--error)'],
          ].map(([k, v, c]) => (
            <div key={k}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 10, letterSpacing: '0.06em' }}>{k}</div>
              <div className="font-mono text-sm font-bold" style={{ color: c }}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Explanation */}
      <Card className="p-4 mb-3">
        <CardLabel>EXPLANATION</CardLabel>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{rootCause.explanation}</p>
      </Card>

      {/* Evidence chain */}
      <Card className="p-4 mb-3">
        <CardLabel>EVIDENCE CHAIN</CardLabel>
        <div>
          {rootCause.evidenceChain.map((step, i) => {
            const color = chainColors[step.type];
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full shrink-0 mt-1" style={{ background: color }} />
                  {i < rootCause.evidenceChain.length - 1 && (
                    <div className="w-px flex-1 my-1" style={{ background: 'var(--border)', minHeight: 24 }} />
                  )}
                </div>
                <div className="pb-4 flex-1">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="text-xs font-semibold" style={{ color, letterSpacing: '0.08em', fontFamily: 'monospace' }}>
                      {chainLabels[step.type]}
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{step.label}</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        {/* Affected files */}
        <Card className="p-4">
          <CardLabel right={<span className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>real paths in sample-project/</span>}>
            AFFECTED FILES
          </CardLabel>
          <div className="space-y-2">
            {rootCause.affectedFiles.map(file => (
              <div key={file.path} className="rounded p-2.5" style={{ background: 'var(--elevated)' }}>
                <div className="flex items-center gap-2 mb-0.5">
                  <FileCode size={12} style={{ color: 'var(--info)' }} />
                  <span className="text-xs font-mono" style={{ color: 'var(--text-primary)' }}>{file.path}</span>
                </div>
                <div className="text-xs ml-5" style={{ color: 'var(--text-secondary)' }}>{file.role}</div>
                <div className="text-xs ml-5 mt-0.5" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{file.linesAffected}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Why PatchFlow believes this */}
        <Card className="p-4">
          <CardLabel right={<Shield size={12} style={{ color: 'var(--text-secondary)' }} />}>WHY PATCHFLOW BELIEVES THIS</CardLabel>
          <div className="space-y-2">
            {rootCause.whyBelieve.map((reason, i) => (
              <div key={i} className="flex gap-2 text-xs">
                <div
                  className="w-4 h-4 rounded text-xs flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'var(--elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: 9 }}
                >
                  {i + 1}
                </div>
                <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{reason}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <button
        onClick={() => navigate('/patch')}
        className="flex items-center gap-2 px-4 py-2.5 rounded font-medium text-sm transition-all hover:opacity-90"
        style={{ background: 'var(--accent)', color: '#0C0D0B' }}
      >
        Review Patch
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
