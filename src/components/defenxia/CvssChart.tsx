'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { ChartTooltipContent, ChartContainer, ChartConfig } from '@/components/ui/chart';

const chartConfig = {
  value: {
    label: 'Count',
  },
  Critical: {
    label: 'Critical',
    color: 'hsl(0 100% 50%)', // red
  },
  High: {
    label: 'High',
    color: 'hsl(39 100% 50%)', // orange
  },
  Medium: {
    label: 'Medium',
    color: 'hsl(210 100% 50%)', // blue
  },
  Low: {
    label: 'Low',
    color: 'hsl(120 61% 50%)', // green
  },
  Info: {
    label: 'Info',
    color: 'hsl(var(--muted-foreground))',
  },
} satisfies ChartConfig;

const getFillColor = (name: string) => {
  switch (name) {
    case 'Critical': return 'url(#colorCritical)';
    case 'High': return 'url(#colorHigh)';
    case 'Medium': return 'url(#colorMedium)';
    case 'Low': return 'url(#colorLow)';
    case 'Info': return 'url(#colorInfo)';
    default: return 'var(--color-value)';
  }
}

export default function CvssChart({ data }: { data: { name: string; value: number }[] }) {
  
  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
            <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartConfig.Critical.color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={chartConfig.Critical.color} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartConfig.High.color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={chartConfig.High.color} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartConfig.Medium.color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={chartConfig.Medium.color} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartConfig.Low.color} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={chartConfig.Low.color} stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="colorInfo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(210 100% 50%)" />
                <stop offset="25%" stopColor="hsl(0 100% 50%)" />
                <stop offset="50%" stopColor="hsl(39 100% 50%)" />
                <stop offset="100%" stopColor="hsl(120 61% 50%)" />
            </linearGradient>
        </defs>
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            allowDecimals={false}
          />
           <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="value" radius={4}>
            {data.map((entry) => (
                <Cell key={entry.name} fill={getFillColor(entry.name)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
