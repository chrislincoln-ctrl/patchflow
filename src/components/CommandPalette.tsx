import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, LayoutDashboard, Search, GitBranch, Wrench, CheckSquare, BarChart2, FileText, BookOpen, X, FolderCode, TestTube, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const commands = [
  { key: 'g', label: 'Go to Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { key: 'i', label: 'Open Investigation', to: '/investigate', icon: Search },
  { key: 'r', label: 'View Root Cause', to: '/root-cause', icon: GitBranch },
  { key: 'p', label: 'Review Patch', to: '/patch', icon: Wrench },
  { key: 'v', label: 'Run Validation', to: '/validation', icon: CheckSquare },
  { key: null, label: 'Open Impact', to: '/impact', icon: BarChart2 },
  { key: null, label: 'Generate Report', to: '/report', icon: FileText },
  { key: null, label: 'Open Evidence', to: '/evidence', icon: BookOpen },
  { key: null, label: 'OrderFlow API', to: '/project', icon: FolderCode },
  { key: null, label: 'Test Suite', to: '/tests', icon: TestTube },
  { key: null, label: 'About', to: '/settings', icon: Info },
];

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false);

      // Keyboard shortcuts without modifier
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        const cmd = commands.find(c => c.key === e.key);
        if (cmd && !commandPaletteOpen) {
          const focused = document.activeElement?.tagName;
          if (focused !== 'INPUT' && focused !== 'TEXTAREA') {
            navigate(cmd.to);
          }
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, setCommandPaletteOpen, navigate]);

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div
            className="fixed top-1/4 left-1/2 z-50 w-full max-w-lg -translate-x-1/2"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
          >
            <div className="rounded-lg overflow-hidden shadow-2xl" style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
              <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
                <Command size={16} style={{ color: 'var(--text-secondary)' }} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Command Palette</span>
                <button
                  className="ml-auto p-1 rounded"
                  style={{ color: 'var(--text-secondary)' }}
                  onClick={() => setCommandPaletteOpen(false)}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="py-1">
                {commands.map((cmd) => (
                  <button
                    key={cmd.to}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/5"
                    onClick={() => {
                      navigate(cmd.to);
                      setCommandPaletteOpen(false);
                    }}
                  >
                    <cmd.icon size={15} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{cmd.label}</span>
                    {cmd.key && (
                      <kbd className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                        {cmd.key}
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
              <div className="px-4 py-2 text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                Press <kbd className="px-1 rounded" style={{ background: 'var(--border)' }}>Esc</kbd> to dismiss
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
