import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardAOI } from "../types/dashboard.types";
import { MapPin, ArrowRight, Compass, Globe } from "lucide-react";

export interface RecentAOIsProps {
  aois: DashboardAOI[];
}

export const RecentAOIs: React.FC<RecentAOIsProps> = ({ aois }) => {
  return (
    <Card variant="elevated" className="h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent-primary" />
              Saved Areas of Interest (AOIs)
            </CardTitle>
            <CardDescription className="text-2xs">
              Bounded spatial regions monitored for anomaly signatures
            </CardDescription>
          </div>
          <Link to="/workspace">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3 h-3" />}
              className="text-2xs font-mono"
            >
              Open Studio
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 divide-y divide-border-subtle">
        {aois.slice(0, 4).map((aoi) => (
          <div
            key={aoi.id}
            className="p-3.5 hover:bg-surface-elevated/40 transition-colors flex items-center justify-between gap-3 text-left"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-content-primary truncate">
                  {aoi.name}
                </span>
                <Badge variant="outline" size="sm" className="font-mono text-[10px]">
                  {aoi.areaKm2} km²
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-2xs font-mono text-content-muted">
                <span className="flex items-center gap-1 text-content-secondary">
                  <Globe className="w-3 h-3 text-content-muted" />
                  {aoi.location}
                </span>
                <span>•</span>
                <span>CRS: {aoi.crs}</span>
              </div>
            </div>

            <div className="shrink-0">
              <Link to="/workspace">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Compass className="w-3 h-3 text-accent-primary" />}
                  className="text-2xs h-7 px-2.5"
                >
                  Locate
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

