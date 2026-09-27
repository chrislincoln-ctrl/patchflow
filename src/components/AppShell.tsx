
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Command, Activity, AlertTriangle } from 'lucide-react';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import { useApp } from '../context/AppContext';
import { toWorkflowState } from '../data/canonical';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const BREADCRUMB_LABELS: Record<string, string> = {
  '/dashboard':  'Overview',
  '/investigate':'Investigation',
  '/root-cause': 'Root Cause',
  '/patch':      'Patch',
  '/validation': 'Validation',
  '/impact':     'Impact',
  '/report':     'Report',
  '/evidence':   'Evidence',
  '/project':    'OrderFlow API',
  '/tests':      'Test Suite',
  '/settings':   'About',
};

function breadcrumbLabel(path: string): string {
  return BREADCRUMB_LABELS[path] ?? (path.replace('/', '') || 'home');
}

export default function AppShell() {
  const { sidebarOpen, setSidebarOpen, demo, setCommandPaletteOpen } = useApp();
  const location = useLocation();
  const workflowState = toWorkflowState(demo);
  const resolved = workflowState === 'VERIFIED' || workflowState === 'RESOLVED';

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="flex items-center gap-3 px-4 py-2.5 shrink-0"
          style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)', height: 44 }}
        >
          <button
            className="p-1 rounded lg:hidden"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={16} />
          </button>
          <button
            className="hidden lg:block p-1 rounded"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={16} />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
            <Activity size={12} style={{ color: 'var(--accent)' }} />
            <span style={{ color: 'var(--accent)' }}>PatchFlow</span>
            <span>/</span>
            <span style={{ color: 'var(--text-primary)' }}>
              {breadcrumbLabel(location.pathname)}
            </span>
          </div>

          {/* Workflow status — single source of truth, never contradictory */}
          <div
            className="flex items-center gap-2 px-2 py-1 rounded text-xs ml-2"
            style={{
              background: resolved ? 'rgba(78, 207, 138, 0.08)' : demo.active ? 'rgba(255, 176, 32, 0.08)' : 'transparent',
              border: `1px solid ${resolved ? 'rgba(78, 207, 138, 0.25)' : demo.active ? 'rgba(255, 176, 32, 0.25)' : 'transparent'}`,
            }}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${demo.active && !resolved ? 'animate-pulse' : ''}`}
              style={{ background: resolved ? 'var(--accent)' : demo.active ? 'var(--warning)' : 'var(--border)' }}
            />
            <span style={{ color: resolved ? 'var(--accent)' : demo.active ? 'var(--warning)' : 'var(--text-secondary)', fontSize: 10, letterSpacing: '0.06em' }}>
              {resolved ? 'VERIFIED FIX · RESOLVED' : workflowState === 'IDLE' ? 'DEMO IDLE' : workflowState}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Incident badge — reflects state */}
            <div
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded text-xs"
              style={{
                background: resolved ? 'rgba(78, 207, 138, 0.08)' : 'rgba(255, 92, 92, 0.08)',
                border: `1px solid ${resolved ? 'rgba(78, 207, 138, 0.25)' : 'rgba(255, 92, 92, 0.2)'}`,
              }}
            >
              <AlertTriangle size={10} style={{ color: resolved ? 'var(--accent)' : 'var(--error)' }} />
              <span style={{ color: resolved ? 'var(--accent)' : 'var(--error)', fontSize: 10 }}>
                INC-2024-0847 {resolved ? 'RESOLVED' : 'OPEN'}
              </span>
            </div>

            {/* Command palette trigger */}
            <button
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors hover:bg-white/5"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              onClick={() => setCommandPaletteOpen(true)}
            >
              <Command size={11} />
              <span style={{ fontSize: 10 }}>K</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}

