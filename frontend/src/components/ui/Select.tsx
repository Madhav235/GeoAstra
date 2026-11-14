import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label className="text-xs font-medium text-content-secondary select-none">
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full bg-surface-secondary border border-border-subtle rounded px-3 py-1.5 text-sm text-content-primary",
              "appearance-none pr-9 h-9 transition-colors duration-150 cursor-pointer font-normal",
              "focus:outline-none focus:border-border-accent focus:ring-1 focus:ring-border-accent/40",
              "disabled:opacity-50 disabled:bg-surface-main disabled:cursor-not-allowed",
              error && "border-status-danger focus:border-status-danger focus:ring-status-danger/40",
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
                className="bg-surface-panel text-content-primary py-1"
              >
                {opt.label}
              </option>
            ))}
          </select>

          <span className="absolute right-3 pointer-events-none text-content-muted">
            <ChevronDown className="w-4 h-4" />
          </span>
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

Select.displayName = "Select";

