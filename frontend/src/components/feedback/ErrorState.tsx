import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  code?: string | number;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Telemetry & Synchronization Error",
  message = "Failed to communicate with remote geospatial service. Please check network connectivity or telemetry status.",
  code,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-lg border border-status-danger/30 bg-status-danger/5",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-status-danger/15 border border-status-danger/30 flex items-center justify-center text-status-danger mb-3.5 shadow-sm">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-content-primary tracking-tight">
        {title}
      </h3>
      {code && (
        <span className="text-2xs font-mono text-status-danger bg-status-danger/10 px-2 py-0.5 rounded mt-1 border border-status-danger/20">
          ERR_CODE: {code}
        </span>
      )}
      <p className="text-xs text-content-muted max-w-sm mt-2 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="mt-5 border-border-strong"
        >
          Retry Connection
        </Button>
      )}
    </div>
  );
};

