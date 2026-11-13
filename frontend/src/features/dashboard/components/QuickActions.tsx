import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import {
  Activity,
  Compass,
  Layers,
  Sparkles,
  Clock,
  BarChart3,
  ArrowRight,
  Zap,
} from "lucide-react";

interface QuickActionItem {
  id: string;
  title: string;
  description: string;
  to: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const QUICK_ACTIONS: QuickActionItem[] = [
  {
    id: "action-analysis",
    title: "New Analysis",
    description: "Launch RXD, Matched Filter, CEM or Fusion detection workflows",
    to: "/analysis/new",
    icon: Activity,
    iconColor: "text-accent-primary",
    iconBg: "bg-accent-primary/10 border-accent-primary/20",
  },
  {
    id: "action-workspace",
    title: "Geospatial Studio",
    description: "Interactive multi-band raster inspection and false-color composites",
    to: "/workspace",
    icon: Compass,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    id: "action-scenes",
    title: "Explore Satellite Scenes",
    description: "Browse ingested airborne and spaceborne hyperspectral datacubes",
    to: "/scenes",
    icon: Layers,
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/10 border-sky-500/20",
  },
  {
    id: "action-signatures",
    title: "Spectral Library",
    description: "Reference laboratory reflectance curves (400 – 2500 nm)",
    to: "/signatures",
    icon: Sparkles,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "action-jobs",
    title: "View Processing Jobs",
    description: "Monitor asynchronous BullMQ worker queues and progress",
    to: "/jobs",
    icon: Clock,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "action-results",
    title: "Explore Results",
    description: "Evaluate detection confidence heatmaps and statistical ROC curves",
    to: "/results",
    icon: BarChart3,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10 border-rose-500/20",
  },
];

export const QuickActions: React.FC = () => {
  return (
    <Card variant="elevated">
      <CardHeader className="pb-3 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5 text-left">
            <CardTitle className="text-xs font-semibold flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent-primary" />
              Operational Quick Actions
            </CardTitle>
            <CardDescription className="text-2xs">
              Fast navigation shortcuts across primary analytical modules
            </CardDescription>
          </div>
          <span className="text-2xs font-mono text-content-muted">
            6 WORKSPACES
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-3.5 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.id}
                to={action.to}
                className="group block p-3 rounded-lg bg-surface-secondary/50 border border-border-subtle hover:border-accent-primary/40 hover:bg-surface-elevated transition-all duration-200 select-none text-left"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${action.iconBg} ${action.iconColor}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-semibold text-content-primary group-hover:text-accent-primary transition-colors truncate">
                        {action.title}
                      </h4>
                      <p className="text-2xs text-content-muted line-clamp-2 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-content-muted group-hover:text-accent-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

