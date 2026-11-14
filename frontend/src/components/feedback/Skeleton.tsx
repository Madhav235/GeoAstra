import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rectangle" | "circle" | "text";
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangle",
  width,
  height,
  className,
  style,
  ...props
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse bg-surface-elevated/70 border border-border-subtle/30",
        variant === "circle" && "rounded-full",
        variant === "rectangle" && "rounded",
        variant === "text" && "rounded h-3 w-full my-1",
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};

