import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";

interface JobItem {
  id: string;
  algorithm: string;
  sceneName: string;
  status: "running" | "queued" | "completed" | "failed";
  progress: number;
  duration: string;
  workerNode: string;
  timestamp: string;
  detectionCount?: number;
}

const SAMPLE_JOBS: JobItem[] = [
  {
    id: "job_rxd_8841a",
    algorithm: "RXD Anomaly Detection",
    sceneName: "AVIRIS_NG_PERMIAN_2024_03A",
    status: "running",
    progress: 74,
    duration: "42s elapsed",
    workerNode: "worker-gpu-01 (NVIDIA A100)",
    timestamp: "2 mins ago",
  },
  {
    id: "job_mf_9012c",
    algorithm: "Matched Filter (Methane)",
    sceneName: "PRISMA_GULF_COAST_L2D_901",
    status: "queued",
    progress: 0,
    duration: "Pending...",
    workerNode: "Queue Position #1",
    timestamp: "5 mins ago",
  },
  {
    id: "job_cem_7749b",
    algorithm: "CEM Target Detection (CH4)",
    sceneName: "AVIRIS_NG_PERMIAN_2024_03A",
    status: "completed",
    progress: 100,
    duration: "1m 18s",
    workerNode: "worker-gpu-02",
    timestamp: "28 mins ago",
    detectionCount: 18,
  },
  {
    id: "job_fusion_3310",
    algorithm: "Spectral-Spatial Fusion",
    sceneName: "EMIT_ALGERIA_MINERAL_22",
    status: "completed",
    progress: 100,
    duration: "2m 04s",
    workerNode: "worker-gpu-01",
    timestamp: "3 hours ago",
    detectionCount: 34,
  },
  {
    id: "job_rxd_6621f",
    algorithm: "RXD Outlier Search",
    sceneName: "ENMAP_SALAR_ATACAMA_04",
    status: "failed",
    progress: 41,
    duration: "22s",
    workerNode: "worker-gpu-03",
    timestamp: "Yesterday",
  },
];

export const JobsPage: React.FC = () => {
  const [filter, setFilter] = useState<"all" | "running" | "completed" | "failed">("all");

  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    if (filter === "all") return true;
    return job.status === filter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        category="PIPELINE ORCHESTRATION"
        title="Asynchronous Processing Jobs & Queue"
        subtitle="Monitor distributed execution across BullMQ queues, worker threads, and Python AI Engine compute nodes."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md" dot>
              SAMPLE PROCESSING QUEUE
            </Badge>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-3 rounded-lg border border-status-warning/30 bg-status-warning/10 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span className="text-content-secondary">
            <strong className="text-status-warning font-semibold">Illustrative Task Queue:</strong> The job records and progress meters below represent BullMQ and Redis orchestration state verified in the backend audit. Live cluster polling is disconnected in demo workstation mode.
          </span>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="default">
          <CardHeader className="pb-2">
            <CardDescription className="text-2xs font-mono uppercase tracking-wider">
              Running Jobs
            </CardDescription>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-xl font-bold font-mono text-accent-primary">1</CardTitle>
              <span className="text-2xs text-content-muted">GPU node active</span>
            </div>
          </CardHeader>
        </Card>

        <Card variant="default">
          <CardHeader className="pb-2">
            <CardDescription className="text-2xs font-mono uppercase tracking-wider">
              Queued Jobs
            </CardDescription>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-xl font-bold font-mono text-status-warning">1</CardTitle>
              <span className="text-2xs text-content-muted">In BullMQ queue</span>
            </div>
          </CardHeader>
        </Card>

        <Card variant="default">
          <CardHeader className="pb-2">
            <CardDescription className="text-2xs font-mono uppercase tracking-wider">
              Completed
            </CardDescription>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-xl font-bold font-mono text-status-success">148</CardTitle>
              <span className="text-2xs text-content-muted">98.6% success</span>
            </div>
          </CardHeader>
        </Card>

        <Card variant="default">
          <CardHeader className="pb-2">
            <CardDescription className="text-2xs font-mono uppercase tracking-wider">
              Failed / Retried
            </CardDescription>
            <div className="flex items-baseline gap-2 mt-1">
              <CardTitle className="text-xl font-bold font-mono text-status-danger">2</CardTitle>
              <span className="text-2xs text-content-muted">Memory ceiling</span>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Filter Tabs & Job Queue Table */}
      <Card variant="elevated">
        <CardHeader className="pb-3 border-b border-border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xs">Processing Lifecycle Queue</CardTitle>
              <CardDescription className="text-2xs">
                Asynchronous task tracking for high-dimensional tensor operations
              </CardDescription>
            </div>
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-surface-secondary/60 p-1 rounded-lg border border-border-subtle">
              {(["all", "running", "completed", "failed"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-2.5 py-1 rounded text-2xs font-mono uppercase tracking-wider transition-colors ${
                    filter === tab
                      ? "bg-surface-elevated text-accent-primary font-semibold shadow-sm"
                      : "text-content-muted hover:text-content-primary"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border-subtle">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-elevated/30 transition-colors"
            >
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-content-primary">
                    {job.id}
                  </span>
                  <Badge
                    variant={
                      job.status === "running"
                        ? "primary"
                        : job.status === "completed"
                        ? "success"
                        : job.status === "failed"
                        ? "danger"
                        : "warning"
                    }
                    size="sm"
                    dot={job.status === "running"}
                  >
                    {job.status.toUpperCase()}
                  </Badge>
                  <span className="text-2xs font-mono text-content-secondary">
                    {job.algorithm}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-2xs font-mono text-content-muted">
                  <span>Scene: {job.sceneName}</span>
                  <span>•</span>
                  <span>{job.workerNode}</span>
                  <span>•</span>
                  <span>{job.duration}</span>
                </div>

                {/* Progress bar for running jobs */}
                {job.status === "running" && (
                  <div className="pt-1.5 max-w-md">
                    <div className="flex justify-between text-2xs font-mono text-content-muted mb-1">
                      <span>Tensor Covariance Inversion</span>
                      <span className="text-accent-primary font-bold">{job.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-panel overflow-hidden border border-border-subtle">
                      <div
                        className="h-full bg-accent-primary rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {job.status === "completed" && (
                  <Link to="/results">
                    <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Results
                    </Button>
                  </Link>
                )}
                {job.status === "failed" && (
                  <Button variant="outline" size="sm" leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                    Retry Job
                  </Button>
                )}
                {job.status === "running" && (
                  <Button variant="ghost" size="sm" disabled>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-accent-primary mr-1" /> Processing
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
