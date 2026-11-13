import React from "react";
import { cn } from "@/lib/utils";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: "primary" | "secondary" | "white" | "muted";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  variant = "primary",
  className,
  ...props
}) => {
  const sizeStyles: Record<SpinnerSize, string> = {
    xs: "w-3.5 h-3.5 border-[1.5px]",
    sm: "w-4.5 h-4.5 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-8 h-8 border-2.5",
    xl: "w-12 h-12 border-3",
  };

  const variantStyles = {
    primary: "border-accent-primary/20 border-t-accent-primary",
    secondary: "border-accent-secondary/20 border-t-accent-secondary",
    white: "border-white/20 border-t-white",
    muted: "border-border-subtle border-t-content-secondary",
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block rounded-full animate-spin",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

