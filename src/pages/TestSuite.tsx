import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, CheckCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { PageHeader, StatusChip, Card, CardLabel, Note, MetricTile } from '../components/ui/primitives';
import { CANONICAL_TESTS, TEST_SUMMARY, CANONICAL_INCIDENT } from '../data/canonical';
import type { CanonicalTest, TestKind } from '../data/canonical';

const kindMeta: Record<TestKind, { chip: string; tone: 'warning' | 'accent' | 'neutral'; label: string }> = {
  reproduction: { chip: 'REPRODUCTION', tone: 'warning', label: 'Documents the bug — passes only because the buggy code is deterministic' },
  fixed: { chip: 'FIXED', tone: 'accent', label: 'Verifies corrected behaviour' },
  existing: { chip: 'EXISTING', tone: 'neutral', label: 'Pre-existing coverage preserved by the patch' },
};

function TestRow({ test, index }: { test: CanonicalTest; index: number }) {
  const meta = kindMeta[test.kind];
  return (
    <motion.div
      className="flex items-start gap-3 px-4 py-3"
      style={{ borderBottom: '1px solid var(--border)' }}
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <CheckCircle size={13} style={{ color: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono mb-1" style={{ color: 'var(--text-primary)' }}>
          {test.name}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <StatusChip tone={meta.tone}>{meta.chip}</StatusChip>
          <span className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
            {test.interpretation}
          </span>
        </div>
        <div className="text-xs mt-1" style={{ color: 'var(--accent)', fontSize: 10, fontFamily: 'monospace' }}>
          {test.expected}
        </div>
      </div>
    </motion.div>
  );
}

function SuiteCard({ group, startIndex }: { group: [string, CanonicalTest[]]; startIndex: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const [suiteName, tests] = group;

  return (
    <Card className="overflow-hidden mb-3">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        style={{ borderBottom: collapsed ? 'none' : '1px solid var(--border)' }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FlaskConical size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {suiteName}
          </div>
          <div className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
            sample-project/tests/checkout.coupon-tax.spec.ts
          </div>
        </div>
        <StatusChip tone="accent">{tests.length}/{tests.length} PASS</StatusChip>
        {collapsed ? <ChevronDown size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} /> : <ChevronUp size={13} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />}
      </button>
      {!collapsed && <div>{tests.map((t, i) => <TestRow key={t.name} test={t} index={startIndex + i} />)}</div>}
    </Card>
  );
}

export default function TestSuite() {
  const regression = CANONICAL_TESTS.filter(t => t.kind !== 'existing');
  const existing = CANONICAL_TESTS.filter(t => t.kind === 'existing');

  const groups: [string, CanonicalTest[]][] = [
    [`checkout — coupon + multi-rate tax (regression: ${CANONICAL_INCIDENT.id})`, regression],
    ['checkout — coupon only (flat tax rate) [existing]', existing],
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        section="PATCHFLOW / TEST SUITE"
        title="Regression Test Suite"
        subtitle={
          <>
            Regression coverage for the coupon + heterogeneous-tax interaction. File:{' '}
            <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>
              sample-project/tests/checkout.coupon-tax.spec.ts
            </span>
          </>
        }
        actions={<StatusChip tone="accent">{TEST_SUMMARY.total}/{TEST_SUMMARY.total} PASSING</StatusChip>}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <MetricTile value={TEST_SUMMARY.total} label="TOTAL TESTS" color="var(--accent)" />
        <MetricTile value={regression.filter(t => t.kind === 'fixed').length + 1} label="REGRESSION TESTS" hint="added with patch" />
        <MetricTile value={existing.length} label="EXISTING TESTS" hint="unchanged by patch" color="var(--text-primary)" />
        <MetricTile value={0} label="FAILING" color="var(--text-secondary)" />
      </div>

      <Note tone="info">
        <Info size={13} className="shrink-0 mt-0.5" />
        <span>
          These tests execute against <span className="font-mono">sample-project/</span> with {TEST_SUMMARY.runner}. Run{' '}
          <span className="font-mono">{TEST_SUMMARY.command}</span> to execute them. Every displayed value matches the
          canonical scenario and the real test file.
        </span>
      </Note>

      <div className="my-3">
        <Card className="p-4">
          <CardLabel>HOW TO READ THIS SUITE</CardLabel>
          <div className="grid md:grid-cols-3 gap-3 text-xs">
            {(Object.keys(kindMeta) as TestKind[]).map(k => (
              <div key={k} className="rounded p-2.5" style={{ background: 'var(--elevated)' }}>
                <StatusChip tone={kindMeta[k].tone}>{kindMeta[k].chip}</StatusChip>
                <p className="mt-1.5" style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>{kindMeta[k].label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {groups.map((g, gi) => (
        <SuiteCard key={g[0]} group={g} startIndex={groups.slice(0, gi).reduce((s, x) => s + x[1].length, 0)} />
      ))}

      <Card className="p-4">
        <CardLabel>EXECUTE</CardLabel>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-mono" style={{ color: 'var(--accent)' }}>{TEST_SUMMARY.command}</span>
          {' '}— all {TEST_SUMMARY.total} tests pass after the patch. The reproduction test intentionally asserts the
          buggy total (≈ ₹1271.97) to lock the failure mode into the suite.
        </p>
      </Card>
    </div>
  );
}
