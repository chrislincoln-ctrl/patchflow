import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, GitBranch, Wrench, CheckSquare, BarChart2,
  FileText, FolderCode, TestTube, Info, X, ChevronRight,
  Activity, BookOpen, Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toWorkflowState } from '../data/canonical';

const navSections = [
  {
    label: 'WORKSPACE',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { to: '/investigate', icon: Search, label: 'Investigation' },
      { to: '/root-cause', icon: GitBranch, label: 'Root Cause' },
      { to: '/patch', icon: Wrench, label: 'Patch' },
      { to: '/validation', icon: CheckSquare, label: 'Validation' },
      { to: '/impact', icon: BarChart2, label: 'Impact' },
      { to: '/report', icon: FileText, label: 'Reports' },
    ],
  },
  {
    label: 'PROJECT',
    items: [
      { to: '/project', icon: FolderCode, label: 'OrderFlow API' },
      { to: '/evidence', icon: BookOpen, label: 'Evidence' },
      { to: '/tests', icon: TestTube, label: 'Test Suite' },
    ],
  },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, demo } = useApp();
  const location = useLocation();
  const workflowState = toWorkflowState(demo);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed top-0 left-0 h-full z-50 lg:relative lg:z-auto flex flex-col shrink-0"
        style={{
          width: 220,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
        initial={false}
        animate={{ width: sidebarOpen ? 220 : 0, x: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded" style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
              <Activity size={14} className="m-1" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest" style={{ color: 'var(--text-primary)', letterSpacing: '0.15em' }}>
                PATCHFLOW
              </div>
              <div className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 9 }}>
                Agentic Debugging
              </div>
            </div>
          </div>
          <button
            className="lg:hidden p-1 rounded"
            style={{ color: 'var(--text-secondary)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Incident indicator — reflects workflow state, no stale ACTIVE */}
        <div
          className="mx-3 my-2 px-3 py-2 rounded"
          style={{
            background: workflowState === 'VERIFIED' ? 'rgba(78, 207, 138, 0.08)' : 'rgba(255, 92, 92, 0.08)',
            border: `1px solid ${workflowState === 'VERIFIED' ? 'rgba(78, 207, 138, 0.25)' : 'rgba(255, 92, 92, 0.2)'}`,
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-1.5 h-1.5 rounded-full ${workflowState === 'VERIFIED' ? '' : 'animate-pulse'}`}
              style={{ background: workflowState === 'VERIFIED' ? 'var(--accent)' : 'var(--error)' }}
            />
            <span
              className="text-xs font-medium"
              style={{ color: workflowState === 'VERIFIED' ? 'var(--accent)' : 'var(--error)' }}
            >
              INC-2024-0847
            </span>
            <span
              className="ml-auto text-xs font-mono"
              style={{ fontSize: 9, color: workflowState === 'VERIFIED' ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              {workflowState === 'IDLE' ? 'OPEN' : workflowState === 'VERIFIED' ? 'RESOLVED' : workflowState}
            </span>
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
            Checkout total mismatch
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {navSections.map((section) => (
            <div key={section.label} className="mb-4">
              <div className="px-2 mb-1 text-xs font-semibold tracking-widest" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
                {section.label}
              </div>
              {section.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded text-sm transition-colors group"
                  style={({ isActive }) => ({
                    background: isActive ? 'rgba(234, 242, 234, 0.06)' : 'transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? 600 : 400,
                  })}
                >
                  <Icon size={14} />
                  <span className="text-xs">{label}</span>
                  {location.pathname === to && (
                    <ChevronRight size={10} className="ml-auto" style={{ color: 'var(--text-secondary)' }} />
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-2 pb-4 space-y-1" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          {/* IBM Bob indicator */}
          <div className="flex items-center gap-2 px-2 py-1.5 rounded" style={{ background: 'var(--elevated)', border: '1px solid var(--border)' }}>
            <Cpu size={12} style={{ color: 'var(--text-secondary)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>IBM BOB 2.0</span>
            <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
          </div>

          <NavLink
            to="/settings"
            className="flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors"
            style={({ isActive }) => ({
              background: isActive ? 'rgba(234, 242, 234, 0.06)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 400,
            })}
          >
            <Info size={12} />
            <span style={{ fontSize: 10 }}>About</span>
          </NavLink>
        </div>
      </motion.aside>
    </>
  );
}
