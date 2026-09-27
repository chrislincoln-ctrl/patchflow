import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingDown, TrendingUp, FlaskConical, Gauge } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PageHeader, StatusChip, Card, CardLabel, Note } from '../components/ui/primitives';
import { CANONICAL_IMPACT, IMPACT_DISCLAIMER } from '../data/canonical';
import type { ImpactRow } from '../data/canonical';

type DataType = ImpactRow['dataType'];
const MEASURED: DataType = 'MEASURED IN THIS DEMONSTRATION';
const ILLUSTRATIVE: DataType = 'ILLUSTRATIVE WORKFLOW COMPARISON';

function calcChange(metric: ImpactRow) {
  if (metric.lowerIsBetter) {
    return metric.before === 0 ? null : Math.round(((metric.before - metric.after) / metric.before) * 100);
  }
  if (metric.before === 0 && metric.after > 0) return 100;
  return Math.round(((metric.after - metric.before) / Math.max(metric.before, 1)) * 100);
}

function changeLabel(metric: ImpactRow) {
  const pct = calcChange(metric);
  if (pct === null || pct === 0) return '—';
  const sign = metric.lowerIsBetter ? '-' : '+';
  return `${sign}${Math.abs(pct)}%`;
}

function DataTypeBadge({ type }: { type: DataType }) {
  return type === MEASURED ? (
    <StatusChip tone="accent">MEASURED HERE</StatusChip>
  ) : (
    <StatusChip tone="warning">ILLUSTRATIVE</StatusChip>
  );
}

function MetricRow({ metric }: { metric: ImpactRow }) {
  const improved = metric.lowerIsBetter ? metric.after < metric.before : metric.after > metric.before;
  const neutral = metric.before === metric.after;
  return (
    <motion.div
      className="grid grid-cols-[1.4fr_0.9fr_0.9fr_0.7fr_1fr] gap-3 items-center py-3"
      style={{ borderBottom: '1px solid var(--border)' }}
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
    >
      <div className="min-w-0">
        <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>{metric.label}</div>
        {metric.note && (
          <div className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{metric.note}</div>
        )}
      </div>
      <div className="text-sm font-mono" style={{ color: 'var(--error)' }}>
        {metric.before} <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{metric.unit}</span>
      </div>
      <div className="text-sm font-mono" style={{ color: 'var(--accent)' }}>
        {metric.after} <span style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{metric.unit}</span>
      </div>
      <div className="flex items-center gap-1">
        {!neutral && improved && <TrendingDown size={13} style={{ color: 'var(--success)' }} />}
        {!neutral && !improved && <TrendingUp size={13} style={{ color: 'var(--success)' }} />}
        <span
          className="text-xs font-mono font-bold"
          style={{ color: neutral ? 'var(--text-secondary)' : 'var(--success)' }}
        >
          {changeLabel(metric)}
        </span>
      </div>
      <DataTypeBadge type={metric.dataType} />
    </motion.div>
  );
}

// Chart only comparable-scale, same-unit metrics; measured first.
function buildChartData(rows: ImpactRow[]) {
  const measured = rows
    .filter(m => m.dataType === MEASURED && m.before !== m.after)
    .map(m => ({ name: m.label, Before: m.before, After: m.after, unit: m.unit }));
  const illustrative = rows
    .filter(m => m.dataType === ILLUSTRATIVE && m.before !== m.after && m.unit === 'steps' || m.unit === 'switches' || m.unit === 'files' || m.unit === 'attempts')
    .slice(0, 3)
    .map(m => ({
      name: m.label.replace('Manual Investigation Steps', 'Manual Steps').replace('Files Manually Inspected', 'Files Inspected').replace('Rework Attempts', 'Rework'),
      Before: m.before,
      After: m.after,
      unit: m.unit,
    }));
  return [...measured, ...illustrative];
}

export default function ImpactPage() {
  const navigate = useNavigate();
  const measured = CANONICAL_IMPACT.filter(m => m.dataType === MEASURED);
  const chartData = buildChartData(CANONICAL_IMPACT);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        section="PATCHFLOW / IMPACT"
        title="Workflow Impact"
        subtitle="What changed, separated by evidence quality. Measured values are verifiable in this repository; illustrative values are configured demo comparisons."
      />

      <Note tone="warning">
        <Gauge size={13} className="shrink-0 mt-0.5" />
        <span>{IMPACT_DISCLAIMER}</span>
      </Note>

      {/* Measured in this demonstration */}
      <Card accent="top-accent" className="p-4 mt-3 mb-3">
        <CardLabel
          right={
            <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--accent)', fontSize: 10 }}>
              <FlaskConical size={11} /> verifiable in this repo
            </span>
          }
        >
          MEASURED IN THIS DEMONSTRATION
        </CardLabel>
        <div className="grid sm:grid-cols-2 gap-3">
          {measured.map(m => (
            <div key={m.id} className="rounded p-3" style={{ background: 'var(--elevated)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{m.label}</span>
                <DataTypeBadge type={m.dataType} />
              </div>
              <div className="text-lg font-bold font-mono" style={{ color: 'var(--accent)' }}>
                {m.before} → {m.after} <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{m.unit}</span>
              </div>
              {m.note && <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>{m.note}</div>}
            </div>
          ))}
        </div>
      </Card>

      {/* Chart — comparable scales only */}
      <Card className="p-4 mb-3">
        <CardLabel right={<span className="text-xs" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>comparable-scale metrics only · units on hover</span>}>
          BEFORE / AFTER COMPARISON
        </CardLabel>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
              interval={0}
              angle={-14}
              textAnchor="end"
              height={46}
            />
            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              contentStyle={{
                background: 'var(--elevated)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                fontSize: 12,
                color: 'var(--text-primary)',
              }}
              formatter={((value: unknown, name: unknown, item: { payload?: { unit?: string } }) => [
                `${value} ${item?.payload?.unit ?? ''}`,
                String(name),
              ]) as never}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-secondary)' }} />
            <Bar dataKey="Before" name="Before (manual)" fill="rgba(255, 92, 92, 0.6)" radius={[3, 3, 0, 0]} />
            <Bar dataKey="After" name="After (PatchFlow)" fill="rgba(78, 207, 138, 0.6)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)', fontSize: 10 }}>
          Time-based metrics (minutes) are excluded from the chart — mixing scales distorts the comparison. See the table for all values.
        </p>
      </Card>

      {/* Full metric table */}
      <Card className="overflow-hidden mb-3">
        <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
          <div
            className="grid grid-cols-[1.4fr_0.9fr_0.9fr_0.7fr_1fr] gap-3 text-xs font-semibold tracking-widest"
            style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}
          >
            <span>Metric</span>
            <span>Before</span>
            <span>After</span>
            <span>Change</span>
            <span>Data Type</span>
          </div>
        </div>
        <div className="px-4">
          {CANONICAL_IMPACT.map(m => (
            <MetricRow key={m.id} metric={m} />
          ))}
        </div>
      </Card>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/report')}
          className="flex items-center gap-2 px-4 py-2.5 rounded font-medium text-sm transition-all hover:opacity-90"
          style={{ background: 'var(--accent)', color: '#0C0D0B' }}
        >
          Generate Report
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
