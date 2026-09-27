import type { LucideIcon } from 'lucide-react';
import { CheckSquare, FileText, GitBranch, Search, Zap } from 'lucide-react';

// ── Slide meta ────────────────────────────────────────────────────────────────
export const SLIDE_COUNT = 5;

export const SLIDE_LABELS = [
  'Intro',
  'The problem',
  'How it works',
  'IBM Bob 2.0',
  'Get started',
] as const;

// Premium, controlled easing (easeOutQuint-ish) used for slide transitions.
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── Slide 1 — Hero workflow strip ─────────────────────────────────────────────
export interface WorkflowStep {
  label: string;
  color: string;
}

export const workflowSteps: WorkflowStep[] = [
  { label: 'INCIDENT', color: 'var(--error)' },
  { label: 'EVIDENCE', color: 'var(--info)' },
  { label: 'INVESTIGATE', color: 'var(--accent)' },
  { label: 'ROOT CAUSE', color: 'var(--warning)' },
  { label: 'PATCH', color: 'var(--accent)' },
  { label: 'TEST', color: 'var(--info)' },
  { label: 'VERIFIED', color: 'var(--success)' },
];

// ── Slide 2 — The problem ─────────────────────────────────────────────────────
export const traditionalSteps = [
  'Issue reported',
  'Search logs manually',
  'Search code manually',
  'Trace dependencies',
  'Reproduce locally',
  'Find cause (maybe)',
  'Fix (and hope)',
  'Write test (maybe)',
  'Validate (manually)',
  'Document (later)',
];

export const patchflowSteps = [
  'Evidence ingestion',
  'Parallel investigation (4 agents)',
  'Root cause synthesis',
  'Reproduction',
  'Minimal patch',
  'Regression test',
  'Automated validation',
  'Verified fix + report',
];

// ── Slide 3 — How it works ────────────────────────────────────────────────────
export interface Stage {
  number: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

export const howItWorks: Stage[] = [
  {
    number: '01',
    title: 'INGEST',
    desc: 'Incident reports, production logs, API specifications, source code, and test suites are ingested and indexed for investigation.',
    icon: FileText,
  },
  {
    number: '02',
    title: 'INVESTIGATE',
    desc: 'Four specialized subagents run in parallel: Code, Log, Test, and Documentation investigators — each focused, isolated, and efficient.',
    icon: Search,
  },
  {
    number: '03',
    title: 'SYNTHESIZE',
    desc: 'Independent findings are cross-referenced into a single root-cause explanation with an evidence chain and confidence assessment.',
    icon: GitBranch,
  },
  {
    number: '04',
    title: 'REPAIR',
    desc: 'The minimal patch is generated and reviewed alongside a purpose-built regression test. Only the affected code is touched.',
    icon: Zap,
  },
  {
    number: '05',
    title: 'VERIFY',
    desc: 'Tests, build, API contract, lint, and unrelated-behaviour checks all run. The workflow ends with VERIFIED FIX or a clear failure state.',
    icon: CheckSquare,
  },
];

// ── Slide 4 — IBM Bob 2.0 ─────────────────────────────────────────────────────
export const bobCapabilities = [
  'Agent Mode',
  'Subagents',
  'Parallel Tasks',
  'Document Understanding',
  'Persistent Project Context',
  'Validation',
  'Safe Changes',
];

export interface BobFlowStep {
  label: string;
  color: string;
}

export const bobFlow: BobFlowStep[] = [
  { label: 'Plan', color: 'var(--info)' },
  { label: 'Investigate', color: 'var(--text-secondary)' },
  { label: 'Parallel subagents', color: 'var(--text-secondary)' },
  { label: 'Agent execution', color: 'var(--warning)' },
  { label: 'Validation', color: 'var(--accent)' },
  { label: 'Report', color: 'var(--accent)' },
];
