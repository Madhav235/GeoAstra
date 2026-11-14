import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItemConfig } from "@/types/navigation";
import { Tooltip } from "../ui/Tooltip";
import { useLayoutStore } from "@/hooks/useLayoutStore";

export interface NavItemProps {
  item: NavItemConfig;
  isCollapsed: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ item, isCollapsed }) => {
  const closeMobileMenu = useLayoutStore((state) => state.closeMobileMenu);
  const Icon = item.icon;

  const content = (
    <NavLink
      to={item.path}
      onClick={closeMobileMenu}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 px-3 py-2 rounded text-xs transition-colors duration-150 select-none",
          isActive
            ? "bg-accent-primary/15 text-accent-primary font-semibold border-l-[3px] border-accent-primary pl-2.5"
            : "text-content-secondary hover:text-content-primary hover:bg-surface-elevated/60",
          isCollapsed && "justify-center px-0 w-10 h-10 mx-auto"
        )
      }
    >
      <Icon className={cn("w-4 h-4 shrink-0 transition-transform group-hover:scale-105")} />

      {!isCollapsed && (
        <div className="flex items-center justify-between flex-1 min-w-0">
          <span className="truncate">{item.label}</span>
          {item.badge && (
            <span className="text-2xs font-mono px-1.5 py-0.5 rounded bg-accent-primary/20 text-accent-primary border border-accent-primary/30 uppercase tracking-wider scale-90">
              {item.badge}
            </span>
          )}
        </div>
      )}
    </NavLink>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={item.label} position="right" delayMs={100}>
        {content}
      </Tooltip>
    );
  }

  return content;
};

