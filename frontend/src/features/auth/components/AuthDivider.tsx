import React from "react";
import { cn } from "@/lib/utils";

export interface AuthDividerProps {
  label?: string;
  className?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ label, className }) => {
  return (
    <div className={cn("relative flex items-center py-2", className)}>
      <div className="flex-grow border-t border-border-subtle" />
      {label && (
        <span className="flex-shrink mx-3 text-2xs font-mono uppercase tracking-wider text-content-muted select-none">
          {label}
        </span>
      )}
      <div className="flex-grow border-t border-border-subtle" />
    </div>
  );
};

