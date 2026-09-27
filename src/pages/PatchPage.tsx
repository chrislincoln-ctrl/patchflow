import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, FileCode, FlaskConical } from 'lucide-react';
import { patch } from '../data/patch';
import type { DiffLine } from '../types';

function DiffLineComponent({ line }: { line: DiffLine }) {
  const colors = {
    added: { bg: 'rgba(78, 207, 138, 0.07)', text: 'var(--accent)', prefix: '+' },
    removed: { bg: 'rgba(255, 92, 92, 0.07)', text: 'var(--error)', prefix: '-' },
    context: { bg: 'transparent', text: 'var(--text-secondary)', prefix: ' ' },
    header: { bg: 'rgba(95, 212, 227, 0.07)', text: 'var(--info)', prefix: '' },
  };
  const style = colors[line.type];
  return (
    <div className="flex font-mono text-xs leading-relaxed" style={{ background: style.bg }}>
      <span className="w-4 shrink-0 select-none" style={{ color: style.text }}>
        {style.prefix}
      </span>
      <span style={{ color: style.text }}>{line.content}</span>
    </div>
  );
}

export default function PatchPage() {
  const navigate = useNavigate();
  const [activeFile, setActiveFile] = useState(0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="text-xs font-semibold tracking-widest mb-1" style={{ color: 'var(--text-secondary)', letterSpacing: '0.12em' }}>
          PATCHFLOW / PATCH
        </div>
        <h1 className="text-2xl font-bold mb-1" style={{ letterSpacing: '-0.02em' }}>Minimal Patch</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {patch.description}
        </p>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Files changed', value: patch.files.length, color: 'var(--text-primary)' },
          { label: 'Lines added', value: patch.files.reduce((s, f) => s + f.linesAdded, 0), color: 'var(--accent)', prefix: '+' },
          { label: 'Lines removed', value: patch.files.reduce((s, f) => s + f.linesRemoved, 0), color: 'var(--error)', prefix: '-' },
          { label: 'Unrelated files', value: patch.unrelatedFilesTouched, color: 'var(--accent)', suffix: ' (demo result)' },
        ].map(({ label, value, color, prefix = '', suffix = '' }) => (
          <div key={label} className="rounded-lg p-3" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-xl font-bold font-mono mb-0.5" style={{ color }}>
              {prefix}{value}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
              {label}{suffix && <span style={{ color: 'var(--text-secondary)', fontSize: 9 }}> {suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Safety */}
      <div className="flex items-center gap-2 px-3 py-2.5 rounded mb-5 text-xs" style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
        <Shield size={13} style={{ color: 'var(--text-secondary)' }} />
        <span style={{ color: 'var(--text-secondary)' }}>{patch.safetyAssessment}</span>
      </div>

      {/* File tabs */}
      <div className="flex gap-1 mb-0" style={{ borderBottom: '1px solid var(--border)' }}>
        {patch.files.map((file, i) => (
          <button
            key={file.path}
            onClick={() => setActiveFile(i)}
            className="px-3 py-2 text-xs font-mono transition-colors"
            style={{
              color: activeFile === i ? 'var(--text-primary)' : 'var(--text-secondary)',
              borderBottom: activeFile === i ? '2px solid var(--border)' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {file.path.split('/').pop()}
            <span className="ml-2 text-xs" style={{ color: 'var(--accent)' }}>+{file.linesAdded}</span>
            <span className="ml-1 text-xs" style={{ color: 'var(--error)' }}>-{file.linesRemoved}</span>
          </button>
        ))}
      </div>

      {/* Diff viewer */}
      <div className="rounded-b-lg overflow-hidden mb-5" style={{ background: 'var(--elevated)', border: '1px solid var(--border)', borderTop: 'none' }}>
        <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <FileCode size={13} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>
              {patch.files[activeFile]?.path}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span style={{ color: 'var(--accent)' }}>+{patch.files[activeFile]?.linesAdded}</span>
            <span style={{ color: 'var(--error)' }}>-{patch.files[activeFile]?.linesRemoved}</span>
          </div>
        </div>
        <div className="p-3 overflow-x-auto">
          {patch.files[activeFile]?.diff.map((line, i) => (
            <DiffLineComponent key={i} line={line} />
          ))}
        </div>
      </div>

      {/* Regression test */}
      <div className="rounded-lg overflow-hidden mb-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-3 py-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
          <FlaskConical size={14} style={{ color: 'var(--warning)' }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>Regression Test</span>
          <span className="ml-auto text-xs font-mono" style={{ color: 'var(--warning)' }}>
            {patch.regressionTest.filename}
          </span>
        </div>
        <div className="p-3" style={{ background: 'var(--elevated)' }}>
          <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            {patch.regressionTest.description}
          </div>
          <pre className="text-xs overflow-x-auto font-mono leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: 11 }}>
            {patch.regressionTest.content}
          </pre>
        </div>
        <div className="flex items-center gap-3 px-3 py-2" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          <span className="text-xs" style={{ color: 'var(--accent)' }}>
            {patch.regressionTest.testCount} regression tests · All pass after patch
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate('/validation')}
        className="flex items-center gap-2 px-4 py-2.5 rounded font-medium text-sm transition-all hover:opacity-90"
        style={{ background: 'var(--accent)', color: '#0C0D0B' }}
      >
        Run Validation
        <ArrowRight size={14} />
      </button>
    </div>
  );
}
