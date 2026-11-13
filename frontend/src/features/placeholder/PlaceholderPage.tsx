import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { LucideIcon, ArrowRight, Sparkles, Terminal } from "lucide-react";

export interface PlaceholderModuleSpec {
  title: string;
  category: "WORKSPACE" | "INTELLIGENCE" | "SYSTEM";
  subtitle: string;
  icon: LucideIcon;
  badge: string;
  milestoneTarget: string;
  plannedFeatures: {
    name: string;
    description: string;
    endpoint?: string;
  }[];
}

export const PlaceholderPage: React.FC<{ spec: PlaceholderModuleSpec }> = ({
  spec,
}) => {
  const toast = useToast();
  const Icon = spec.icon;

  const handleSimulate = (featureName: string) => {
    toast.info(
      `${spec.title} Telemetry`,
      `Scheduled for integration in ${spec.milestoneTarget}. [${featureName}] verified in backend audit.`
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        category={spec.category}
        title={spec.title}
        subtitle={spec.subtitle}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="md">
              {spec.milestoneTarget}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-accent-primary" />}
              onClick={() =>
                toast.success(
                  "Workstation Synced",
                  `${spec.title} shell ready for Phase 2 integration.`
                )
              }
            >
              Simulate Action
            </Button>
          </div>
        }
      />

      {/* Module Overview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center text-accent-primary">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle>{spec.title} Capabilities</CardTitle>
                  <CardDescription>
                    Architectural readiness & API mapping from backend audit
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline">{spec.badge}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-content-secondary leading-relaxed">
              This module shell is fully routed with design tokens, responsive breakpoints, and layout constraints.
              Subsequent milestones will wire the interactive interfaces directly to the Express backend and Python AI Engine.
            </p>

            <div className="border border-border-subtle rounded-lg divide-y divide-border-subtle bg-surface-secondary/40">
              {spec.plannedFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-elevated/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-content-primary">
                        {feat.name}
                      </span>
                      {feat.endpoint && (
                        <span className="text-2xs font-mono text-accent-primary/80 bg-accent-primary/10 px-1.5 py-0.2 rounded border border-accent-primary/20">
                          {feat.endpoint}
                        </span>
                      )}
                    </div>
                    <p className="text-2xs text-content-muted">
                      {feat.description}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="xs"
                    rightIcon={<ArrowRight className="w-3 h-3" />}
                    onClick={() => handleSimulate(feat.name)}
                    className="self-start sm:self-auto shrink-0"
                  >
                    Simulate
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Technical Telemetry Panel */}
        <div className="space-y-6">
          <Card variant="default">
            <CardHeader>
              <div className="flex items-center gap-2 text-content-primary">
                <Terminal className="w-4 h-4 text-status-success" />
                <CardTitle className="font-mono text-xs">
                  TELEMETRY_CONTRACT
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-2xs">
              <div className="p-2.5 rounded bg-surface-main border border-border-subtle space-y-1.5 text-content-muted">
                <div className="flex justify-between">
                  <span>MODULE_ID:</span>
                  <span className="text-content-primary font-semibold">
                    {spec.title.toLowerCase().replace(/\s+/g, "_")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>TARGET_PHASE:</span>
                  <span className="text-accent-primary">
                    {spec.milestoneTarget}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>INTERFACE_STATUS:</span>
                  <span className="text-status-success">SHELL_MOUNTED</span>
                </div>
                <div className="flex justify-between">
                  <span>THEME_CONTRAST:</span>
                  <span className="text-content-primary">WCAG_AAA_DARK</span>
                </div>
              </div>

              <div className="text-2xs text-content-muted leading-relaxed">
                Design system components mounted: Buttons, Badges, Modals, Inputs, Skeletons, and Toast notifications.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

