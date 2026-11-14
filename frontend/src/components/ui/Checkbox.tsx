import React, { forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked,
      indeterminate,
      disabled,
      label,
      description,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (ref || inputRef) as React.RefObject<HTMLInputElement>;
    const inputId = id || (typeof label === "string" ? `chk-${label.toLowerCase().replace(/\s+/g, "-")}` : undefined);

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate, resolvedRef]);

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-start gap-2.5 cursor-pointer select-none group text-left",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            id={inputId}
            ref={resolvedRef}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 rounded border border-border-strong bg-surface-secondary transition-all duration-150",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-accent-primary/60 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-surface-main",
              "group-hover:border-accent-primary",
              (checked || indeterminate) &&
                "bg-accent-primary border-accent-primary text-surface-main",
              className
            )}
          >
            {checked && !indeterminate && (
              <Check className="w-3.5 h-3.5 stroke-[3] text-surface-main" />
            )}
            {indeterminate && (
              <Minus className="w-3.5 h-3.5 stroke-[3] text-surface-main" />
            )}
          </div>
        </div>

        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-xs font-medium text-content-primary group-hover:text-white transition-colors">
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
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

