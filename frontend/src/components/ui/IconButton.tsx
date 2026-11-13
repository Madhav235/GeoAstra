import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Tooltip } from "./Tooltip";

export type IconButtonVariant =
  | "default"
  | "primary"
  | "ghost"
  | "outline"
  | "destructive";

export type IconButtonSize = "xs" | "sm" | "md" | "lg";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  tooltip?: React.ReactNode;
  tooltipPosition?: "top" | "bottom" | "left" | "right";
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  active?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      tooltip,
      tooltipPosition = "top",
      variant = "default",
      size = "md",
      active = false,
      disabled = false,
      className,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded transition-all duration-150 select-none " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-main " +
      "disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variantStyles: Record<IconButtonVariant, string> = {
      default:
        "bg-surface-elevated text-content-secondary hover:text-content-primary hover:bg-surface-hover border border-border-subtle",
      primary:
        "bg-accent-primary text-surface-main hover:bg-accent-primaryHover font-medium",
      ghost:
        "bg-transparent text-content-secondary hover:text-content-primary hover:bg-surface-panel",
      outline:
        "bg-transparent border border-border-subtle text-content-secondary hover:text-content-primary hover:border-border-strong hover:bg-surface-panel",
      destructive:
        "bg-transparent text-status-danger hover:bg-status-danger/20 border border-status-danger/30",
    };

    const sizeStyles: Record<IconButtonSize, string> = {
      xs: "w-6 h-6 p-1 text-xs",
      sm: "w-7.5 h-7.5 p-1.5 text-sm",
      md: "w-9 h-9 p-2 text-base",
      lg: "w-10.5 h-10.5 p-2.5 text-lg",
    };

    const button = (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          active && "bg-accent-primary/20 text-accent-primary border-accent-primary/50",
          className
        )}
        {...props}
      >
        {icon}
      </button>
    );

    if (tooltip && !disabled) {
      return (
        <Tooltip content={tooltip} position={tooltipPosition}>
          {button}
        </Tooltip>
      );
    }

    return button;
  }
);

IconButton.displayName = "IconButton";
