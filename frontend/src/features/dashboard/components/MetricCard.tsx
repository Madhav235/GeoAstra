import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { LucideIcon, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: "success" | "warning" | "primary" | "outline";
  icon: LucideIcon;
  iconColorClass?: string;
  iconBgClass?: string;
  to?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  badgeText,
  badgeVariant = "primary",
  icon: Icon,
  iconColorClass = "text-accent-primary",
  iconBgClass = "bg-accent-primary/10 border-accent-primary/20",
  to,
}) => {
  const content = (
    <Card
      variant="default"
      className={cn(
        "h-full transition-all duration-200 border-border-subtle group hover:border-accent-primary/40 hover:bg-surface-elevated/40 select-none",
        to && "cursor-pointer"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-2xs uppercase tracking-wider font-mono font-semibold text-content-secondary group-hover:text-content-primary transition-colors">
            {title}
          </CardDescription>
          <div
            className={cn(
              "w-8 h-8 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-105",
              iconBgClass,
              iconColorClass
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-2 mt-1">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold font-mono tracking-tight text-content-primary">
            {value}
          </CardTitle>
          {to && (
            <span className="text-content-muted group-hover:text-accent-primary transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-1">
        {badgeText && (
          <div className="flex items-center gap-1.5 text-2xs">
            <span
              className={cn(
                "font-mono font-semibold",
                badgeVariant === "success" && "text-status-success",
                badgeVariant === "warning" && "text-status-warning",
                badgeVariant === "primary" && "text-accent-primary",
                badgeVariant === "outline" && "text-content-muted"
              )}
            >
              {badgeText}
            </span>
          </div>
        )}
        {subtitle && (
          <p className="text-2xs text-content-muted truncate">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (to) {
    return <Link to={to} className="block h-full">{content}</Link>;
  }

  return content;
};

