import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { DemoPhase } from '../types';

interface DemoState {
  active: boolean;
  phase: DemoPhase;
  phaseIndex: number;
  logs: string[];
  progress: number;
}

interface AppContextValue {
  demo: DemoState;
  startDemo: () => void;
  resetDemo: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const PHASES: { phase: DemoPhase; label: string; duration: number; logs: string[] }[] = [
  {
    phase: 'ingesting',
    label: '01 INGESTING EVIDENCE',
    duration: 3500,
    logs: [
      '→ Ingesting incident-report.pdf ...',
      '→ Parsing production.log (4,203 entries) ...',
      '→ Ingesting api-spec.pdf ...',
      '→ Indexing source files: src/services/ ...',
      '→ Loading test suite: 127 tests ...',
      '✓ Evidence ingestion complete — 5 sources indexed',
    ],
  },
  {
    phase: 'spawning',
    label: '02 SPAWNING INVESTIGATORS',
    duration: 2500,
    logs: [
      '→ Spawning Code Investigator subagent ...',
      '→ Spawning Log Investigator subagent ...',
      '→ Spawning Test Investigator subagent ...',
      '→ Spawning Documentation Investigator subagent ...',
      '✓ 4 parallel investigators active',
    ],
  },
  {
    phase: 'investigating',
    label: '03 PARALLEL ANALYSIS',
    duration: 5000,
    logs: [
      '[CODE]  Tracing calculateFinalTotal() execution path ...',
      '[LOG]   Correlating failure pattern across 4,203 entries ...',
      '[TEST]  Analyzing test coverage gaps ...',
      '[DOC]   Extracting pricing rules from api-spec.pdf §4.3 ...',
      '[CODE]  Identified: tax aggregated before coupon at line 91 ...',
      '[LOG]   Pattern: 100% failure rate on coupon + mixed tax rates ...',
      '[TEST]  Gap confirmed: no coupon + multi-tax test exists ...',
      '[DOC]   Spec violation confirmed: discount must precede tax ...',
      '✓ All 4 investigators complete',
    ],
  },
  {
    phase: 'synthesizing',
    label: '04 SYNTHESIZING ROOT CAUSE',
    duration: 3000,
    logs: [
      '→ Cross-referencing investigator findings ...',
      '→ Mapping evidence chain: incident → symptom → code path ...',
      '→ Confirming specification violation ...',
      '→ Localizing to 3-line code region in checkout.ts:91–110 ...',
      '✓ Root cause identified — HIGH CONFIDENCE (97%)',
    ],
  },
  {
    phase: 'reproducing',
    label: '05 REPRODUCING FAILURE',
    duration: 2500,
    logs: [
      '$ npm run reproduce',
      '→ Loading fixture: cart [iPhone Case, USB-C Cable] ...',
      '→ Applying coupon: COUPON10 (10% off) ...',
      '→ Calculating tax: GST 5% + GST 18% ...',
      '→ Expected total: ₹1,214.51',
      '→ Actual total:   ₹1,227.00',
      '✗ FAIL — discrepancy confirmed: +₹12.49',
      '✓ Bug reproduced successfully',
    ],
  },
  {
    phase: 'patching',
    label: '06 GENERATING PATCH',
    duration: 2500,
    logs: [
      '→ Identifying minimal change set ...',
      '→ Reordering: computeDiscount() before aggregateTaxByJurisdiction() ...',
      '→ Updating function signature: tax.ts aggregateTaxByJurisdiction() ...',
      '→ Files changed: 2 | Lines added: 6 | Lines removed: 3 ...',
      '→ Unrelated files touched: 0',
      '✓ Minimal patch generated',
    ],
  },
  {
    phase: 'testing',
    label: '07 RUNNING REGRESSION TEST',
    duration: 2500,
    logs: [
      '$ npx vitest run tests/checkout.coupon-tax.spec.ts',
      '→ applies 10% coupon before aggregating 5%+18% GST ... PASS',
      '→ produces correct total without coupon (no regression) ... PASS',
      '→ applies fixed-amount coupon before tax correctly ... PASS',
      '→ handles no coupon + single tax rate ... PASS',
      '✓ 4/4 regression tests pass',
    ],
  },
  {
    phase: 'validating',
    label: '08 VALIDATING BUILD',
    duration: 3000,
    logs: [
      '$ npx vitest run',
      '→ Running 131 tests across 12 test files ...',
      '→ All tests pass: 131/131 ...',
      '$ tsc --noEmit',
      '→ TypeScript compilation: 0 errors ...',
      '$ npm run build',
      '→ Build complete ...',
      '✓ All validation gates passed',
    ],
  },
  {
    phase: 'reporting',
    label: '09 GENERATING REPORT',
    duration: 2000,
    logs: [
      '→ Compiling investigation findings ...',
      '→ Attaching evidence references ...',
      '→ Calculating impact metrics ...',
      '→ Generating PatchFlow Debugging Report ...',
      '✓ Report ready',
    ],
  },
  {
    phase: 'complete',
    label: '✓ VERIFIED FIX',
    duration: 0,
    logs: ['→ PatchFlow workflow complete.', '✓ VERIFIED FIX — INC-2024-0847'],
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [demo, setDemo] = useState<DemoState>({
    active: false,
    phase: 'idle',
    phaseIndex: -1,
    logs: [],
    progress: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (logTimerRef.current) clearInterval(logTimerRef.current);
  };

  const runPhase = useCallback((index: number) => {
    if (index >= PHASES.length) return;
    const p = PHASES[index];
    setDemo(prev => ({
      ...prev,
      phase: p.phase,
      phaseIndex: index,
      progress: Math.round(((index) / (PHASES.length - 1)) * 100),
    }));

    let logIndex = 0;
    logTimerRef.current = setInterval(() => {
      if (logIndex < p.logs.length) {
        const line = p.logs[logIndex];
        setDemo(prev => ({ ...prev, logs: [...prev.logs, line] }));
        logIndex++;
      } else {
        if (logTimerRef.current) clearInterval(logTimerRef.current);
      }
    }, p.duration / (p.logs.length + 1));

    if (p.duration > 0) {
      timerRef.current = setTimeout(() => runPhase(index + 1), p.duration);
    }
  }, []);

  const startDemo = useCallback(() => {
    clearTimers();
    setDemo({ active: true, phase: 'idle', phaseIndex: -1, logs: [], progress: 0 });
    setTimeout(() => runPhase(0), 300);
  }, [runPhase]);

  const resetDemo = useCallback(() => {
    clearTimers();
    setDemo({ active: false, phase: 'idle', phaseIndex: -1, logs: [], progress: 0 });
  }, []);

  return (
    <AppContext.Provider value={{
      demo, startDemo, resetDemo,
      sidebarOpen, setSidebarOpen,
      commandPaletteOpen, setCommandPaletteOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { PHASES };
