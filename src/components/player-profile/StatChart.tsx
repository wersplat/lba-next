'use client'

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface StatChartProps {
  data: Array<Record<string, any>>;
  type: 'line' | 'bar';
  dataKey: string;
  xAxisKey: string;
  title?: string;
  color?: string;
  height?: number;
}

export default function StatChart({
  data,
  type,
  dataKey,
  xAxisKey,
  title,
  color = '#7A60A8',
  height = 300,
}: StatChartProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-theme-primary mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-theme-border" />
          <XAxis
            dataKey={xAxisKey}
            className="text-theme-muted"
            stroke="currentColor"
          />
          <YAxis className="text-theme-muted" stroke="currentColor" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px solid var(--bg-border)',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
          <Legend />
          <DataComponent
            type={type === 'line' ? 'monotone' : undefined}
            dataKey={dataKey}
            stroke={color}
            fill={type === 'bar' ? color : undefined}
            strokeWidth={2}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
}

