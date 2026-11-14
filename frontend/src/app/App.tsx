import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastProvider } from "./providers/ToastProvider";
import { useLayoutStore } from "@/hooks/useLayoutStore";
import { useAuthStore } from "@/features/auth/useAuthStore";
import { useToast } from "@/hooks/useToast";

export const App: React.FC = () => {
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const initializeAuth = useAuthStore((state) => state.initialize);
  const toast = useToast();

  // Initialize auth session on boot
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

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
          "Global catalog search index will be enabled in Phase 3."
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
