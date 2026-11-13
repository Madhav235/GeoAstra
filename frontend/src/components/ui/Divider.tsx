import React from "react";
import { cn } from "@/lib/utils";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: React.ReactNode;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  label,
  className,
  ...props
}) => {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("w-[1px] h-full bg-border-subtle shrink-0", className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={cn("flex items-center w-full my-3", className)}
        {...props}
      >
        <div className="flex-grow border-t border-border-subtle" />
        <span className="px-3 text-2xs uppercase tracking-wider text-content-muted font-mono select-none">
          {label}
        </span>
        <div className="flex-grow border-t border-border-subtle" />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn("w-full border-t border-border-subtle my-2", className)}
      {...props}
    />
  );
};

