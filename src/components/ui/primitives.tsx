import type { CSSProperties, ReactNode } from 'react';

/**
 * Shared internal design-system primitives — one implementation per pattern,
 * consumed by every workspace page (Step 19: one coherent design system).
 */

// ── Status chips ──────────────────────────────────────────────────────────────
export type ChipTone = 'neutral' | 'accent' | 'warning' | 'error' | 'info' | 'success';

const CHIP_STYLES: Record<ChipTone, CSSProperties> = {
  neutral: { background: 'var(--elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
  accent: { background: 'rgba(78, 207, 138, 0.1)', color: 'var(--accent)', border: '1px solid rgba(78, 207, 138, 0.25)' },
  success: { background: 'rgba(78, 207, 138, 0.1)', color: 'var(--accent)', border: '1px solid rgba(78, 207, 138, 0.25)' },
  warning: { background: 'rgba(255, 176, 32, 0.1)', color: 'var(--warning)', border: '1px solid rgba(255, 176, 32, 0.25)' },
  error: { background: 'rgba(255, 92, 92, 0.1)', color: 'var(--error)', border: '1px solid rgba(255, 92, 92, 0.25)' },
  info: { background: 'rgba(95, 212, 227, 0.08)', color: 'var(--info)', border: '1px solid rgba(95, 212, 227, 0.22)' },
};

export function StatusChip({
  tone = 'neutral',
  children,
  pulse,
}: {
  tone?: ChipTone;
  children: ReactNode;
  pulse?: boolean;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-semibold whitespace-nowrap"
      style={{ ...CHIP_STYLES[tone], fontSize: 10, letterSpacing: '0.08em' }}
    >
      {pulse && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: 'currentColor' }}
        />
      )}
      {children}
    </span>
  );
}

// ── Page header ───────────────────────────────────────────────────────────────
export function PageHeader({
  section,
  title,
  subtitle,
  actions,
}: {
  section: string;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        <div
          className="text-xs font-semibold tracking-widest mb-1.5"
          style={{ color: 'var(--text-secondary)', letterSpacing: '0.14em' }}
        >
          {section}
        </div>
        <h1 className="text-2xl font-bold" style={{ letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm mt-1.5 max-w-2xl" style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
export function Card({
  children,
  accent,
  style,
  className = '',
}: {
  children: ReactNode;
  accent?: 'top-accent' | 'error' | 'info';
  style?: CSSProperties;
  className?: string;
}) {
  const accentStyle: CSSProperties =
    accent === 'top-accent'
      ? { borderTop: '2px solid var(--accent)' }
      : accent === 'error'
        ? { border: '1px solid rgba(255, 92, 92, 0.3)' }
        : accent === 'info'
          ? { border: '1px solid rgba(95, 212, 227, 0.3)' }
          : {};
  return (
    <div
      className={`rounded-lg ${className}`}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', ...accentStyle, ...style }}
    >
      {children}
    </div>
  );
}

export function CardLabel({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div
        className="text-xs font-semibold tracking-widest"
        style={{ color: 'var(--text-secondary)', letterSpacing: '0.12em' }}
      >
        {children}
      </div>
      {right}
    </div>
  );
}

// ── Metric tile ───────────────────────────────────────────────────────────────
export function MetricTile({
  value,
  label,
  color = 'var(--text-primary)',
  hint,
}: {
  value: ReactNode;
  label: string;
  color?: string;
  hint?: string;
}) {
  return (
    <div className="rounded-lg p-3.5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="text-2xl font-bold font-mono mb-0.5" style={{ color }}>
        {value}
      </div>
      <div className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10, letterSpacing: '0.06em' }}>
        {label}
        {hint && (
          <span className="block mt-0.5 font-normal" style={{ fontSize: 9 }}>
            {hint}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Section eyebrow (inside page bodies) ─────────────────────────────────────
export function Note({ tone = 'neutral', children }: { tone?: ChipTone; children: ReactNode }) {
  const style = CHIP_STYLES[tone];
  return (
    <div
      className="flex items-start gap-2 px-3 py-2.5 rounded text-xs"
      style={{ background: style.background, border: style.border, color: style.color, lineHeight: 1.5 }}
    >
      {children}
    </div>
  );
}
