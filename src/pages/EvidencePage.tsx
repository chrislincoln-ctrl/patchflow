import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Code2, BookOpen, TestTube, File, ChevronDown, ChevronUp } from 'lucide-react';
import { evidenceItems } from '../data/evidence';
import { PageHeader, StatusChip } from '../components/ui/primitives';
import type { Evidence } from '../types';

const typeIcons = {
  pdf: FileText,
  log: File,
  code: Code2,
  test: TestTube,
  document: BookOpen,
  spec: BookOpen,
};

const typeColors = {
  pdf: 'var(--error)',
  log: 'var(--warning)',
  code: 'var(--accent)',
  test: 'var(--success)',
  document: 'var(--info)',
  spec: 'var(--info)',
};

function EvidenceCard({ ev, index }: { ev: Evidence; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIcons[ev.type];
  const color = typeColors[ev.type];

  return (
    <motion.div
      className="rounded-lg overflow-hidden"
      style={{ background: 'var(--surface)', border: `1px solid ${expanded ? color + '40' : 'var(--border)'}` }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: color + '18', border: `1px solid ${color}30` }}>
            <Icon size={15} style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <span className="text-sm font-medium font-mono" style={{ color: 'var(--text-primary)' }}>{ev.name}</span>
              <span className="text-xs px-1.5 py-0.5 rounded uppercase" style={{ background: color + '20', color, fontSize: 9, fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                {ev.type}
              </span>
            </div>
            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
              Source: <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{ev.source}</span>
              {ev.relevantLines && <span className="ml-2">· Relevant: {ev.relevantLines}</span>}
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{ev.finding}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {ev.usedBy.map(role => (
                <span key={role} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)', fontSize: 10 }}>
                  {role} investigator
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded shrink-0 transition-colors hover:bg-white/5"
            style={{ color: 'var(--text-secondary)' }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && ev.content && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="p-4" style={{ background: 'var(--elevated)' }}>
              <pre className="text-xs whitespace-pre-wrap font-mono leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
                {ev.content}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function EvidencePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        section="PATCHFLOW / EVIDENCE"
        title="Evidence Viewer"
        subtitle="All evidence sources ingested for investigation INC-2024-0847, as they exist in evidence/ and sample-project/. Click any item to view raw content."
        actions={<StatusChip tone="info">5 sources</StatusChip>}
      />

      <div className="space-y-3">
        {evidenceItems.map((ev, i) => (
          <EvidenceCard key={ev.id} ev={ev} index={i} />
        ))}
      </div>
    </div>
  );
}
