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
import { PlaceholderModuleSpec } from "./PlaceholderPage";

export const ROUTE_SPECS: Record<string, PlaceholderModuleSpec> = {
  dashboard: {
    title: "Mission Dashboard",
    category: "WORKSPACE",
    subtitle:
      "Central command console for observation monitoring, recent anomaly detections, and geospatial telemetry.",
    icon: LayoutDashboard,
    badge: "WORKSTATION",
    milestoneTarget: "Phase 2 / Milestone 1",
    plannedFeatures: [
      {
        name: "Telemetry Status Monitor",
        description: "Live ping to Express backend and Python AI Engine health check endpoints.",
        endpoint: "GET /api/v1/health/services",
      },
      {
        name: "Recent Spectral Analyses",
        description: "List of the latest BullMQ completed jobs, execution latencies, and anomaly statistics.",
        endpoint: "GET /api/v1/analysis",
      },
      {
        name: "Active Areas of Interest",
        description: "Quick preview of user-defined AOIs with spatial bounding boxes and scene intersection counts.",
        endpoint: "GET /api/v1/areas",
      },
    ],
  },
  workspace: {
    title: "Geospatial Studio",
    category: "WORKSPACE",
    subtitle:
      "Interactive cartographic workstation for polygon drawing, coordinate system inspection, and spatial AOI boundaries.",
    icon: Map,
    badge: "CORE WORKSPACE",
    milestoneTarget: "Phase 2 / Milestone 2",
    plannedFeatures: [
      {
        name: "AOI Polygon Drawing Studio",
        description: "Vector polygon drawing and editing in EPSG:4326 with vertex coordinate inspectors.",
        endpoint: "POST /api/v1/areas",
      },
      {
        name: "Area Boundaries Catalog",
        description: "Manage, rename, and delete registered areas with cascade safety.",
        endpoint: "GET /api/v1/areas/:areaId",
      },
      {
        name: "MultiPolygon & CRS Selector",
        description: "Supports EPSG:4326 and customizable coordinate reference systems.",
        endpoint: "PATCH /api/v1/areas/:areaId",
      },
    ],
  },
  scenes: {
    title: "Scene Explorer",
    category: "WORKSPACE",
    subtitle:
      "Discovery catalog for hyperspectral satellite data cubes across AVIRIS, ROSIS, and EMIT instruments.",
    icon: Satellite,
    badge: "DATA CATALOG",
    milestoneTarget: "Phase 2 / Milestone 2",
    plannedFeatures: [
      {
        name: "Benchmark Scene Catalog",
        description: "Indian Pines (200 bands), Pavia University (103 bands), and NASA EMIT Western India (285 bands).",
        endpoint: "GET /api/v1/scenes",
      },
      {
        name: "Sensor & Temporal Query Filter",
        description: "Filter satellite observations by instrument, provider, and acquisition date ranges.",
        endpoint: "GET /api/v1/scenes/search",
      },
      {
        name: "Footprint Bounding Box Inspection",
        description: "Overlay spatial coverage footprint polygons on the workstation map.",
        endpoint: "GET /api/v1/scenes/:sceneId",
      },
    ],
  },
  signatures: {
    title: "Spectral Library",
    category: "WORKSPACE",
    subtitle:
      "Reference target signature repository containing USGS spectral standards and custom mineral/vegetation absorption curves.",
    icon: Activity,
    badge: "SPECTRAL REPO",
    milestoneTarget: "Phase 2 / Milestone 2",
    plannedFeatures: [
      {
        name: "USGS Reference Standards",
        description: "Pre-seeded reference library including Healthy Chlorophyll Canopy and Kaolinite Doublet.",
        endpoint: "GET /api/v1/signatures",
      },
      {
        name: "Custom Signature Importer",
        description: "Upload laboratory reference reflectance vectors matched to sensor band wavelengths.",
        endpoint: "POST /api/v1/signatures",
      },
      {
        name: "Spectral Curve Graphing",
        description: "High-resolution reflectance vs wavelength interactive chart.",
        endpoint: "GET /api/v1/signatures/:id",
      },
    ],
  },
  analysis: {
    title: "Analysis Studio",
    category: "INTELLIGENCE",
    subtitle:
      "Configure and dispatch hyperspectral anomaly detection (RXD), target detection (MF/CEM), and score fusion pipelines.",
    icon: Cpu,
    badge: "AI PIPELINE",
    milestoneTarget: "Phase 2 / Milestone 3",
    plannedFeatures: [
      {
        name: "Reed-Xiaoli Anomaly Detector (RXD)",
        description: "Unsupervised Mahalanobis distance background model with covariance diagonal loading.",
        endpoint: "POST /api/v1/analysis (algo: rxd)",
      },
      {
        name: "Matched Filter (MF) Target Detector",
        description: "Supervised background suppression maximizing SNR along reference target vector.",
        endpoint: "POST /api/v1/analysis (algo: matched_filter)",
      },
      {
        name: "Constrained Energy Minimization (CEM)",
        description: "Correlation energy minimization with unity constraint on target spectrum.",
        endpoint: "POST /api/v1/analysis (algo: cem)",
      },
      {
        name: "Score Fusion Engine",
        description: "Convex alpha combination of normalized target detection and anomaly score rasters.",
        endpoint: "POST /api/v1/analysis (algo: fusion)",
      },
    ],
  },
  jobs: {
    title: "Processing Jobs",
    category: "INTELLIGENCE",
    subtitle:
      "BullMQ asynchronous job execution monitor tracking data acquisition, preprocessing, algorithms, and output generation.",
    icon: Clock,
    badge: "JOB QUEUE",
    milestoneTarget: "Phase 2 / Milestone 3",
    plannedFeatures: [
      {
        name: "BullMQ Stage Progression Monitor",
        description: "Tracks QUEUED -> ACQUIRING_DATA -> PREPROCESSING -> RUNNING_ALGORITHMS -> GENERATING_OUTPUTS.",
        endpoint: "GET /api/v1/analysis/:analysisId",
      },
      {
        name: "Job Cancellation Controller",
        description: "Safely dequeue active jobs and update analysis database status to CANCELLED.",
        endpoint: "POST /api/v1/analysis/:analysisId/cancel",
      },
      {
        name: "Execution Latency & Worker Logs",
        description: "Display Python engine scientific execution time and error traces.",
        endpoint: "GET /api/v1/analysis",
      },
    ],
  },
  results: {
    title: "Results Explorer",
    category: "INTELLIGENCE",
    subtitle:
      "Geospatial visualization workstation displaying continuous score GeoTIFFs, vector polygons, and ROC curves.",
    icon: Layers,
    badge: "RESULTS ENGINE",
    milestoneTarget: "Phase 2 / Milestone 4",
    plannedFeatures: [
      {
        name: "Heatmap Preview Overlay",
        description: "Render 8-bit RGBA PNG preview heatmaps (Inferno, Viridis colormaps) directly over the map.",
        endpoint: "GET /api/v1/analysis/:id/preview",
      },
      {
        name: "Polygon Vector Detections",
        description: "GeoJSON FeatureCollection with polygon clusters, confidence scores, and pixel counts.",
        endpoint: "GET /api/v1/analysis/:id/polygons",
      },
      {
        name: "ROC Curve Evaluation",
        description: "ROC AUC metric, Pd at fixed Pfa (0.001, 0.01), precision, recall, and F1 score against ground truth.",
        endpoint: "GET /api/v1/analysis/:id/results",
      },
      {
        name: "GeoTIFF Floating-Point Download",
        description: "Download 32-bit single-band continuous score rasters for QGIS/ArcGIS analysis.",
        endpoint: "GET /api/v1/analysis/:id/raster",
      },
    ],
  },
  reports: {
    title: "Intelligence Reports",
    category: "INTELLIGENCE",
    subtitle:
      "Multi-provider LLM scientific explanation synthesis, comparative summaries, and mission intelligence briefs.",
    icon: FileText,
    badge: "SYNTHESIS",
    milestoneTarget: "Phase 2 / Milestone 4",
    plannedFeatures: [
      {
        name: "Deterministic Scientific Physics Synthesis",
        description: "Zero-hallucination interpretation of spectral outliers and background covariance deviations.",
        endpoint: "GET /api/v1/analysis/:id/results",
      },
      {
        name: "Multi-Provider AI Comparison",
        description: "Compare explanation runs across NVIDIA NIM, Hugging Face, and NaraRouter.",
        endpoint: "aiExplanations.providerRuns",
      },
      {
        name: "Exportable Analysis Dossier",
        description: "Client-side PDF compilation of metrics, detection maps, and sensor parameters.",
        endpoint: "Client-side generation",
      },
    ],
  },
  status: {
    title: "Service Status & Telemetry",
    category: "SYSTEM",
    subtitle:
      "Real-time diagnostic health telemetry for Express Backend, Python AI Engine, PostGIS Database, and Redis Queue.",
    icon: Server,
    badge: "DIAGNOSTICS",
    milestoneTarget: "Phase 2 / Milestone 1",
    plannedFeatures: [
      {
        name: "Express Backend Health Check",
        description: "Node.js v20+ API gateway telemetry on port 5001.",
        endpoint: "GET /health",
      },
      {
        name: "Python AI Engine Health Check",
        description: "FastAPI 0.115 scientific backend latency and memory telemetry on port 8000.",
        endpoint: "GET /health/services",
      },
      {
        name: "AI Provider Key Status",
        description: "Verifies configuration of NVIDIA NIM, Hugging Face, and NaraRouter keys.",
        endpoint: "GET /internal/v1/ai/providers",
      },
    ],
  },
  settings: {
    title: "Workstation Settings",
    category: "SYSTEM",
    subtitle:
      "Configure coordinate systems, default spectral algorithms, colormap heatmaps, and interface preferences.",
    icon: Settings,
    badge: "CONFIG",
    milestoneTarget: "Phase 2 / Milestone 1",
    plannedFeatures: [
      {
        name: "Default Coordinate Reference System",
        description: "Set default CRS between EPSG:4326 (WGS84) and local UTM projections.",
        endpoint: "Local preferences",
      },
      {
        name: "Algorithm Regularization Defaults",
        description: "Configure default covariance diagonal loading factor (lambda = 1e-4).",
        endpoint: "Algorithm config",
      },
      {
        name: "Design System Showcase",
        description: "Test and inspect all reusable UI buttons, inputs, modals, and toasts.",
        endpoint: "Link to /design-system",
      },
    ],
  },
  profile: {
    title: "Analyst Profile",
    category: "SYSTEM",
    subtitle:
      "Manage authenticated researcher identity, active sessions, and geospatial credentials.",
    icon: User,
    badge: "IDENTITY",
    milestoneTarget: "Phase 2 / Milestone 1",
    plannedFeatures: [
      {
        name: "User Identity Verification",
        description: "Inspect verified user profile and account creation timestamps.",
        endpoint: "GET /api/v1/users/me",
      },
      {
        name: "Session JWT Security",
        description: "7-day HMAC-SHA256 authenticated bearer token telemetry.",
        endpoint: "Stateless client session",
      },
      {
        name: "NASA Earthdata Token Configuration",
        description: "Manage credentials for EMIT spaceborne hyperspectral scene discovery.",
        endpoint: "Secure client vault",
      },
    ],
  },
};

