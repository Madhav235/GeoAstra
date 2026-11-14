import React, { forwardRef, useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon = <Lock className="w-4 h-4 text-content-muted" />,
      disabled,
      value,
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || (label ? `pwd-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-content-secondary select-none flex items-center justify-between"
          >
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-2.5 text-content-muted pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            disabled={disabled}
            value={value}
            className={cn(
              "w-full bg-surface-secondary border border-border-subtle rounded px-3 py-1.5 text-sm text-content-primary placeholder:text-content-muted/70",
              "transition-colors duration-150 h-9 font-normal",
              "focus:outline-none focus:border-border-accent focus:ring-1 focus:ring-border-accent/40",
              "disabled:opacity-50 disabled:bg-surface-main disabled:cursor-not-allowed",
              leftIcon && "pl-9",
              "pr-9",
              error && "border-status-danger focus:border-status-danger focus:ring-status-danger/40",
              className
            )}
            {...props}
          />

          {/* Password Visibility Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-2.5 text-content-muted hover:text-content-primary p-0.5 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent-primary"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Inline Error or Helper Text */}
        {error ? (
          <span className="text-2xs text-status-danger font-medium flex items-center gap-1">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-2xs text-content-muted">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

