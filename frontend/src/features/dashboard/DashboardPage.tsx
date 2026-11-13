import React from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Layers,
  Activity,
  Flame,
  Compass,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  BarChart3,
  FileText,
  AlertTriangle,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        category="WORKSPACE INTELLIGENCE"
        title="Mission Intelligence Dashboard"
        subtitle="Operational overview of calibrated hyperspectral acquisitions, detection workloads, target signatures, and system readiness."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md" dot>
              SAMPLE DATA PREVIEW
            </Badge>
            <Link to="/workspace">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Open Studio
              </Button>
            </Link>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-3.5 rounded-lg border border-status-warning/30 bg-status-warning/10 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span className="text-content-secondary">
            <strong className="text-status-warning font-semibold">Demo Environment Active:</strong> The metrics, telemetry feed, and scene logs shown below represent curated sample dataset analytics. Live backend services are not connected.
          </span>
        </div>
        <Link to="/status">
          <span className="text-status-warning hover:underline font-mono text-2xs uppercase tracking-wider shrink-0">
            View Architecture Map &rarr;
          </span>
        </Link>
      </div>

      {/* KPI Metric Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card variant="default">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-2xs uppercase tracking-wider font-mono">
                Indexed Scenes
              </CardDescription>
              <div className="w-7 h-7 rounded bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-2xl font-bold font-mono">28</CardTitle>
              <span className="text-2xs text-status-success font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +4 this month
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xs text-content-muted">
              AVIRIS-NG, PRISMA, EnMAP, EMIT cubes
            </p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card variant="default">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-2xs uppercase tracking-wider font-mono">
                Spectral Signatures
              </CardDescription>
              <div className="w-7 h-7 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-2xl font-bold font-mono">42</CardTitle>
              <span className="text-2xs text-content-secondary font-mono">
                400–2500 nm
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xs text-content-muted">
              Hydrocarbons, minerals, vegetation
            </p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card variant="default">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-2xs uppercase tracking-wider font-mono">
                Detection Jobs Run
              </CardDescription>
              <div className="w-7 h-7 rounded bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-2xl font-bold font-mono">156</CardTitle>
              <span className="text-2xs text-status-success font-medium">
                98.7% success
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xs text-content-muted">
              RXD, Matched Filter, CEM algorithms
            </p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card variant="default">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-2xs uppercase tracking-wider font-mono">
                Target Hotspots
              </CardDescription>
              <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Flame className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-2xl font-bold font-mono">18</CardTitle>
              <span className="text-2xs text-status-warning font-mono">
                3 high priority
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-2xs text-content-muted">
              Confidence score &gt; 0.85
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Workspace Shortcuts & Mission Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Launch Workspaces */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-content-secondary">
              Workspace Modules
            </h2>
            <Badge variant="outline" size="sm">
              SAMPLE WORKSPACE
            </Badge>
          </div>

          <div className="space-y-3">
            <Link to="/workspace" className="block group">
              <Card
                variant="elevated"
                className="group-hover:border-accent-primary/50 transition-all duration-200"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary group-hover:scale-105 transition-transform">
                      <Compass className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-content-primary group-hover:text-accent-primary transition-colors">
                        Geospatial Studio
                      </h3>
                      <p className="text-2xs text-content-muted">
                        Interactive raster inspection &amp; multi-band composites
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-content-muted group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/analysis/new" className="block group">
              <Card
                variant="elevated"
                className="group-hover:border-accent-primary/50 transition-all duration-200"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-content-primary group-hover:text-accent-primary transition-colors">
                        Analysis Studio
                      </h3>
                      <p className="text-2xs text-content-muted">
                        RXD, Matched Filter, CEM &amp; Fusion detection setup
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-content-muted group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/signatures" className="block group">
              <Card
                variant="elevated"
                className="group-hover:border-accent-primary/50 transition-all duration-200"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-content-primary group-hover:text-accent-primary transition-colors">
                        Spectral Library
                      </h3>
                      <p className="text-2xs text-content-muted">
                        USGS laboratory &amp; field reference signatures
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-content-muted group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all" />
                </CardContent>
              </Card>
            </Link>

            <Link to="/results" className="block group">
              <Card
                variant="elevated"
                className="group-hover:border-accent-primary/50 transition-all duration-200"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-content-primary group-hover:text-accent-primary transition-colors">
                        Results Explorer
                      </h3>
                      <p className="text-2xs text-content-muted">
                        Detection heatmaps, ROC curves &amp; target verification
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-content-muted group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right 2 Columns: Illustrative Activity Feed & Detection Log */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-content-secondary">
              Recent Activity Feed (Sample Data)
            </h2>
            <Link to="/jobs">
              <span className="text-2xs text-accent-primary hover:underline font-mono">
                View all jobs &rarr;
              </span>
            </Link>
          </div>

          <Card variant="elevated">
            <CardHeader className="pb-3 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xs">Illustrative Mission Telemetry</CardTitle>
                  <CardDescription className="text-2xs">
                    Demonstration log of raster ingestion and algorithmic detection events
                  </CardDescription>
                </div>
                <Badge variant="outline" size="sm">
                  SAMPLE LOG
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-border-subtle">
              {/* Sample Log Item 1 */}
              <div className="p-3.5 flex items-start gap-3 hover:bg-surface-elevated/40 transition-colors">
                <div className="w-7 h-7 rounded bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center text-accent-primary shrink-0 mt-0.5">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-content-primary truncate">
                      CEM Target Detection: AVIRIS_NG_PERMIAN_2024
                    </span>
                    <Badge variant="success" size="sm">
                      CONFIRMED (0.942)
                    </Badge>
                  </div>
                  <p className="text-2xs text-content-secondary mt-0.5">
                    Target: Methane Absorption SWIR (1660 nm) • 425 bands processed in 1m 18s
                  </p>
                  <div className="flex items-center gap-3 text-2xs font-mono text-content-muted mt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 28 mins ago
                    </span>
                    <span>Lat: 31.9686° N, Lon: 102.0988° W</span>
                  </div>
                </div>
              </div>

              {/* Sample Log Item 2 */}
              <div className="p-3.5 flex items-start gap-3 hover:bg-surface-elevated/40 transition-colors">
                <div className="w-7 h-7 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-content-primary truncate">
                      Datacube Ingestion: ENMAP_SALAR_ATACAMA_04
                    </span>
                    <Badge variant="primary" size="sm">
                      INDEXED
                    </Badge>
                  </div>
                  <p className="text-2xs text-content-secondary mt-0.5">
                    DLR EnMAP Hyperspectral Cube • 242 spectral bands (420–2450 nm), 30m GSD
                  </p>
                  <div className="flex items-center gap-3 text-2xs font-mono text-content-muted mt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2 hours ago
                    </span>
                    <span>Lithium &amp; Borate signatures registered</span>
                  </div>
                </div>
              </div>

              {/* Sample Log Item 3 */}
              <div className="p-3.5 flex items-start gap-3 hover:bg-surface-elevated/40 transition-colors">
                <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Flame className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-content-primary truncate">
                      RXD Spectral Outlier Analysis: PRISMA_GULF_COAST_L2D
                    </span>
                    <Badge variant="warning" size="sm">
                      14 OUTLIERS
                    </Badge>
                  </div>
                  <p className="text-2xs text-content-secondary mt-0.5">
                    Global covariance anomaly score &gt; 3.5 &sigma; • Marine petroleum sheen candidate
                  </p>
                  <div className="flex items-center gap-3 text-2xs font-mono text-content-muted mt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Yesterday at 18:40
                    </span>
                    <span>Report #GEOASTRA-REP-0031 generated</span>
                  </div>
                </div>
              </div>

              {/* Sample Log Item 4 */}
              <div className="p-3.5 flex items-start gap-3 hover:bg-surface-elevated/40 transition-colors">
                <div className="w-7 h-7 rounded bg-surface-secondary border border-border-subtle flex items-center justify-center text-content-secondary shrink-0 mt-0.5">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-content-primary truncate">
                      Dossier Export: Permian Basin Methane Emission Audit
                    </span>
                    <Badge variant="outline" size="sm">
                      ARCHIVED
                    </Badge>
                  </div>
                  <p className="text-2xs text-content-secondary mt-0.5">
                    Formal intelligence report compiled with ROC curves &amp; GeoTIFF overlays
                  </p>
                  <div className="flex items-center gap-3 text-2xs font-mono text-content-muted mt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 2 days ago
                    </span>
                    <span>Lead Analyst: Alex Mercer</span>
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

