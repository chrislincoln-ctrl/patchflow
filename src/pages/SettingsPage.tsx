import { motion } from 'framer-motion';
import { Activity, BookOpen, GitBranch, Cpu, FileText } from 'lucide-react';

const techStack = [
  { label: 'React', version: '19', color: 'var(--info)' },
  { label: 'TypeScript', version: '6', color: 'var(--info)' },
  { label: 'Vite', version: '8', color: 'var(--warning)' },
  { label: 'Tailwind CSS', version: '4', color: 'var(--accent)' },
  { label: 'Framer Motion', version: '13', color: 'var(--accent)' },
  { label: 'Recharts', version: '3', color: 'var(--success)' },
  { label: 'React Router', version: '7', color: 'var(--success)' },
  { label: 'Lucide React', version: '1.48', color: 'var(--text-secondary)' },
];

const bobCapabilities = [
  {
    cap: 'Agent Mode',
    usage: 'Multi-step investigations and code generation tasks',
    icon: Cpu,
  },
  {
    cap: 'Subagents',
    usage: 'Four specialized investigators (Code, Log, Test, Documentation)',
    icon: GitBranch,
  },
  {
    cap: 'Parallel Tasks',
    usage: 'All four investigators run concurrently (~2m vs ~6m sequential)',
    icon: Activity,
  },
  {
    cap: 'Document Understanding',
    usage: 'incident-report.pdf and api-spec.pdf ingested directly',
    icon: FileText,
  },
  {
    cap: 'Persistent Project Context',
    usage: 'AGENTS.md maintains investigation state across sessions',
    icon: BookOpen,
  },
];

const artifacts = [
  { name: 'AGENTS.md', desc: 'Project context — generated via Bob /init, extended for investigation' },
  { name: 'BOB_WORKFLOW.md', desc: 'IBM Bob 2.0 integration documentation — subagent config, task evidence' },
  { name: 'DEMO_SCRIPT.md', desc: '5-minute judge demonstration script with timing notes' },
  { name: 'evidence/', desc: 'incident-report.txt, production.log, api-spec.txt' },
  { name: 'sample-project/', desc: 'OrderFlow API — the debugging target with intentional bug (INC-2024-0847)' },
  { name: 'src/data/', desc: 'Central data store — deterministic demo artifacts for all pages' },
  { name: 'bob_sessions/', desc: 'IBM Bob 2.0 task session evidence (see directory for expected screenshots)' },
];

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-xs font-semibold tracking-widest mb-1" style={{ color: 'var(--text-secondary)', letterSpacing: '0.12em' }}>
          PATCHFLOW / ABOUT
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ letterSpacing: '-0.02em' }}>About PatchFlow</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          PatchFlow — Agentic Debugging Workflow · IBM Bob 2.0 Hackathon · January 2024
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* About */}
        <motion.div
          className="rounded-lg p-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
              <Activity size={13} style={{ color: 'var(--text-secondary)' }} />
            </div>
            <div className="text-xs font-semibold tracking-widest" style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
              ABOUT
            </div>
          </div>
          <div className="space-y-2">
            {[
              ['Project', 'PatchFlow'],
              ['Version', '1.0.0'],
              ['Challenge', 'IBM Bob 2.0 Hackathon'],
              ['Workflow', 'Debugging'],
              ['Demo Scenario', 'OrderFlow API · INC-2024-0847'],
              ['Mode', 'Demo (deterministic sample data)'],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-2 text-xs">
                <span style={{ color: 'var(--text-secondary)', minWidth: 90 }}>{k}</span>
                <span style={{ color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* IBM Bob 2.0 */}
        <motion.div
          className="rounded-lg p-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={13} style={{ color: 'var(--text-secondary)' }} />
            <div className="text-xs font-semibold tracking-widest" style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
              IBM BOB 2.0 CAPABILITIES USED
            </div>
          </div>
          <div className="space-y-2.5">
            {bobCapabilities.map(({ cap, usage, icon: Icon }) => (
              <div key={cap} className="flex gap-2 text-xs">
                <Icon size={12} style={{ color: 'var(--text-secondary)', marginTop: 1, flexShrink: 0 }} />
                <div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cap}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{usage}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tech stack */}
      <motion.div
        className="rounded-lg p-4 mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-xs font-semibold tracking-widest mb-3" style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          TECH STACK
        </div>
        <div className="flex flex-wrap gap-2">
          {techStack.map(({ label, version, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs"
              style={{ background: 'var(--elevated)', border: '1px solid var(--border)', color }}
            >
              <span style={{ color, fontWeight: 600 }}>{label}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>v{version}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Repository artifacts */}
      <motion.div
        className="rounded-lg overflow-hidden mb-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="text-xs font-semibold tracking-widest" style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
            REPOSITORY ARTIFACTS
          </div>
        </div>
        <div>
          {artifacts.map((a, i) => (
            <div
              key={a.name}
              className="flex items-start gap-3 px-4 py-2.5"
              style={{ borderBottom: i < artifacts.length - 1 ? '1px solid var(--border)' : 'none' }}
            >
              <span className="text-xs font-mono shrink-0 mt-0.5" style={{ color: 'var(--accent)', minWidth: 130 }}>{a.name}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{a.desc}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Transparency note */}
      <motion.div
        className="rounded-lg p-4 text-xs"
        style={{ background: 'rgba(255, 176, 32, 0.05)', border: '1px solid rgba(255, 176, 32, 0.18)', color: 'var(--text-secondary)' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span style={{ color: 'var(--warning)', fontWeight: 600 }}>Transparency</span>
        Demo Mode uses deterministic sample artifacts from <span className="font-mono">src/data/</span>.
        No external credentials, APIs, or network calls are required.
        IBM Bob 2.0 was used to develop and run the actual debugging workflow;
        the results are represented faithfully in the demo data.
        All impact figures are labeled as illustrative demo data.
      </motion.div>
    </div>
  );
}
