import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardScene } from "../types/dashboard.types";
import { Layers, ArrowRight, Eye, Calendar } from "lucide-react";

export interface RecentScenesProps {
  scenes: DashboardScene[];
}

export const RecentScenes: React.FC<RecentScenesProps> = ({ scenes }) => {
  return (
    <Card variant="elevated" className="h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Layers className="w-4 h-4 text-accent-primary" />
              Recent Satellite Datacubes
            </CardTitle>
            <CardDescription className="text-2xs">
              Calibrated multi-band rasters available for algorithmic ingestion
            </CardDescription>
          </div>
          <Link to="/scenes">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3 h-3" />}
              className="text-2xs font-mono"
            >
              View All Scenes
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 divide-y divide-border-subtle">
        {scenes.slice(0, 4).map((scene) => (
          <div
            key={scene.id}
            className="p-3.5 hover:bg-surface-elevated/40 transition-colors flex items-center justify-between gap-3 text-left"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-content-primary truncate">
                  {scene.name}
                </span>
                {scene.isBenchmark && (
                  <Badge variant="primary" size="sm" className="text-[10px]">
                    BENCHMARK
                  </Badge>
                )}
                <Badge variant={scene.status === "Calibrated" ? "success" : "outline"} size="sm" className="text-[10px]">
                  {scene.status}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-2xs font-mono text-content-muted">
                <span className="text-content-secondary font-medium">{scene.satellite}</span>
                <span>•</span>
                <span className="text-accent-primary">{scene.bandsCount} bands</span>
                <span>•</span>
                <span>{scene.spatialResolution}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {scene.acquisitionDate}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Link to="/workspace">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Eye className="w-3 h-3 text-content-secondary" />}
                  className="text-2xs h-7 px-2.5"
                >
                  Inspect
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

