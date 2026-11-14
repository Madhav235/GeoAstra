import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-medium rounded-full tracking-wide select-none transition-colors";

  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-surface-elevated text-content-secondary border border-border-subtle",
    primary: "bg-accent-primary/15 text-accent-primary border border-accent-primary/30",
    secondary: "bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30",
    success: "bg-status-success/15 text-status-success border border-status-success/30",
    warning: "bg-status-warning/15 text-status-warning border border-status-warning/30",
    danger: "bg-status-danger/15 text-status-danger border border-status-danger/30",
    outline: "bg-transparent text-content-secondary border border-border-strong",
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "text-2xs px-2 py-0.5 gap-1 leading-none",
    md: "text-xs px-2.5 py-1 gap-1.5 leading-none",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-content-muted",
    primary: "bg-accent-primary",
    secondary: "bg-accent-secondary",
    success: "bg-status-success",
    warning: "bg-status-warning",
    danger: "bg-status-danger",
    outline: "bg-content-secondary",
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

