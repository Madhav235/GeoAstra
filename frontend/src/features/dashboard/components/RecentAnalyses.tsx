import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardAnalysis } from "../types/dashboard.types";
import {
  Activity,
  ArrowRight,
  Clock,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

export interface RecentAnalysesProps {
  analyses: DashboardAnalysis[];
}

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ analyses }) => {
  return (
    <Card variant="elevated" className="h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent-primary" />
              Recent Hyperspectral Analyses
            </CardTitle>
            <CardDescription className="text-2xs">
              Algorithmic execution lifecycle across active areas of interest
            </CardDescription>
          </div>
          <Link to="/jobs">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3 h-3" />}
              className="text-2xs font-mono"
            >
              View All Jobs
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 divide-y divide-border-subtle">
        {analyses.slice(0, 5).map((analysis) => {
          const isCompleted = analysis.status === "completed";
          const isRunning = analysis.status === "running";
          const isFailed = analysis.status === "failed";

          return (
            <div
              key={analysis.id}
              className="p-3.5 sm:p-4 hover:bg-surface-elevated/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
            >
              {/* Left Column: Analysis Info */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-content-primary hover:text-accent-primary transition-colors">
                    {analysis.name}
                  </span>
                  <Badge
                    variant={
                      isCompleted
                        ? "success"
                        : isRunning
                        ? "primary"
                        : isFailed
                        ? "danger"
                        : "warning"
                    }
                    size="sm"
                    dot={isRunning}
                  >
                    {analysis.status.toUpperCase()}
                  </Badge>
                  <span className="text-2xs font-mono px-1.5 py-0.5 rounded bg-surface-panel border border-border-subtle text-accent-primary">
                    {analysis.algorithm}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs font-mono text-content-muted">
                  <span>AOI: {analysis.aoiName}</span>
                  <span>•</span>
                  <span>Scene: {analysis.sceneName}</span>
                  {analysis.confidenceScore !== undefined && (
                    <>
                      <span>•</span>
                      <span className="text-status-warning font-semibold">
                        Score: {analysis.confidenceScore}
                      </span>
                    </>
                  )}
                  {analysis.detectionsCount !== undefined && (
                    <>
                      <span>•</span>
                      <span className="text-status-success">
                        {analysis.detectionsCount} Targets
                      </span>
                    </>
                  )}
                </div>

                {/* Progress bar for active running jobs */}
                {isRunning && analysis.progress !== undefined && (
                  <div className="pt-1 max-w-xs">
                    <div className="flex justify-between text-2xs font-mono text-content-muted mb-0.5">
                      <span>Computing Covariance...</span>
                      <span className="text-accent-primary font-bold">{analysis.progress}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-surface-panel overflow-hidden border border-border-subtle">
                      <div
                        className="h-full bg-accent-primary transition-all duration-300"
                        style={{ width: `${analysis.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Time & Actions */}
              <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                <div className="flex items-center gap-1 text-2xs font-mono text-content-muted">
                  <Clock className="w-3 h-3" />
                  <span>{analysis.createdAt}</span>
                </div>

                <div>
                  {isCompleted ? (
                    <Link to="/results">
                      <Button
                        variant="outline"
                        size="sm"
                        rightIcon={<ExternalLink className="w-3 h-3" />}
                        className="text-2xs h-7 px-2.5"
                      >
                        Inspect Results
                      </Button>
                    </Link>
                  ) : isFailed ? (
                    <Link to="/analysis/new">
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<RotateCcw className="w-3 h-3" />}
                        className="text-2xs h-7 px-2.5"
                      >
                        Reconfigure
                      </Button>
                    </Link>
                  ) : (
                    <Link to="/jobs">
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3 h-3" />}
                        className="text-2xs h-7 px-2.5 text-accent-primary"
                      >
                        View Queue
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

