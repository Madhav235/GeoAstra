import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { useLayoutStore } from "@/hooks/useLayoutStore";
import { cn } from "@/lib/utils";

export const AppLayout: React.FC = () => {
  const { isSidebarCollapsed } = useLayoutStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-main text-content-primary">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Column */}
      <div
        className={cn(
          "flex flex-col flex-1 min-w-0 h-full overflow-hidden transition-[margin] duration-200 ease-in-out",
          // Adapt margin based on sidebar state on large screens
          isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
        )}
      >
        {/* Top Header */}
        <TopNav />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto bg-surface-main bg-tech-grid relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

