import {
  LayoutDashboard,
  Map,
  Satellite,
  Activity,
  Cpu,
  Clock,
  Layers,
  FileText,
  Server,
  Settings,
  User,
} from "lucide-react";
import { NavSectionConfig } from "@/types/navigation";

export const NAVIGATION_CONFIG: NavSectionConfig[] = [
  {
    title: "WORKSPACE",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview of geospatial activity, recent detections, and system metrics",
      },
      {
        id: "workspace",
        label: "Geospatial Studio",
        path: "/workspace",
        icon: Map,
        badge: "Core",
        description: "Interactive AOI definition, map layers, and spatial boundary management",
      },
      {
        id: "scenes",
        label: "Scene Explorer",
        path: "/scenes",
        icon: Satellite,
        description: "Satellite observation catalog, hyperspectral data cube discovery",
      },
      {
        id: "signatures",
        label: "Spectral Library",
        path: "/signatures",
        icon: Activity,
        description: "Reference target signatures, diagnostic absorption libraries, and calibration curves",
      },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      {
        id: "analysis",
        label: "Analysis Studio",
        path: "/analysis/new",
        icon: Cpu,
        description: "Run anomaly detection (RXD), target detection (MF/CEM), and score fusion algorithms",
      },
      {
        id: "jobs",
        label: "Processing Jobs",
        path: "/jobs",
        icon: Clock,
        description: "BullMQ scientific execution queue, stage monitors, and job cancellations",
      },
      {
        id: "results",
        label: "Results Explorer",
        path: "/results",
        icon: Layers,
        description: "Detection heatmaps, polygon vector overlays, and ROC evaluation curves",
      },
      {
        id: "reports",
        label: "Reports",
        path: "/reports",
        icon: FileText,
        description: "Scientific interpretation summaries, LLM synthesis, and exportable intelligence",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        id: "status",
        label: "Service Status",
        path: "/status",
        icon: Server,
        description: "Express API, Python AI Engine, PostGIS database, and Redis health telemetry",
      },
      {
        id: "settings",
        label: "Settings",
        path: "/settings",
        icon: Settings,
        description: "Workstation preferences, AI provider keys, and coordinate reference defaults",
      },
      {
        id: "profile",
        label: "Profile",
        path: "/profile",
        icon: User,
        description: "User account identity, credentials, and session details",
      },
    ],
  },
];

