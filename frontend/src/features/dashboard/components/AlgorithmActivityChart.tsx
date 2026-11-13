import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AlgorithmDistribution } from "../types/dashboard.types";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Cpu } from "lucide-react";

export interface AlgorithmActivityChartProps {
  data: AlgorithmDistribution[];
}

export const AlgorithmActivityChart: React.FC<AlgorithmActivityChartProps> = ({ data }) => {
  const totalAnalyses = data.reduce((sum, item) => sum + item.count, 0);

  // Custom Dark Workstation Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as AlgorithmDistribution;
      return (
        <div className="p-2.5 rounded-lg bg-surface-elevated border border-border-strong shadow-xl text-left text-2xs font-mono space-y-1">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="font-bold text-content-primary">{item.fullName}</span>
          </div>
          <div className="text-content-secondary">
            Analyses: <span className="text-accent-primary font-bold">{item.count}</span> ({item.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="elevated" className="h-full flex flex-col justify-between">
      <CardHeader className="pb-2 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 text-left">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-accent-primary" />
              Algorithm Utilization Distribution
            </CardTitle>
            <CardDescription className="text-2xs">
              Relative execution volume across 4 mathematical detection operators
            </CardDescription>
          </div>
          <Badge variant="outline" size="sm" className="font-mono">
            {totalAnalyses} TOTAL RUNS
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Recharts Bar Chart Container */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis
                type="number"
                domain={[0, 70]}
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94A3B8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.03)" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.id} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Summary Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border-subtle text-left">
          {data.map((algo) => (
            <div
              key={algo.id}
              className="p-2 rounded bg-surface-secondary/40 border border-border-subtle/80 space-y-0.5 text-2xs font-mono"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: algo.color }}
                />
                <span className="font-semibold text-content-primary">{algo.name}</span>
              </div>
              <div className="flex justify-between text-content-muted">
                <span>{algo.count} runs</span>
                <span className="text-content-secondary font-bold">{algo.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

