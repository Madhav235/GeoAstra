import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SystemServiceNode } from "../types/dashboard.types";
import {
  Server,
  AlertTriangle,
  ArrowRight,
  Info,
} from "lucide-react";

export interface SystemStatusProps {
  services: SystemServiceNode[];
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ services }) => {
  return (
    <Card variant="elevated" className="h-full flex flex-col justify-between">
      <CardHeader className="pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Server className="w-4 h-4 text-accent-primary" />
              Service Architecture Status
            </CardTitle>
            <CardDescription className="text-2xs">
              Microservice topology &amp; operational endpoints
            </CardDescription>
          </div>
          <Badge variant="warning" size="sm" dot>
            MOCK TELEMETRY
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 space-y-3 flex-1 flex flex-col justify-between text-left">
        {/* Mock Notification Callout */}
        <div className="p-2.5 rounded bg-status-warning/10 border border-status-warning/30 flex items-start gap-2 text-2xs text-content-secondary">
          <AlertTriangle className="w-3.5 h-3.5 text-status-warning shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-status-warning font-semibold">Demo Workstation Mode:</strong> Services below display targeted architectural ports. Real-time diagnostic pings will be wired during backend integration.
          </p>
        </div>

        {/* 4 Service Nodes */}
        <div className="space-y-2">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-2.5 rounded bg-surface-secondary/50 border border-border-subtle flex items-center justify-between gap-3 text-2xs font-mono"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-content-primary">
                    {service.name}
                  </span>
                  <span className="text-content-muted text-[10px]">
                    :{service.port}
                  </span>
                </div>
                <p className="text-[10px] text-content-muted truncate">
                  {service.stack}
                </p>
              </div>

              <div className="shrink-0">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-panel border border-border-subtle text-status-warning">
                  {service.statusLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="pt-2 border-t border-border-subtle flex items-center justify-between">
          <span className="text-2xs font-mono text-content-muted flex items-center gap-1">
            <Info className="w-3 h-3" /> 4 of 4 nodes mapped
          </span>
          <Link to="/status">
            <Button
              variant="ghost"
              size="sm"
              rightIcon={<ArrowRight className="w-3 h-3" />}
              className="text-2xs h-7 px-2"
            >
              System Topology Map
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

