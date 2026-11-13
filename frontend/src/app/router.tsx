import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PlaceholderPage } from "@/features/placeholder/PlaceholderPage";
import { ROUTE_SPECS } from "@/features/placeholder/routeSpecs";
import { ComponentShowcase } from "@/features/showcase/ComponentShowcase";
import { EmptyState } from "@/components/feedback/EmptyState";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <PlaceholderPage spec={ROUTE_SPECS.dashboard} />,
      },
      {
        path: "workspace",
        element: <PlaceholderPage spec={ROUTE_SPECS.workspace} />,
      },
      {
        path: "scenes",
        element: <PlaceholderPage spec={ROUTE_SPECS.scenes} />,
      },
      {
        path: "signatures",
        element: <PlaceholderPage spec={ROUTE_SPECS.signatures} />,
      },
      {
        path: "analysis/new",
        element: <PlaceholderPage spec={ROUTE_SPECS.analysis} />,
      },
      {
        path: "jobs",
        element: <PlaceholderPage spec={ROUTE_SPECS.jobs} />,
      },
      {
        path: "results",
        element: <PlaceholderPage spec={ROUTE_SPECS.results} />,
      },
      {
        path: "reports",
        element: <PlaceholderPage spec={ROUTE_SPECS.reports} />,
      },
      {
        path: "status",
        element: <PlaceholderPage spec={ROUTE_SPECS.status} />,
      },
      {
        path: "settings",
        element: <PlaceholderPage spec={ROUTE_SPECS.settings} />,
      },
      {
        path: "profile",
        element: <PlaceholderPage spec={ROUTE_SPECS.profile} />,
      },
      {
        path: "design-system",
        element: <ComponentShowcase />,
      },
      {
        path: "*",
        element: (
          <div className="p-8 max-w-lg mx-auto mt-12">
            <EmptyState
              title="404 — Coordinate Out of Bounds"
              description="The requested workstation route does not exist or has been relocated."
              action={
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  Return to Dashboard
                </Button>
              }
            />
          </div>
        ),
      },
    ],
  },
]);

