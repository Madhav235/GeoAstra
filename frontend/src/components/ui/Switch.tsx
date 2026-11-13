import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: string;
  size?: "sm" | "md";
  className?: string;
  id?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onChange,
      disabled = false,
      label,
      description,
      size = "md",
      className,
      id,
    },
    ref
  ) => {
    const isSm = size === "sm";

    return (
      <div
        className={cn(
          "inline-flex items-start gap-3 select-none text-left",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        )}
        onClick={() => !disabled && onChange && onChange(!checked)}
      >
        <button
          ref={ref}
          id={id}
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          className={cn(
            "relative inline-flex shrink-0 transition-colors duration-200 ease-in-out rounded-full border border-transparent",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/60 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-main",
            isSm ? "h-4 w-7" : "h-5 w-9",
            checked ? "bg-accent-primary" : "bg-surface-elevated border-border-subtle",
            className
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block rounded-full bg-white shadow-sm transform transition duration-200 ease-in-out",
              isSm ? "h-3 w-3" : "h-4 w-4",
              checked
                ? isSm
                  ? "translate-x-3.5"
                  : "translate-x-4.5"
                : "translate-x-0.5"
            )}
          />
        </button>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-xs font-medium text-content-primary">
                {label}
              </span>
            )}
            {description && (
              <span className="text-2xs text-content-muted mt-0.5">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";
