import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg";
  status?: "online" | "busy" | "offline" | "idle";
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = "User",
  size = "md",
  status,
  className,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (str: string) => {
    const parts = str.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const sizeStyles = {
    xs: "w-6 h-6 text-2xs",
    sm: "w-7.5 h-7.5 text-xs",
    md: "w-8.5 h-8.5 text-xs",
    lg: "w-11 h-11 text-sm",
  };

  const statusColors = {
    online: "bg-status-success",
    busy: "bg-status-danger",
    idle: "bg-status-warning",
    offline: "bg-content-muted",
  };

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={cn(
          "rounded-full flex items-center justify-center overflow-hidden font-semibold border border-border-strong",
          "bg-surface-elevated text-content-primary select-none",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={name}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-surface-main ring-1 ring-border-subtle",
            size === "xs" ? "w-2 h-2" : "w-2.5 h-2.5",
            statusColors[status]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

