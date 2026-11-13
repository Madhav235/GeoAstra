import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DailyDetectionData } from "../types/dashboard.types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Flame, TrendingUp } from "lucide-react";

export interface DetectionActivityChartProps {
  data: DailyDetectionData[];
}

export const DetectionActivityChart: React.FC<DetectionActivityChartProps> = ({ data }) => {
  const total7DayDetections = data.reduce((sum, item) => sum + item.detections, 0);

  // Custom Dark Workstation Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as DailyDetectionData;
      return (
        <div className="p-2.5 rounded-lg bg-surface-elevated border border-border-strong shadow-xl text-left text-2xs font-mono space-y-1">
          <div className="font-semibold text-content-primary">
            {label} ({item.date})
          </div>
          <div className="text-status-warning flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-status-warning" />
            <span>Detections: <strong>{item.detections}</strong></span>
          </div>
          <div className="text-accent-primary flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent-primary" />
            <span>High-Priority Hotspots: <strong>{item.hotspots}</strong></span>
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
              <Flame className="w-4 h-4 text-status-warning" />
              7-Day Detection Activity Trend
            </CardTitle>
            <CardDescription className="text-2xs">
              Daily target anomalies and verified spectral hotspots
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="sm" className="font-mono">
              <TrendingUp className="w-3 h-3 mr-1 inline" />
              {total7DayDetections} DETECTIONS
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Recharts Area Chart Container */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="detectionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="hotspotGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1E293B"
                vertical={false}
              />

              <XAxis
                dataKey="dayLabel"
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748B"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, "auto"]}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="detections"
                stroke="#F59E0B"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#detectionGradient)"
              />
              <Area
                type="monotone"
                dataKey="hotspots"
                stroke="#38BDF8"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#hotspotGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 border-t border-border-subtle text-2xs font-mono text-content-muted">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-status-warning rounded-full" />
              <span>Target Detections</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-1 bg-accent-primary rounded-full" />
              <span>Verified Hotspots (&gt; 0.85)</span>
            </span>
          </div>
          <span>Peak: 41 detections (Today)</span>
        </div>
      </CardContent>
    </Card>
  );
};

