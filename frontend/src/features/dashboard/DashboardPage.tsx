import React from "react";
import { getDashboardData } from "./data/dashboardMockData";
import { WelcomeSection } from "./components/WelcomeSection";
import { MetricCard } from "./components/MetricCard";
import { RecentAnalyses } from "./components/RecentAnalyses";
import { RecentAOIs } from "./components/RecentAOIs";
import { RecentScenes } from "./components/RecentScenes";
import { SystemStatus } from "./components/SystemStatus";
import { AlgorithmActivityChart } from "./components/AlgorithmActivityChart";
import { DetectionActivityChart } from "./components/DetectionActivityChart";
import { QuickActions } from "./components/QuickActions";
import {
  Layers,
  MapPin,
  Activity,
  Flame,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const data = getDashboardData();
  const { metrics } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Row 1: Personalized Welcome & Mission Overview */}
      <WelcomeSection />

      {/* Demo Notification Banner */}
      <div className="p-3.5 rounded-lg border border-status-warning/30 bg-status-warning/10 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span className="text-content-secondary">
            <strong className="text-status-warning font-semibold">Mission Telemetry Preview:</strong> The metric indicators, scene records, and detection analytics below represent curated sample dataset analytics. Live backend services are not connected.
          </span>
        </div>
        <Link to="/status">
          <span className="text-status-warning hover:underline font-mono text-2xs uppercase tracking-wider shrink-0">
            View Architecture Map &rarr;
          </span>
        </Link>
      </div>

      {/* Row 2: Four Primary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Satellite Scenes */}
        <MetricCard
          title="Satellite Scenes"
          value={metrics.totalScenes}
          subtitle="AVIRIS-NG, PRISMA, EnMAP, EMIT cubes"
          badgeText={`+${metrics.newScenesThisWeek} this week`}
          badgeVariant="success"
          icon={Layers}
          iconColorClass="text-accent-primary"
          iconBgClass="bg-accent-primary/10 border-accent-primary/20"
          to="/scenes"
        />

        {/* Card 2: Areas of Interest */}
        <MetricCard
          title="Areas of Interest"
          value={metrics.totalAOIs}
          subtitle="Delaware Basin, Atacama, Gulf, Hoggar"
          badgeText={`+${metrics.newAOIsThisMonth} this month`}
          badgeVariant="primary"
          icon={MapPin}
          iconColorClass="text-indigo-400"
          iconBgClass="bg-indigo-500/10 border-indigo-500/20"
          to="/workspace"
        />

        {/* Card 3: Hyperspectral Analyses */}
        <MetricCard
          title="Analyses Run"
          value={metrics.totalAnalyses}
          subtitle={`${metrics.completedAnalyses} completed • ${metrics.activeAnalyses} active in queue`}
          badgeText={`${metrics.activeAnalyses} Active In Queue`}
          badgeVariant="warning"
          icon={Activity}
          iconColorClass="text-sky-400"
          iconBgClass="bg-sky-500/10 border-sky-500/20"
          to="/jobs"
        />

        {/* Card 4: Detections */}
        <MetricCard
          title="Target Detections"
          value={metrics.totalDetections}
          subtitle="Confidence score threshold &gt; 0.85"
          badgeText={`+${metrics.recentDetections} today`}
          badgeVariant="success"
          icon={Flame}
          iconColorClass="text-amber-400"
          iconBgClass="bg-amber-500/10 border-amber-500/20"
          to="/results"
        />
      </div>

      {/* Row 3: Recent Analyses (8 cols) & System Status (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8">
          <RecentAnalyses analyses={data.recentAnalyses} />
        </div>
        <div className="lg:col-span-4">
          <SystemStatus services={data.systemStatus} />
        </div>
      </div>

      {/* Row 4: Algorithm Activity Chart (6 cols) & Detection Activity Chart (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <AlgorithmActivityChart data={data.algorithmActivity} />
        </div>
        <div className="lg:col-span-6">
          <DetectionActivityChart data={data.detectionActivity} />
        </div>
      </div>

      {/* Row 5: Recent AOIs (6 cols) & Recent Satellite Scenes (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6">
          <RecentAOIs aois={data.recentAOIs} />
        </div>
        <div className="lg:col-span-6">
          <RecentScenes scenes={data.recentScenes} />
        </div>
      </div>

      {/* Row 6: Dedicated Operational Quick Actions */}
      <QuickActions />
    </div>
  );
};
