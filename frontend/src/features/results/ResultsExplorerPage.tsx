import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  BarChart3,
  Flame,
  Crosshair,
  AlertTriangle,
  FileText,
} from "lucide-react";

export const ResultsExplorerPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        category="DETECTION ANALYTICS"
        title="Target Detection Results & Performance Analytics"
        subtitle="Evaluate detection confidence maps, spatial anomaly clusters, and statistical Receiver Operating Characteristic (ROC) curves."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md" dot>
              SAMPLE DETECTION METRICS
            </Badge>
            <Link to="/reports">
              <Button variant="outline" size="sm" rightIcon={<FileText className="w-3.5 h-3.5" />}>
                Export Dossier
              </Button>
            </Link>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-3 rounded-lg border border-status-warning/30 bg-status-warning/10 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span className="text-content-secondary">
            <strong className="text-status-warning font-semibold">Verification Analytics Preview:</strong> Detection outputs, heatmaps, and ROC curves below represent sample mission evaluation data for Permian Basin scene AVIRIS_NG_PERMIAN_2024_03A.
          </span>
        </div>
      </div>

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="default">
          <CardHeader className="pb-2">
            <CardDescription className="text-2xs font-mono uppercase tracking-wider">
              Peak Match Score
            </CardDescription>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-2xl font-bold font-mono text-status-warning">0.964</CardTitle>
              <span className="text-2xs text-status-success font-semibold">CEM Unity</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xs text-content-muted">Target: Methane Absorption</p>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader className="pb-2">
            <CardDescription className="text-2xs font-mono uppercase tracking-wider">
              Target Hotspots
            </CardDescription>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-2xl font-bold font-mono text-content-primary">18</CardTitle>
              <span className="text-2xs text-status-warning font-mono">3 critical</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xs text-content-muted">Clusters above &tau; = 0.85</p>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader className="pb-2">
            <CardDescription className="text-2xs font-mono uppercase tracking-wider">
              Plume Footprint
            </CardDescription>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-2xl font-bold font-mono text-content-primary">1.42 km²</CardTitle>
              <span className="text-2xs text-content-muted font-mono">98,400 m² core</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xs text-content-muted">Downwind dispersion area</p>
          </CardContent>
        </Card>

        <Card variant="default">
          <CardHeader className="pb-2">
            <CardDescription className="text-2xs font-mono uppercase tracking-wider">
              False Alarm Rate (PFA)
            </CardDescription>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-2xl font-bold font-mono text-status-success">1.2 × 10⁻⁴</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xs text-content-muted">Background clutter suppression</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Heatmap Preview Area & ROC Performance Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Heatmap Confidence Grid (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <Card variant="elevated" className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xs flex items-center gap-2">
                    <Flame className="w-3.5 h-3.5 text-status-warning" />
                    Detection Heatmap Preview
                  </CardTitle>
                  <CardDescription className="text-2xs">
                    CEM Confidence Heatmap Overlay: AVIRIS_NG_PERMIAN_2024
                  </CardDescription>
                </div>
                <Badge variant="warning" size="sm">
                  SAMPLE RASTER
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
              {/* Simulated 2D Confidence Heatmap Canvas */}
              <div className="relative h-64 w-full rounded-lg bg-[#080D18] border border-border-subtle overflow-hidden flex items-center justify-center">
                {/* Tech Grid */}
                <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

                {/* Heatmap Gradients (Plume Simulation) */}
                <div className="absolute w-44 h-24 rounded-full bg-gradient-to-r from-amber-500/80 via-red-500/60 to-purple-800/40 blur-xl transform -rotate-12" />
                <div className="absolute w-20 h-14 rounded-full bg-yellow-300/90 blur-md transform -rotate-6" />

                {/* Hotspot Target Crosshair */}
                <div className="relative z-10 p-3 rounded bg-surface-secondary/90 border border-status-warning/70 backdrop-blur-sm text-center">
                  <div className="flex items-center gap-1.5 text-2xs font-mono text-status-warning font-semibold">
                    <Crosshair className="w-3 h-3" /> HOTSPOT #1
                  </div>
                  <span className="text-[11px] font-mono text-content-primary block mt-0.5">
                    Lat: 31.9686°N • Lon: 102.0988°W
                  </span>
                  <span className="text-[10px] font-mono text-accent-primary">
                    Confidence: 0.964 (&gt; 3.8 &sigma;)
                  </span>
                </div>

                {/* Coordinate Grid Labels */}
                <div className="absolute top-2 left-2 text-[9px] font-mono text-content-muted">
                  Y: 1420 px
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] font-mono text-content-muted">
                  X: 894 px
                </div>
              </div>

              {/* Heatmap Legend Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-2xs font-mono text-content-muted">
                  <span>0.00 (Background Clutter)</span>
                  <span className="text-status-warning font-semibold">Threshold &tau; = 0.85</span>
                  <span className="text-status-success font-semibold">1.00 (Pure Target)</span>
                </div>
                <div className="w-full h-2 rounded bg-gradient-to-r from-blue-900 via-emerald-600 via-amber-500 to-red-500 border border-border-subtle" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: ROC Performance Curve (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <Card variant="elevated" className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xs flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-accent-primary" />
                    Receiver Operating Characteristic (ROC)
                  </CardTitle>
                  <CardDescription className="text-2xs">
                    Probability of Detection (PD) vs False Alarm Rate (PFA)
                  </CardDescription>
                </div>
                <Badge variant="outline" size="sm">
                  ROC CHART
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-4">
              {/* SVG ROC Plot */}
              <div className="h-64 w-full rounded-lg bg-surface-panel/80 border border-border-subtle p-3 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-tech-grid opacity-15 pointer-events-none" />

                {/* Y-axis label */}
                <div className="relative z-10 flex justify-between text-2xs font-mono text-content-muted">
                  <span className="text-accent-primary font-semibold">P_D (Detection Rate)</span>
                  <span>1.0</span>
                </div>

                {/* SVG Curve Canvas */}
                <div className="relative flex-1 py-1">
                  <svg
                    viewBox="0 0 240 100"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    {/* Diagonal random chance line */}
                    <line x1="0" y1="100" x2="240" y2="0" stroke="#334155" strokeWidth="1" strokeDasharray="3,3" />

                    {/* RXD curve (sky blue) */}
                    <path
                      d="M 0 100 Q 20 25, 240 0"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />

                    {/* Matched Filter curve (indigo) */}
                    <path
                      d="M 0 100 Q 12 15, 240 0"
                      fill="none"
                      stroke="#818CF8"
                      strokeWidth="2"
                    />

                    {/* CEM curve (amber - best) */}
                    <path
                      d="M 0 100 Q 6 5, 240 0"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>

                {/* X-axis label */}
                <div className="relative z-10 flex justify-between text-2xs font-mono text-content-muted border-t border-border-subtle pt-1.5">
                  <span>10⁻⁵</span>
                  <span className="text-accent-primary font-semibold">P_FA (False Alarm Rate)</span>
                  <span>10⁻¹</span>
                </div>
              </div>

              {/* Area Under Curve (AUC) Comparison Legend */}
              <div className="grid grid-cols-3 gap-2 text-2xs font-mono bg-surface-secondary/40 p-2.5 rounded-lg border border-border-subtle">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <span className="text-content-primary font-semibold block">CEM</span>
                    <span className="text-content-muted">AUC: 0.982</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shrink-0" />
                  <div>
                    <span className="text-content-primary font-semibold block">MF</span>
                    <span className="text-content-muted">AUC: 0.961</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                  <div>
                    <span className="text-content-primary font-semibold block">RXD</span>
                    <span className="text-content-muted">AUC: 0.914</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
