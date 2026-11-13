import React from "react";
import { cn } from "@/lib/utils";
import { FolderOpen } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-lg border border-dashed border-border-subtle bg-surface-secondary/30",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-surface-elevated/80 border border-border-subtle flex items-center justify-center text-accent-primary mb-3.5 shadow-sm">
        {icon || <FolderOpen className="w-6 h-6 text-content-muted" />}
      </div>
      <h3 className="text-sm font-semibold text-content-primary tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-content-muted max-w-sm mt-1 leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

