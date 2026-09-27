import { useRef } from 'react';
import { FileText, Download, CheckCircle, Activity } from 'lucide-react';
import { PageHeader, StatusChip } from '../components/ui/primitives';
import {
  CANONICAL_INCIDENT,
  CANONICAL_SCENARIO,
  CANONICAL_EVIDENCE,
  CANONICAL_INVESTIGATORS,
  CANONICAL_VALIDATION,
  CANONICAL_IMPACT,
  PATCH_TOTALS,
  TEST_SUMMARY,
  VALIDATION_SUMMARY,
  IMPACT_DISCLAIMER,
} from '../data/canonical';
import { rootCause } from '../data/rootCause';

export default function ReportPage() {
  const reportRef = useRef<HTMLDivElement>(null);
  const generatedAt = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

  const handleDownload = () => {
    const content = reportRef.current?.innerHTML ?? '';
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>PatchFlow Debugging Report — ${CANONICAL_INCIDENT.id}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1f2328; }
    h1 { font-size: 24px; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px; }
    h2 { font-size: 14px; color: #57606a; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 24px; }
    p, li { font-size: 14px; line-height: 1.6; }
    pre { background: #f7f8fa; padding: 12px; border-radius: 4px; font-size: 12px; overflow-x: auto; }
  </style>
</head>
<body>
${content}
<footer style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#57606a;text-align:center;">
  PatchFlow Debugging Report · Generated ${generatedAt} · Built for IBM Bob 2.0 hackathon
</footer>
</body>
</html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patchflow-report-${CANONICAL_INCIDENT.id}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        section="PATCHFLOW / REPORT"
        title="Debugging Report"
        subtitle={`${CANONICAL_INCIDENT.id} · ${CANONICAL_INCIDENT.repository} · generated ${generatedAt}`}
        actions={
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 rounded font-medium text-sm transition-all hover:opacity-90"
            style={{ background: 'var(--accent)', color: '#0C0D0B' }}
          >
            <Download size={14} />
            Download Report
          </button>
        }
      />

      <div ref={reportRef} className="rounded-lg p-6" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
            <Activity size={16} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div className="font-bold text-lg" style={{ letterSpacing: '-0.01em' }}>PATCHFLOW DEBUGGING REPORT</div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Generated {generatedAt} · IBM Bob 2.0 Agentic Workflow
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded" style={{ background: 'rgba(78, 207, 138, 0.1)', border: '1px solid rgba(78, 207, 138, 0.3)' }}>
            <CheckCircle size={13} style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{VALIDATION_SUMMARY.verdict}</span>
          </div>
        </div>

        {/* ── Incident summary ── */}
        <Section title="INCIDENT SUMMARY">
          <div className="grid md:grid-cols-2 gap-3 text-xs">
            {[
              ['Incident ID', CANONICAL_INCIDENT.id],
              ['Title', CANONICAL_INCIDENT.title],
              ['Severity', CANONICAL_INCIDENT.severity],
              ['Repository', CANONICAL_INCIDENT.repository],
              ['Affected Endpoint', CANONICAL_INCIDENT.endpoint],
              ['Impacted Orders', `${CANONICAL_INCIDENT.affectedOrders.toLocaleString()} orders (${CANONICAL_INCIDENT.overchargeRange})`],
              ['Incident Date', CANONICAL_INCIDENT.incidentDateLabel],
              ['Status', `${VALIDATION_SUMMARY.verdict} · ${VALIDATION_SUMMARY.status}`],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span style={{ color: 'var(--text-secondary)', minWidth: 110 }}>{k}:</span>
                <span style={{ color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
            The incident occurred {CANONICAL_INCIDENT.incidentDateLabel}; this report replays the investigation deterministically
            and was generated {generatedAt}. First failure: {CANONICAL_INCIDENT.firstFailure}.
          </p>
        </Section>

        {/* ── Evidence ── */}
        <Section title="EVIDENCE REVIEWED">
          <div className="space-y-1 text-xs">
            {CANONICAL_EVIDENCE.files.map(ev => (
              <div key={ev.id} className="flex items-center gap-2">
                <FileText size={11} style={{ color: 'var(--info)' }} />
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{ev.name}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{ev.disk}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Investigation ── */}
        <Section title="PARALLEL INVESTIGATION FINDINGS">
          {CANONICAL_INVESTIGATORS.map(inv => (
            <div key={inv.id} className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{inv.label}</span>
                <StatusChip tone="accent">{inv.confidence} CONFIDENCE</StatusChip>
                <span className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>demo-simulated</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{inv.finding}</p>
            </div>
          ))}
        </Section>

        {/* ── Root cause ── */}
        <Section title="ROOT CAUSE">
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>
            {rootCause.summary}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {rootCause.explanation}
          </p>
        </Section>

        {/* ── Reproduction ── */}
        <Section title="REPRODUCTION (EXECUTABLE)">
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
            {[
              ['Cart', CANONICAL_SCENARIO.lineItems.map(i => `${i.name} @ ₹${i.unitPrice} (${i.taxCode})`).join(' + ')],
              ['Coupon', `${CANONICAL_SCENARIO.coupon.code} (${CANONICAL_SCENARIO.coupon.value}% off)`],
              ['Subtotal', `₹${CANONICAL_SCENARIO.subtotal.toFixed(2)}`],
              ['Discount', `₹${CANONICAL_SCENARIO.discount.toFixed(2)}`],
              ['Buggy total (tax first)', `₹${CANONICAL_SCENARIO.buggyTotal.toFixed(2)}`],
              ['Fixed total (discount first)', `₹${CANONICAL_SCENARIO.fixedTotal.toFixed(2)}`],
              ['Overcharge per order', CANONICAL_SCENARIO.discrepancyLabel],
              ['Command', CANONICAL_INCIDENT.reproScript],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
            Note: {CANONICAL_SCENARIO.numericNote}
          </p>
        </Section>

        {/* ── Patch ── */}
        <Section title="PATCH SUMMARY">
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
            Reorder calculateFinalTotal(): compute the discounted subtotal first, then pass it to
            aggregateTaxByJurisdiction(). Only execution order changes — no logic rewrite.
          </p>
          <div className="flex gap-4 text-xs mb-2">
            <span>Files: <strong style={{ color: 'var(--text-primary)' }}>{PATCH_TOTALS.files}</strong></span>
            <span>+{PATCH_TOTALS.added} lines</span>
            <span>−{PATCH_TOTALS.removed} lines</span>
            <span>Unrelated files: <strong style={{ color: 'var(--accent)' }}>0</strong></span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            checkout.ts carries the fix (reordered discount-before-tax per spec {CANONICAL_INCIDENT.specSection});
            tax.ts required only an optional-parameter clarification. Both files change for that reason — the
            executable behaviour change is confined to checkout.ts.
          </p>
        </Section>

        {/* ── Regression coverage ── */}
        <Section title="REGRESSION COVERAGE">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            File: <span style={{ color: 'var(--text-primary)' }}>sample-project/tests/checkout.coupon-tax.spec.ts</span> ·{' '}
            {TEST_SUMMARY.total} tests total ({TEST_SUMMARY.regression} added with the patch, {TEST_SUMMARY.preExisting} pre-existing) ·{' '}
            all passing via <span className="font-mono">{TEST_SUMMARY.command}</span>. The reproduction test deliberately
            asserts the buggy total to lock the failure mode into the suite.
          </p>
        </Section>

        {/* ── Validation ── */}
        <Section title="VALIDATION RESULTS">
          <div className="space-y-1">
            {CANONICAL_VALIDATION.map(check => (
              <div key={check.id} className="flex items-center gap-2 text-xs">
                <CheckCircle size={11} style={{ color: 'var(--accent)' }} />
                <span style={{ color: 'var(--text-primary)' }}>{check.label}</span>
                <span style={{ color: 'var(--accent)', marginLeft: 'auto', textAlign: 'right' }}>{check.detail}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs font-bold" style={{ color: 'var(--accent)' }}>
            {TEST_SUMMARY.total}/{TEST_SUMMARY.total} tests pass · Build clean · {VALIDATION_SUMMARY.verdict}
          </div>
        </Section>

        {/* ── Impact ── */}
        <Section title="IMPACT MEASUREMENT">
          <p className="text-xs mb-2" style={{ color: 'var(--warning)' }}>⚠ {IMPACT_DISCLAIMER}</p>
          {CANONICAL_IMPACT.map(m => (
            <div key={m.id} className="flex items-center gap-2 text-xs mb-1 flex-wrap">
              <span className="flex-1" style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 9, letterSpacing: '0.04em' }}>
                {m.dataType === 'MEASURED IN THIS DEMONSTRATION' ? '[MEASURED]' : '[ILLUSTRATIVE]'}
              </span>
              <span style={{ color: 'var(--error)' }}>{m.before} {m.unit}</span>
              <span style={{ color: 'var(--text-secondary)' }}>→</span>
              <span style={{ color: 'var(--accent)' }}>{m.after} {m.unit}</span>
            </div>
          ))}
        </Section>

        {/* ── Files changed ── */}
        <Section title="FILES CHANGED">
          {['src/services/checkout.ts', 'src/services/tax.ts'].map((p, i) => (
            <div key={p} className="text-xs font-mono mb-1" style={{ color: 'var(--text-secondary)' }}>
              {p}{' '}
              <span style={{ color: 'var(--accent)' }}>+{i === 0 ? 5 : 1}</span>{' '}
              <span style={{ color: 'var(--error)' }}>−{i === 0 ? 3 : 0}</span>
            </div>
          ))}
          <div className="text-xs font-mono" style={{ color: 'var(--info)' }}>
            sample-project/tests/checkout.coupon-tax.spec.ts <span style={{ color: 'var(--accent)' }}>REGRESSION SUITE</span>
          </div>
        </Section>

        {/* ── Follow-up ── */}
        <Section title="RECOMMENDED FOLLOW-UP">
          <ul className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <li>• Audit all pricing pipeline calls to confirm no other callers pass undiscounted subtotals to tax functions.</li>
            <li>• Add integration test for each supported coupon type × tax jurisdiction combination.</li>
            <li>• Consider a dedicated PricingPipeline class to enforce computation order by construction.</li>
            <li>• Review CHANGELOG for other recent pipeline refactors.</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div
        className="text-xs font-semibold tracking-widest mb-3 pb-2"
        style={{ color: 'var(--text-secondary)', letterSpacing: '0.12em', borderBottom: '1px solid var(--border)' }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
