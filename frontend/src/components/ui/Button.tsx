import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      leftIcon,
      rightIcon,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 select-none rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-main disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-accent-primary text-surface-main hover:bg-accent-primaryHover active:bg-accent-primary shadow-sm font-semibold",
      secondary:
        "bg-surface-elevated text-content-primary hover:bg-surface-hover hover:text-white border border-border-subtle active:bg-surface-panel",
      outline:
        "bg-transparent text-content-primary border border-border-subtle hover:bg-surface-panel hover:border-border-strong active:bg-surface-elevated",
      ghost:
        "bg-transparent text-content-secondary hover:text-content-primary hover:bg-surface-panel active:bg-surface-elevated",
      destructive:
        "bg-status-danger/20 text-status-danger border border-status-danger/40 hover:bg-status-danger/30 hover:border-status-danger/60 active:bg-status-danger/40",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      xs: "text-2xs px-2 py-1 gap-1.5 h-6",
      sm: "text-xs px-2.5 py-1.5 gap-1.5 h-7.5",
      md: "text-sm px-3.5 py-2 gap-2 h-9",
      lg: "text-base px-5 py-2.5 gap-2.5 h-11",
      icon: "h-8.5 w-8.5 p-0 justify-center",
    };

    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            {size !== "icon" && children}
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

