import { motion } from 'framer-motion';
import { FolderCode, FileCode, TestTube, FileText, GitCommit, ScrollText } from 'lucide-react';
import { PageHeader, StatusChip, Card, CardLabel } from '../components/ui/primitives';
import { CANONICAL_FILES, CANONICAL_INCIDENT, TEST_SUMMARY } from '../data/canonical';

const files = [
  { path: CANONICAL_FILES.checkout.path, type: 'code', desc: CANONICAL_FILES.checkout.role, lines: CANONICAL_FILES.checkout.lines },
  { path: CANONICAL_FILES.tax.path, type: 'code', desc: CANONICAL_FILES.tax.role, lines: CANONICAL_FILES.tax.lines },
  { path: CANONICAL_FILES.coupon.path, type: 'code', desc: CANONICAL_FILES.coupon.role, lines: CANONICAL_FILES.coupon.lines },
  { path: CANONICAL_FILES.models[0].path, type: 'code', desc: CANONICAL_FILES.models[0].role, lines: CANONICAL_FILES.models[0].lines },
  { path: CANONICAL_FILES.models[1].path, type: 'code', desc: CANONICAL_FILES.models[1].role, lines: CANONICAL_FILES.models[1].lines },
  { path: CANONICAL_FILES.regressionSpec.path, type: 'test', desc: CANONICAL_FILES.regressionSpec.role, lines: CANONICAL_FILES.regressionSpec.lines },
  { path: CANONICAL_FILES.fixtures.path, type: 'test', desc: CANONICAL_FILES.fixtures.role, lines: CANONICAL_FILES.fixtures.lines },
  { path: CANONICAL_FILES.reproduce.path, type: 'script', desc: CANONICAL_FILES.reproduce.role, lines: CANONICAL_FILES.reproduce.lines },
  { path: 'evidence/incident-report.txt', type: 'pdf', desc: `${CANONICAL_INCIDENT.id} incident report`, lines: 0 },
  { path: 'evidence/production.log', type: 'log', desc: 'Production logs with failure pattern analysis', lines: 14 },
  { path: 'evidence/api-spec.txt', type: 'spec', desc: 'OrderFlow API Specification v2.4.1', lines: 0 },
];

const typeIcons: Record<string, React.ElementType> = {
  code: FileCode,
  test: TestTube,
  script: ScrollText,
  pdf: FileText,
  log: FileText,
  spec: FileText,
};
const typeColors: Record<string, string> = {
  code: 'var(--info)',
  test: 'var(--success)',
  script: 'var(--accent)',
  pdf: 'var(--error)',
  log: 'var(--warning)',
  spec: 'var(--info)',
};

export default function ProjectPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        section="PATCHFLOW / PROJECT"
        title="OrderFlow API"
        subtitle="Sample Node.js + TypeScript API — the debugging target. The checkout service carries the intentional coupon + multi-tax bug; everything on this page mirrors the repository on disk."
        actions={<StatusChip tone="accent">{TEST_SUMMARY.total} tests passing</StatusChip>}
      />

      {/* Commit badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-2 rounded mb-4 text-xs flex-wrap"
        style={{ background: 'var(--surface)', border: '1px solid rgba(255, 92, 92, 0.25)' }}
      >
        <GitCommit size={12} style={{ color: 'var(--error)' }} />
        <span style={{ color: 'var(--text-secondary)' }}>Regression introduced in</span>
        <span className="font-mono" style={{ color: 'var(--error)' }}>{CANONICAL_INCIDENT.commit}</span>
        <span style={{ color: 'var(--text-secondary)' }}>— {CANONICAL_INCIDENT.commitDate} · {CANONICAL_INCIDENT.commitDescription}</span>
      </div>

      <Card className="overflow-hidden mb-3">
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <FolderCode size={14} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Project Files</span>
            <span className="ml-auto text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>sample-project/</span>
          </div>
        </div>
        <div>
          {files.map((file, i) => {
            const Icon = typeIcons[file.type] ?? FileCode;
            const color = typeColors[file.type] ?? 'var(--text-secondary)';
            return (
              <motion.div
                key={file.path}
                className="flex items-center gap-3 px-4 py-2.5"
                style={{ borderBottom: i < files.length - 1 ? '1px solid var(--border)' : 'none' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Icon size={13} style={{ color, flexShrink: 0 }} />
                <span className="text-xs font-mono sm:min-w-[220px] min-w-0 truncate" style={{ color: 'var(--text-primary)' }}>{file.path}</span>
                <span className="text-xs hidden sm:block flex-1" style={{ color: 'var(--text-secondary)' }}>{file.desc}</span>
                {file.lines > 0 && (
                  <span className="text-xs shrink-0" style={{ color: 'var(--text-secondary)', fontSize: 10, fontFamily: 'monospace' }}>
                    {file.lines} lines
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </Card>

      <Card className="p-4">
        <CardLabel>KEY FACTS</CardLabel>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
          {[
            ['Test runner', TEST_SUMMARY.runner],
            ['Test command', TEST_SUMMARY.command],
            ['Reproduction script', `npm run reproduce (in sample-project/)`],
            ['Regression suite', CANONICAL_FILES.regressionSpec.path],
            ['Bug location', `${CANONICAL_FILES.checkout.path} — calculateFinalTotal()`],
            ['Governing rule', `API spec ${CANONICAL_INCIDENT.specSection} — discount before tax`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <span style={{ color: 'var(--text-secondary)' }}>{k}</span>
              <span className="font-mono text-right" style={{ color: 'var(--text-primary)' }}>{v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
