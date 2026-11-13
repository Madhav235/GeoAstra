import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff, Search, X } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const isSearch = type === "search";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    const hasValue = value !== undefined && value !== null && value !== "";

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-xs font-medium text-content-secondary select-none flex items-center justify-between">
            <span>{label}</span>
          </label>
        )}

        <div className="relative flex items-center w-full">
          {/* Default search icon or custom left icon */}
          {isSearch && !leftIcon && (
            <span className="absolute left-2.5 text-content-muted pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
          )}
          {leftIcon && (
            <span className="absolute left-2.5 text-content-muted pointer-events-none flex items-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            type={actualType}
            disabled={disabled}
            value={value}
            className={cn(
              "w-full bg-surface-secondary border border-border-subtle rounded px-3 py-1.5 text-sm text-content-primary placeholder:text-content-muted/70",
              "transition-colors duration-150 h-9 font-normal",
              "focus:outline-none focus:border-border-accent focus:ring-1 focus:ring-border-accent/40",
              "disabled:opacity-50 disabled:bg-surface-main disabled:cursor-not-allowed",
              (leftIcon || isSearch) && "pl-9",
              (rightIcon || isPassword || (clearable && hasValue)) && "pr-9",
              error && "border-status-danger focus:border-status-danger focus:ring-status-danger/40",
              className
            )}
            {...props}
          />

          {/* Right actions: clear button, password reveal toggle, or custom right icon */}
          <div className="absolute right-2 flex items-center gap-1 text-content-muted">
            {clearable && hasValue && !disabled && (
              <button
                type="button"
                onClick={onClear}
                tabIndex={-1}
                className="hover:text-content-primary p-0.5 rounded transition-colors"
                title="Clear input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="hover:text-content-primary p-0.5 rounded transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            )}

            {!isPassword && rightIcon && (
              <span className="pointer-events-none flex items-center">
                {rightIcon}
              </span>
            )}
          </div>
        </div>

        {error ? (
          <p className="text-2xs text-status-danger font-medium animate-fade-in">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-2xs text-content-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

