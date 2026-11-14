import React from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import { ToastMessage, useToastStore } from "@/hooks/useToast";

export const ToastItem: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const dismissToast = useToastStore((state) => state.dismissToast);

  const icons = {
    info: <Info className="w-4 h-4 text-accent-primary shrink-0" />,
    success: <CheckCircle2 className="w-4 h-4 text-status-success shrink-0" />,
    warning: <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-status-danger shrink-0" />,
  };

  const borderStyles = {
    info: "border-accent-primary/40",
    success: "border-status-success/40",
    warning: "border-status-warning/40",
    error: "border-status-danger/40",
  };

  return (
    <div
      role="alert"
      className={cn(
        "pointer-events-auto flex items-start gap-3 w-80 sm:w-96 p-3.5 rounded-lg shadow-modal border",
        "bg-surface-elevated/95 backdrop-blur-md text-content-primary",
        "animate-slide-down transition-all duration-200 select-none",
        borderStyles[toast.variant || "info"]
      )}
    >
      <div className="mt-0.5">{icons[toast.variant || "info"]}</div>

      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-content-primary leading-tight">
          {toast.title}
        </h4>
        {toast.message && (
          <p className="text-2xs text-content-secondary mt-1 leading-normal break-words">
            {toast.message}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => dismissToast(toast.id)}
        className="text-content-muted hover:text-content-primary p-0.5 rounded transition-colors -mr-1 -mt-1"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

