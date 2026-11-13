import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastProvider } from "./providers/ToastProvider";
import { useLayoutStore } from "@/hooks/useLayoutStore";
import { useToast } from "@/hooks/useToast";

export const App: React.FC = () => {
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const toast = useToast();

  // Global workstation keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle sidebar shortcut: '['
      if (
        e.key === "[" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement)?.tagName
        )
      ) {
        e.preventDefault();
        toggleSidebar();
      }

      // Quick Search shortcut: ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toast.info(
          "Workstation Search",
          "Global catalog search index will be enabled in Phase 2."
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar, toast]);

  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
};

export default App;

