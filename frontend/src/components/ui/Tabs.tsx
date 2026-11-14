import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  onValueChange,
  children,
  className,
}) => {
  return (
    <TabsContext.Provider
      value={{ activeTab: value, setActiveTab: onValueChange }}
    >
      <div className={cn("w-full flex flex-col", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "underline" | "pills";
}

export const TabsList: React.FC<TabsListProps> = ({
  className,
  variant = "underline",
  children,
  ...props
}) => {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center",
        variant === "underline" && "border-b border-border-subtle gap-6",
        variant === "pills" && "bg-surface-secondary p-1 rounded-md gap-1 border border-border-subtle",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface TabTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  variant?: "underline" | "pills";
  badge?: React.ReactNode;
}

export const TabTrigger: React.FC<TabTriggerProps> = ({
  value,
  variant = "underline",
  badge,
  className,
  children,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabTrigger must be used within Tabs");

  const isActive = context.activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => context.setActiveTab(value)}
      className={cn(
        "text-xs font-medium transition-all duration-150 inline-flex items-center gap-2 select-none",
        variant === "underline" && [
          "py-2.5 border-b-2 -mb-[1px]",
          isActive
            ? "border-accent-primary text-accent-primary font-semibold"
            : "border-transparent text-content-muted hover:text-content-primary hover:border-border-strong",
        ],
        variant === "pills" && [
          "px-3 py-1.5 rounded",
          isActive
            ? "bg-surface-panel text-content-primary font-semibold shadow-sm border border-border-subtle"
            : "text-content-muted hover:text-content-primary",
        ],
        className
      )}
      {...props}
    >
      {children}
      {badge && <span className="text-2xs opacity-80">{badge}</span>}
    </button>
  );
};

export interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const TabContent: React.FC<TabContentProps> = ({
  value,
  className,
  children,
  ...props
}) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabContent must be used within Tabs");

  if (context.activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn("mt-4 animate-fade-in outline-none", className)}
      {...props}
    >
      {children}
    </div>
  );
};

