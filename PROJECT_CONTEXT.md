# GeoAstra — Complete Project Context & Technical Architecture

> **Single Source of Truth** for technical architecture, codebase inventory, development progress, design system decisions, operational runbooks, and future roadmap.
>
> *Document Version:* 1.0.0  
> *Last Updated:* November 2026  
> *Target Audience:* Software Engineers, Remote Sensing Scientists, and AI Agents continuing development on this repository.

---

## 1. Project Overview

### 1.1 What GeoAstra Is
**GeoAstra** (originally planned under the working title *GeoSpectra AI*) is an end-to-end **Hyperspectral Intelligence & Geospatial Detection Platform**. It bridges scientific remote sensing imaging spectroscopy with an asynchronous enterprise backend and a modern scientific workstation frontend.

### 1.2 The Problem It Solves
Hyperspectral imaging cubes contain dozens to hundreds of narrow, contiguous spectral bands (typically $0.4\text{ to }2.5\ \mu\text{m}$) capturing diagnostic molecular absorption features that multispectral sensors (e.g., standard RGB or 13-band Sentinel-2) cannot discern. However, hyperspectral analysis suffers from significant engineering bottlenecks:
1. **High Dimensionality & Data Volume:** Single flightlines or satellite scenes often span gigabytes of dense floating-point cubes ($H \times W \times B$).
2. **Computational Complexity:** Statistical background modeling and covariance matrix inversion require heavy vector operations and regularization to prevent singularity.
3. **Black-Box AI Hallucination:** Naive application of Large Language Models (LLMs) or foundation models to earth observation often fabricates chemical or mineral classifications without domain validation.
4. **Tooling Fragmentation:** Disconnected workflows between scientific Python scripts, GIS desktop software (QGIS/ENVI), relational databases, and client visualization.

GeoAstra solves this by enforcing **independent scientific authority**: core spectral target and anomaly detection is computed via deterministic, mathematically validated algorithms (Reed-Xiaoli Detector, Matched Filter, Constrained Energy Minimization, Score Fusion). LLMs are integrated strictly as an *explanation layer* to provide scientific summaries and comparative interpretations without ever mutating numerical detection scores.

### 1.3 Core Functionality
- **Area of Interest (AOI) Management:** Create, inspect, update, and manage vector polygons (EPSG:4326 GeoJSON) designating geographic surveillance zones.
- **Satellite Scene Catalog:** Ingestion, indexing, and spatial footprint discovery of spaceborne/airborne hyperspectral datasets (NASA AVIRIS, ROSIS, NASA EMIT, EnMAP).
- **Target Signature Library:** Storage and provenance tracking of verified reference reflectance spectra (USGS Spectral Library v7, laboratory standards, and user-uploaded curves).
- **Scientific Preprocessing:** Automated data cube validation, NaN sanitization, variance-based and atmospheric water-vapor bad-band removal, $L_2$/standard/minmax normalization, and PCA dimensionality reduction.
- **Hyperspectral Detection Pipelines:**
  - *Unsupervised Anomaly Detection:* Reed-Xiaoli Detector (RXD) computing Mahalanobis distance deviations from the global background covariance.
  - *Supervised Target Detection:* Matched Filter (MF) and Constrained Energy Minimization (CEM) projecting onto reference spectral vectors.
  - *Detection Fusion:* Experimental convex combination of target abundance and anomaly score maps.
- **Geospatial Artifact Generation:** Georeferenced continuous 32-bit floating-point GeoTIFF exports, polygonized detection vector GeoJSON FeatureCollections, and 8-bit RGBA PNG heatmap previews.
- **Multi-Provider AI Orchestration:** Fault-isolated parallel dispatch of detection metrics to NVIDIA NIM, Hugging Face Inference, NaraRouter, and an offline deterministic physics-rule synthesizer.
- **Asynchronous Execution & Telemetry:** Redis-backed BullMQ job queue with multi-stage lifecycle tracking and cancellation control.
- **Scientific Workstation Frontend:** High-density, dark-first React/TypeScript interface equipped with a complete design system and responsive navigation.

### 1.4 Intended Users & Commercial Pilot Directions
- **Remote Sensing Researchers & Labs:** Reproducible algorithm benchmarking on verified datasets (Indian Pines, Pavia University).
- **Mineral Exploration & Geology:** Mapping diagnostic hydrothermal alteration minerals (e.g., Kaolinite, Alunite, Calcite) using shortwave-infrared (SWIR) absorption doublets.
- **Precision Agriculture & Forestry:** Monitoring chlorophyll absorption dynamics, crop senescence, and invasive species canopy signatures.
- **Environmental & Industrial Monitoring:** Detecting methane plumes, industrial effluent, or uncharacteristic surface anomalies.

---

## 2. Technical Stack & Actual Versions

All versions listed below reflect the exact configurations installed and locked in the repository:

### 2.1 Languages & Runtimes
| Technology | Version | Location / Context |
| :--- | :--- | :--- |
| **Node.js** | `>= 20.0.0` (Dev tested on `v24.7.0`) | Main application backend & queue worker |
| **Python** | `3.13` (Virtualenv: `ai-engine/.venv`) | Scientific processing engine & AI adapters |
| **TypeScript** | `^5.6.3` | Frontend workstation typing & contracts |
| **SQL** | PostgreSQL 16 Dialect | Database schema & migrations |

### 2.2 Frontend Workstation (`frontend/`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | Core UI library |
| **React DOM** | `^18.3.1` | DOM renderer |
| **React Router DOM** | `^6.28.0` | Client-side routing, navigation, and nested layouts |
| **Vite** | `^5.4.11` | Build tool, HMR dev server (Port 3000) |
| **Tailwind CSS** | `^3.4.14` | Utility-first CSS framework with custom design tokens |
| **Zustand** | `^5.0.1` | Lightweight state management (layout, toast stack) |
| **Lucide React** | `^0.460.0` | Scientific, cartographic, and system icons |
| **clsx** | `^2.1.1` | Conditional class composition |
| **tailwind-merge** | `^2.5.4` | Conflict-free Tailwind class resolution |
| **PostCSS / Autoprefixer** | `^8.4.49` / `^10.4.20` | CSS parsing and vendor prefixing |

### 2.3 Application Backend (`backend/`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| **Express** | `^4.21.1` | HTTP API gateway (Port 5001) |
| **Prisma ORM** | `^5.22.0` | Type-safe PostgreSQL client and schema migrations |
| **BullMQ** | `^6.7.4` | Redis-backed asynchronous queue and background worker |
| **ioredis** | `^6.0.0` | Redis client connection provider |
| **jsonwebtoken** | `^9.0.3` | HMAC-SHA256 stateless authentication tokens |
| **bcrypt** | `^6.0.0` | Password hashing (10 salt rounds) |
| **zod** | `^4.6.7` (or `^3.x`) | Request validation schemas for routes |
| **axios** | `^1.7.7` | Internal HTTP client to Python scientific engine |
| **cors** | `^2.8.5` | Cross-Origin Resource Sharing middleware |
| **dotenv** | `^16.4.5` | Environment variable loader |

### 2.4 Scientific Engine & AI Processing (`ai-engine/`)
| Package | Version | Purpose |
| :--- | :--- | :--- |
| **FastAPI** | `>= 0.115.0` | High-performance ASGI scientific API (Port 8000) |
| **Uvicorn** | `>= 0.32.0` | ASGI web server implementation |
| **NumPy** | `>= 2.0.0` | Multi-dimensional array operations & vectorization |
| **SciPy** | `>= 1.14.0` | MATLAB `.mat` I/O (`scipy.io`), statistical routines |
| **scikit-learn** | `>= 1.5.0` | Principal Component Analysis (PCA), ROC curves, metrics |
| **Rasterio** | `>= 1.4.0` | Geospatial raster I/O, GeoTIFF creation, polygonization |
| **pyproj** | `>= 3.6.0` | Cartographic projections and CRS transformations |
| **h5py** | `>= 3.11.0` | HDF5 data format support |
| **netCDF4** | `>= 1.7.0` | Network Common Data Form scientific raster format |
| **Pillow (PIL)** | `>= 11.0.0` | 8-bit RGBA image encoding for PNG previews |
| **Matplotlib** | `>= 3.9.0` | Colormap application (`inferno`, `viridis`) |
| **httpx** | `>= 0.27.2` | Async HTTP client for external AI providers |
| **Pydantic** | `>= 2.9.0` | Request/response data validation and settings management |
| **pytest** / **pytest-asyncio**| `>= 8.3.0` / `>= 0.24.0` | Automated test suites |

### 2.5 Infrastructure & Databases (`docker-compose.yml`)
| Service | Image | Ports | Purpose |
| :--- | :--- | :--- | :--- |
| **PostgreSQL + PostGIS** | `postgis/postgis:16-3.4` | `5433:5432` | Relational application metadata and GeoJSON storage |
| **Redis** | `redis:7-alpine` | `6379:6379` | BullMQ message broker and worker queue store |
| **Filesystem Storage** | Local directory | `storage/` | Partitioned local raster and preview storage |

---

## 3. High-Level System Architecture

The following diagram illustrates how the three distinct runtime subsystems communicate:

```
+---------------------------------------------------------------------------------------------------+
|                                       FRONTEND WORKSTATION                                        |
|                          React 18 + TypeScript + Vite + Tailwind CSS                              |
|                     (Port 3000 — Dark-first Scientific Workstation Shell)                         |
+---------------------------------------------------------------------------------------------------+
                                            |                    ^
               1. REST API Requests (Bearer JWT)                 | 6. Image/GeoJSON/GeoTIFF Streaming
                                            v                    |
+---------------------------------------------------------------------------------------------------+
|                                     EXPRESS API GATEWAY                                           |
|                            Node.js 20+ / Express 4.21 (Port 5001)                                 |
|          Auth Middleware | Route Validation (Zod) | Area, Scene, Signature & Analysis APIs         |
+---------------------------------------------------------------------------------------------------+
               |                                           |                                ^
 2. Persist    |                              3. Enqueue   |                   5. Update    |
    Metadata   v                                 Job       v                      Status    |
+---------------------------+                +---------------------------+                  |
|    PostgreSQL + PostGIS   |                |       Redis 7 Alpine      |                  |
|  (Docker Host Port 5433)  |                |        (Port 6379)        |                  |
| users, areas, scenes,     |                |  BullMQ "analysis-queue"  |                  |
| analyses, detection_res   |                +---------------------------+                  |
+---------------------------+                              |                                |
                                              4. Dequeue   |                                |
                                                 Job       v                                |
                                             +----------------------------------------------+
                                             |           BULLMQ ANALYSIS WORKER             |
                                             |       backend/src/workers/analysis.worker.js |
                                             +----------------------------------------------+
                                                           |                    ^
                                4a. Scientific Execution   |                    | 4d. Return Metrics
                                    POST /internal/.../run |                    |     & Artifact Keys
                                                           v                    |
+---------------------------------------------------------------------------------------------------+
|                                 PYTHON SCIENTIFIC AI ENGINE                                       |
|                               FastAPI 0.115 / Python 3.13 (Port 8000)                             |
|                                                                                                   |
|  [Preprocessing]        [Algorithms]                  [Geospatial Exporters]    [AI Providers]    |
|  - validate_cube        - compute_rxd (Mahalanobis)   - export_geotiff (TIF)    - NVIDIA NIM      |
|  - remove_bad_bands     - compute_matched_filter      - polygonize_detections   - Hugging Face    |
|  - normalize_spectra    - compute_cem                 - generate_png_preview    - NaraRouter      |
|  - reduce_dimension_pca - compute_score_fusion        - evaluate_detection      - Rule Synthesizer|
+---------------------------------------------------------------------------------------------------+
               |                                                                ^
 4b. Load Scene|                                                   4c. Return   |
     Cube      v                                                       Inference|
+-----------------------------------------------------------------------+  +------------------------+
|                      LOCAL STORAGE FILESYSTEM                         |  |  EXTERNAL LLM CLOUDS   |
| storage/input/         -> .mat benchmark raw cubes                    |  | - api.nvidia.com       |
| storage/intermediate/  -> Working scratch files                       |  | - router.huggingface.co|
| storage/output/        -> {analysisId}_score.tif, polygons.geojson    |  | - api.nararouter.com   |
| storage/previews/      -> {analysisId}_preview.png                    |  +------------------------+
+-----------------------------------------------------------------------+
```

---

## 4. Complete Codebase Directory & File Inventory

```text
GeoAstra/
├── docker-compose.yml          # Container configuration for PostgreSQL 16 (PostGIS) & Redis 7
├── README.md                   # Quickstart instructions for infrastructure, ai-engine, and backend
├── task.md                     # Comprehensive technical specification, blueprint, and MVP roadmap
├── PROJECT_CONTEXT.md          # THIS FILE: Master technical context & architectural source of truth
│
├── storage/                    # Local filesystem volume partitioned for pipeline assets
│   ├── input/                  # Scientific raw data cubes (.mat files, benchmarks)
│   ├── intermediate/           # Scratch storage for temporary matrix transforms
│   ├── output/                 # Generated continuous GeoTIFFs (*_score.tif) and GeoJSON polygons
│   └── previews/               # Colormapped 8-bit RGBA PNG heatmaps (*_preview.png)
│
├── backend/                    # Application Gateway & Workflow Engine (Node.js/Express/Prisma/BullMQ)
│   ├── package.json            # Node dependencies and scripts
│   ├── package-lock.json       # Locked dependency versions
│   ├── .env.example            # Environment template for ports, database URLs, and secrets
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema definition (7 models, 1 enum)
│   │   └── migrations/         # PostgreSQL schema migration history
│   │       └── 20261111000000_init_core_models/
│   │           └── migration.sql # Initial SQL migration creating tables, constraints, enums
│   ├── src/
│   │   ├── server.js           # Server bootstrapper, DB connector, worker starter, graceful shutdown
│   │   ├── app.js              # Express app, CORS, JSON parser, route mounts, centralized error handler
│   │   ├── config/
│   │   │   ├── database.js     # PrismaClient singleton instance
│   │   │   ├── env.js          # Centralized configuration mapping process.env with fallbacks
│   │   │   └── redis.js        # Redis connection options for BullMQ
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js     # JWT bearer token authentication middleware (requireAuth)
│   │   │   ├── validate.middleware.js # Zod schema validation middleware
│   │   │   └── error.middleware.js    # Global error handler with ApiError formatting
│   │   ├── utils/
│   │   │   ├── ApiError.js     # Operational API error class with status code helpers
│   │   │   ├── jwt.js          # JWT sign and verify helpers
│   │   │   └── logger.js       # Minimal structured console logger
│   │   ├── queues/
│   │   │   └── analysis.queue.js      # BullMQ queue definition ("analysis-queue") and job dispatchers
│   │   ├── workers/
│   │   │   └── analysis.worker.js     # BullMQ worker: multi-stage lifecycle, DB status sync, engine calls
│   │   ├── routes/
│   │   │   ├── health.routes.js       # GET /health, GET /health/services
│   │   │   ├── auth.routes.js         # POST /auth/register, POST /auth/login, GET /users/me
│   │   │   ├── area.routes.js         # Full CRUD: /areas, /areas/:areaId
│   │   │   ├── satellite.routes.js    # GET /scenes, GET /scenes/search, GET /scenes/:sceneId
│   │   │   ├── signature.routes.js    # POST /signatures, GET /signatures, DELETE /signatures/:id
│   │   │   └── analysis.routes.js     # POST /analysis, GET /analysis, results, preview, raster, polygons
│   │   ├── controllers/
│   │   │   ├── health.controller.js   # Health check controller
│   │   │   ├── auth.controller.js     # User registration, login, profile retrieval
│   │   │   ├── area.controller.js     # AOI handlers
│   │   │   ├── satellite.controller.js# Scene listing and search handlers
│   │   │   ├── signature.controller.js# Target signature handlers
│   │   │   └── analysis.controller.js # Analysis dispatch, polling, artifact delivery, cancellation
│   │   └── services/
│   │       ├── auth.service.js        # User password hashing, JWT generation, duplicate checks
│   │       ├── area.service.js        # Area GeoJSON polygon validation and ownership enforcement
│   │       ├── satellite.service.js   # Scene seeders (Indian Pines, PaviaU, EMIT) and search queries
│   │       ├── signature.service.js   # USGS reference library seeders and vector array validation
│   │       ├── analysis.service.js    # Analysis creation, artifact resolution, path traversal guards
│   │       └── aiEngine.service.js    # Axios client communicating with FastAPI on port 8000
│   └── tests/
│       ├── health.test.js      # Unit/integration tests for health checks
│       ├── auth.test.js        # Tests for registration, login, JWT validation
│       ├── area.test.js        # Tests for AOI polygon validation and ownership
│       ├── scenes.test.js      # Tests for scene seeding, catalog listing, search
│       ├── signatures.test.js  # Tests for spectral library CRUD and public vs private access
│       ├── analysis.test.js    # End-to-end BullMQ queue dispatch and lifecycle tests
│       └── results.test.js     # Tests for artifact delivery (PNG, GeoTIFF, GeoJSON)
│
├── ai-engine/                  # Scientific Computing & AI Provider Backend (Python 3.13/FastAPI)
│   ├── requirements.txt        # Python package dependencies
│   ├── pytest.ini              # Pytest configuration
│   ├── .env.example            # Environment template for AI engine
│   ├── app/
│   │   ├── main.py             # FastAPI entrypoint, CORS configuration, router mounts
│   │   ├── core/
│   │   │   ├── config.py       # Pydantic Settings parsing .env, CORS origins, model IDs
│   │   │   └── __init__.py
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── health.py   # GET /health
│   │   │   │   ├── analysis.py # POST /internal/v1/analysis/run (Protected by X-Internal-API-Key)
│   │   │   │   └── ai.py       # POST /internal/v1/ai/explain, GET /internal/v1/ai/providers
│   │   │   └── __init__.py
│   │   ├── preprocessing/
│   │   │   ├── validation.py   # Cube dimensions check, float casting, NaN/Inf sanitization
│   │   │   ├── bad_bands.py    # Variance filtering & atmospheric water vapor window removal
│   │   │   ├── normalization.py# L2, standard (z-score), and min-max spectral normalization
│   │   │   ├── dimensionality.py # Scikit-learn PCA dimensionality reduction
│   │   │   └── __init__.py
│   │   ├── algorithms/
│   │   │   ├── rxd.py          # Reed-Xiaoli statistical anomaly detector (Mahalanobis distance)
│   │   │   ├── matched_filter.py # Matched Filter (MF) target detector
│   │   │   ├── cem.py          # Constrained Energy Minimization (CEM) target detector
│   │   │   ├── fusion.py       # Score fusion combining normalized target and anomaly maps
│   │   │   └── __init__.py
│   │   ├── geospatial/
│   │   │   ├── raster.py       # GeoTIFF export via Rasterio preserving CRS and affine transforms
│   │   │   ├── vector.py       # Detection polygonization into GeoJSON FeatureCollections
│   │   │   ├── preview.py      # 8-bit RGBA PNG heatmap generator via Matplotlib colormaps & PIL
│   │   │   └── __init__.py
│   │   ├── evaluation/
│   │   │   ├── metrics.py      # Ground-truth evaluation: ROC curve, AUC, Pd at fixed Pfa, F1
│   │   │   └── __init__.py
│   │   ├── providers/
│   │   │   ├── base.py         # BaseAIProvider abstract interface and prompt builder
│   │   │   ├── schemas.py      # Pydantic models for orchestration requests, results, statuses
│   │   │   ├── orchestrator.py # AIOrchestrator: parallel async dispatch with failure isolation
│   │   │   ├── nvidia_provider.py      # NVIDIA NIM adapter (integrate.api.nvidia.com)
│   │   │   ├── huggingface_provider.py # Hugging Face router adapter (router.huggingface.co)
│   │   │   ├── nararouter_provider.py  # NaraRouter adapter (api.nararouter.com)
│   │   │   └── __init__.py
│   │   └── services/
│   │       ├── analysis_service.py # ScientificAnalysisService: end-to-end execution pipeline
│   │       └── __init__.py
│   └── tests/
│       ├── test_health.py      # Tests for FastAPI health endpoint
│       ├── test_preprocessing.py # Tests for bad bands, normalization, PCA, cube validation
│       ├── test_algorithms.py  # Mathematical tests for RXD, MF, CEM, and Fusion
│       ├── test_geospatial.py  # Tests for GeoTIFF export, GeoJSON polygonization, PNG previews
│       ├── test_evaluation.py  # Tests for ROC AUC calculation and Youden's J statistic
│       ├── test_pipeline.py    # Tests for ScientificAnalysisService end-to-end execution
│       ├── test_ai_providers.py# Tests for AI orchestrator, provider isolation, fallback rules
│       └── test_analysis.py    # Tests for internal HTTP route handlers
│
└── frontend/                   # Scientific Workstation Frontend (React 18/TypeScript/Vite/Tailwind)
    ├── package.json            # Node dependencies and scripts
    ├── tsconfig.json           # Compiler options, strict typing, path aliases (@/* -> src/*)
    ├── tsconfig.node.json      # Vite config TypeScript setup
    ├── vite.config.ts          # Vite configuration with React plugin and server port 3000
    ├── tailwind.config.js      # Custom workstation theme tokens, colors, shadows, typography
    ├── postcss.config.js       # PostCSS plugins (Tailwind, Autoprefixer)
    ├── index.html              # HTML shell loading Inter & JetBrains Mono fonts
    └── src/
        ├── main.tsx            # Application entrypoint mounting React 18 createRoot
        ├── app/
        │   ├── App.tsx         # Root component registering ToastProvider & global shortcuts
        │   ├── router.tsx      # React Router 6 configuration mapping all 11 workstation routes
        │   └── providers/
        │       └── ToastProvider.tsx # Provider rendering the floating toast notification stack
        ├── components/
        │   ├── ui/             # Reusable core design system components
        │   │   ├── Button.tsx  # Variants (primary, secondary, outline, ghost, destructive)
        │   │   ├── Input.tsx   # Text, search with clear, password with reveal, number
        │   │   ├── Select.tsx  # Styled custom select dropdown
        │   │   ├── Checkbox.tsx# Checkbox with indeterminate and sub-description support
        │   │   ├── Switch.tsx  # Toggle switch in sm and md sizes
        │   │   ├── Badge.tsx   # Status and category badges with optional animated dot
        │   │   ├── Card.tsx    # Card container, Header, Title, Description, Content, Footer
        │   │   ├── Tooltip.tsx # Accessible tooltips with 4-way positioning and delay
        │   │   ├── Modal.tsx   # Dialog window with backdrop blur and escape key listener
        │   │   ├── Tabs.tsx    # Underline and pill variants for toolbars and panels
        │   │   ├── Avatar.tsx  # User avatar with fallback initials and status indicators
        │   │   ├── Divider.tsx # Horizontal/vertical dividers with optional uppercase label
        │   │   └── IconButton.tsx # Icon buttons with built-in tooltip integration
        │   ├── layout/         # Shell navigation and page layout wrappers
        │   │   ├── AppLayout.tsx  # Master shell orchestrating Sidebar, TopNav, and Main Outlet
        │   │   ├── Sidebar.tsx    # Collapsible sidebar with brand header and grouped navigation
        │   │   ├── TopNav.tsx     # Breadcrumbs, global search, alerts, theme, and user dropdown
        │   │   ├── NavItem.tsx    # Navigation item with active route styling and tooltip on collapse
        │   │   └── PageHeader.tsx # Standardized page title, category pill, and action buttons bar
        │   └── feedback/       # Asynchronous status and feedback components
        │       ├── Toast.tsx      # Floating toast alert message items and container
        │       ├── Spinner.tsx    # Circular loading spinners in 5 sizes and 4 colors
        │       ├── Skeleton.tsx   # Animated pulse skeleton loaders for cards and text lines
        │       ├── EmptyState.tsx # Standardized empty data container with action slot
        │       ├── ErrorState.tsx # Standardized error container with error code and retry button
        │       └── ConfirmDialog.tsx # Modal dialog for confirming destructive actions
        ├── features/
        │   ├── placeholder/
        │   │   ├── routeSpecs.ts  # Architectural metadata and specs for all 11 routes
        │   │   └── PlaceholderPage.tsx # Polished placeholder view rendering specs & contracts
        │   └── showcase/
        │       └── ComponentShowcase.tsx # Live interactive testing workbench for all UI components
        ├── hooks/
        │   ├── useToast.ts     # Zustand store and hook for firing typed toast alerts
        │   └── useLayoutStore.ts # Zustand store managing sidebar collapse and mobile drawer states
        ├── constants/
        │   ├── navigation.ts   # Navigation hierarchy config (WORKSPACE, INTELLIGENCE, SYSTEM)
        │   └── theme.ts        # Programmatic hex color tokens
        ├── types/
        │   └── navigation.ts   # TypeScript interfaces for navigation items and sections
        ├── lib/
        │   └── utils.ts        # cn(...) class merging utility (clsx + tailwind-merge)
        └── styles/
            ├── tokens.css      # CSS custom properties defining palette and dimensions
            └── globals.css     # Base Tailwind directives, scrollbar styles, tech grid background
```

---

## 5. Database Schema & Data Models

The PostgreSQL schema is defined in [backend/prisma/schema.prisma](file:///Users/madhavagarwal/GeoAstra/backend/prisma/schema.prisma) and applied via migration `20261111000000_init_core_models`:

```
                       +-------------------+
                       |       User        |
                       |-------------------|
                       | id (UUID, PK)     |
                       | name (String)     |
                       | email (Unique)    |<-------------+
                       | passwordHash      |              |
                       | createdAt         |              |
                       | updatedAt         |              |
                       +-------------------+              |
                         |               |                |
                         | owns          | creates        |
                         v               v                |
        +-------------------+     +---------------------+ |
        |       Area        |     |   TargetSignature   | |
        |-------------------|     |---------------------| |
        | id (UUID, PK)     |     | id (UUID, PK)       | |
        | userId (FK)       |     | ownerUserId (FK,Opt)|-+ (SetNull on delete)
        | name (String)     |     | name (String)       |
        | geometry (JSONB)  |     | sensor (String)     |
        | crs (Default 4326)|     | wavelengths (JSONB) |
        | createdAt         |     | values (JSONB)      |
        | updatedAt         |     | units, source       |
        +-------------------+     +---------------------+
                  |                          |
                  | defines AOI              | supplies reference
                  v                          v
+-------------------------------------------------------------+
|                          Analysis                           |
|-------------------------------------------------------------|
| id (UUID, PK)                                               |
| userId (FK to User, Cascade)                                |
| areaId (FK to Area, Cascade)                                |
| sceneId (FK to SatelliteScene, Cascade)                     |
| targetSignatureId (FK to TargetSignature, SetNull)          |
| status (Enum: QUEUED, ACQUIRING_DATA, PREPROCESSING,        |
|               RUNNING_ALGORITHMS, GENERATING_OUTPUTS,       |
|               COMPLETED, FAILED, CANCELLED)                 |
| algorithmConfiguration (JSONB)                              |
| startedAt (DateTime, Nullable)                              |
| completedAt (DateTime, Nullable)                            |
| errorMessage (String, Nullable)                             |
| createdAt, updatedAt                                        |
+-------------------------------------------------------------+
       ^                         |                    |
       | references raster       | produces           | records
       |                         v                    v
+-------------------------+ +---------------------+ +----------------------+
|     SatelliteScene      | |   DetectionResult   | |     ProviderRun      |
|-------------------------| |---------------------| |----------------------|
| id (String, PK)         | | id (UUID, PK)       | | id (UUID, PK)        |
| provider (String)       | | analysisId (FK)     | | analysisId (FK)      |
| sensor (String)         | | resultType (String) | | provider (String)    |
| externalSceneId (String)| | algorithm (String)  | | model (String)       |
| acquisitionTime         | | rasterStorageKey    | | task (String)        |
| footprint (JSONB)       | | vectorStorageKey    | | status (String)      |
| productLevel (String)   | | previewStorageKey   | | responseJson (JSONB) |
| cloudOrQualityMetadata  | | metricsJson (JSONB) | | latencyMs (Integer)  |
| wavelengthMetadata      | | processingMetadata  | | usageJson (JSONB)    |
| spatialResolution       | | createdAt           | | error (String)       |
| storageKey (Nullable)   | +---------------------+ +----------------------+
| metadataJson (JSONB)    |
| createdAt               |
+-------------------------+
```

### Important Schema Characteristics
1. **JSONB Geometry Storage:** Geometry in `Area` and footprints in `SatelliteScene` are stored as PostgreSQL `JSONB` structures (standard GeoJSON Polygons/MultiPolygons). They do not currently use PostGIS spatial columns (`geometry(Polygon, 4326)`).
2. **AnalysisStatus Lifecycle:** The `AnalysisStatus` enum controls the state machine:
   `QUEUED` $\to$ `ACQUIRING_DATA` $\to$ `PREPROCESSING` $\to$ `RUNNING_ALGORITHMS` $\to$ `GENERATING_OUTPUTS` $\to$ `COMPLETED` (or `FAILED` / `CANCELLED`).
3. **Public vs Private Target Signatures:** If `TargetSignature.ownerUserId` is `NULL`, the signature is a system-wide public standard (e.g., USGS library Kaolinite or Chlorophyll) and cannot be deleted by users.

---

## 6. Development Progress Against `task.md`

Every phase and milestone in [task.md](file:///Users/madhavagarwal/GeoAstra/task.md) was audited directly against the source code:

| Milestone / Phase | Documented Goal | Actual Code Status | Implementation Verification |
| :--- | :--- | :--- | :--- |
| **Milestone 01: Backend Foundation** | Monorepo structure, Express on 5001, FastAPI on 8000, health checks | **100% Complete** | Express (`/health`, `/health/services`), FastAPI (`/health`), inter-service HTTP communication verified. |
| **Milestone 02: Database & Auth** | PostgreSQL, Prisma models, migrations, JWT auth, Area CRUD | **100% Complete** | Prisma migration applied, bcrypt hashing, JWT middleware, Area GeoJSON validation tested. |
| **Milestone 03: Job Infrastructure** | Redis, BullMQ queue, worker lifecycle, status transitions | **100% Complete** | BullMQ `analysis-queue` active, stage updates (`QUEUED` to `COMPLETED`), job cancellation supported. |
| **Milestone 04: Satellite Data Catalog** | Scene discovery, metadata ingestion, benchmark scenes | **85% Complete (Caveat)** | 3 benchmark scenes seeded (`Indian_pines`, `PaviaU`, `EMIT_001`). Scene search works on metadata, but **spatial intersect search is missing**. |
| **Milestone 05: Scientific Algorithms** | RXD, Matched Filter, CEM, Score Fusion, PCA, Bad Bands | **100% Complete** | Vectorized NumPy/SciPy algorithms in `ai-engine/app/algorithms/` verified with comprehensive tests. |
| **Milestone 06: AI Providers** | NVIDIA NIM, Hugging Face, NaraRouter, Rule Synthesizer | **100% Complete** | Concurrency via `asyncio.gather`, failure isolation, deterministic rule fallback when offline. |
| **Milestone 07: Backend Workflow** | End-to-end scene-to-result, artifact delivery, integration tests | **100% Complete** | Express serves `/preview` (PNG), `/raster` (GeoTIFF), `/polygons` (GeoJSON). Integration tests passing. |
| **Frontend Phase 1: Design System & Shell** | React 18, Vite, TS, Tailwind, Design Tokens, 19 Components, Shell Layout | **100% Complete** | Production build verified. 10 refined workstation pages mounted with sample data banners. Interactive Component Showcase live at `/design-system`. |
| **Frontend Phase 2: Client Authentication** | Mock Auth Architecture, Session Persistence, Remember Me, Protected Routes | **100% Complete** | Centralized `mockAuthService`, `useAuthStore`, `useAuth`, `AuthLayout`, `AuthBranding`, `PasswordInput`, `AuthDivider`, `LoginPage`, `RegisterPage`, `ProtectedRoute`, and dynamic `TopNav` profile menu. Verified with default demo account `analyst@geoastra.demo` / `GeoAstra@123`. |
| **Frontend Phase 3: Mission Dashboard** | Information-rich Command Center, Recharts, Metric Cards, Trends, Quick Actions | **100% Complete** | Centralized `dashboardMockData.ts`, `WelcomeSection` with dynamic time-based greeting and user name, 4 `MetricCard`s, `RecentAnalyses` list with status lifecycles, `RecentAOIs`, `RecentScenes` with benchmark indicators, `SystemStatus` node architecture, `AlgorithmActivityChart` (Recharts Bar), `DetectionActivityChart` (Recharts Area), and 6 operational `QuickActions`. |
| **Frontend Phase 4: Geospatial Studio** | Leaflet / MapLibre, AOI drawing, Scene Explorer, Spectral Lib | **0% (Next Task)** | Pending implementation. |
| **Frontend Phase 5: Analysis & Polling** | Analysis launch modal, BullMQ polling hook, result maps | **0% (Pending)** | Pending implementation. |

---

## 7. Known Architectural Caveats, Mismatches & Technical Debt

Future developers must be aware of these verified discrepancies before writing integration code:

### 1. Algorithm Name Mismatch (`combined` vs `fusion`) — *CRITICAL*
- **Symptom:** In [backend/src/routes/analysis.routes.js](file:///Users/madhavagarwal/GeoAstra/backend/src/routes/analysis.routes.js#L13), the Zod schema permits:
  `algorithm: z.enum(["rxd", "matched_filter", "cem", "combined", "fusion"])`.
- **Bug:** In [ai-engine/app/services/analysis_service.py](file:///Users/madhavagarwal/GeoAstra/ai-engine/app/services/analysis_service.py#L158-L176), the engine only checks `elif algo_name == "fusion":`. If a client passes `"combined"`, Python throws:
  `ValueError: Unsupported algorithm: 'combined'. Supported: rxd, matched_filter, cem, fusion`.
- **Rule for Frontend:** **Always pass `"fusion"`, never `"combined"`.**

### 2. Response Envelope Inconsistency — *MEDIUM*
- **Symptom:** Express controllers do not use a unified JSON response envelope.
  - Auth, Area, and Analysis endpoints return: `{ "success": true, "data": { ... } }`
  - Scene and Signature endpoints return: `{ "status": "success", "data": [ ... ] }`
- **Rule for Frontend:** The Axios response interceptor must normalize both structures:
  `const data = response.data.data !== undefined ? response.data.data : response.data;`

### 3. Missing Dataset File Upload API — *HIGH*
- **Symptom:** There is no multipart file upload route or Multer middleware in the Express backend.
- **Current Workaround:** Scene cubes must reside in `storage/input/*.mat`. If a requested scene file is missing, the Python engine automatically generates a deterministic synthetic hyperspectral cube ($100 \times 100 \times 50$) with an injected anomaly cluster so the pipeline completes without crashing.

### 4. BullMQ Progress Not Stored in PostgreSQL — *MEDIUM*
- **Symptom:** The worker calls `job.updateProgress(20...100)`, which writes to Redis, but this percentage is not written to the PostgreSQL `analyses` table.
- **Rule for Frontend:** The polling client (`GET /api/v1/analysis/:analysisId`) receives the `status` enum. The UI should map statuses to progress bar percentages:
  `QUEUED`: 10%, `ACQUIRING_DATA`: 25%, `PREPROCESSING`: 45%, `RUNNING_ALGORITHMS`: 65%, `GENERATING_OUTPUTS`: 85%, `COMPLETED`: 100%.

### 5. No Spatial Intersection Query in Scene Search — *MEDIUM*
- **Symptom:** `GET /api/v1/scenes/search` accepts `sensor`, `provider`, `startDate`, `endDate`, but does not accept an AOI geometry or bounding box.
- **Rule for Frontend:** When matching scenes to an AOI, the frontend should fetch scenes and perform client-side polygon intersection checks using `@turf/boolean-intersects`.

### 6. PostGIS Container vs Schema Types — *LOW*
- **Symptom:** PostGIS 3.4 is installed in Docker, but Prisma models use `Json` columns instead of spatial `Unsupported("geometry")` types.
- **Rule:** Treat all geometries as pure GeoJSON objects.

---

## 8. Design System & UI/UX Principles

The frontend follows the **Scientific Workstation Design Philosophy**:

### 8.1 Palette & Design Tokens
```css
/* Surface Colors */
--color-surface-main:      #0B1220;  /* Workstation base viewport */
--color-surface-secondary: #101B2D;  /* Sidebar & top navigation background */
--color-surface-panel:     #142235;  /* Cards and tool windows */
--color-surface-elevated:  #192B40;  /* Dropdowns, modals, floating panels */
--color-surface-hover:     #1F344F;  /* Hover state on panels */

/* Border & Separation */
--color-border-subtle:     #26364A;  /* Standard component borders */
--color-border-strong:     #3B4E66;  /* Focused / active borders */

/* Scientific Accents */
--color-accent-primary:    #38BDF8;  /* Sky/Cyan 400: Primary actions, active tabs */
--color-accent-secondary:  #818CF8;  /* Indigo 400: Secondary markers, telemetry */

/* Status Indicators */
--color-status-success:    #4ADE80;  /* Green 400: Completed jobs, online status */
--color-status-warning:    #FBBF24;  /* Amber 400: Warnings, quotas */
--color-status-danger:     #F87171;  /* Red 400: Failures, destructive actions */

/* Typography & Content */
--color-content-primary:   #F1F5F9;  /* Slate 100: Headings, values */
--color-content-secondary: #94A3B8;  /* Slate 400: Labels, secondary text */
--color-content-muted:     #64748B;  /* Slate 500: Helper text, breadcrumbs */
```

### 8.2 Workstation UX Guidelines
- **High Information Density:** Compact typography (`11px` to `14px`), narrow padding (`px-3 py-1.5`), and minimal whitespace waste.
- **Visual Contrast & Legibility:** Minimum 4.5:1 WCAG contrast ratio across all text and border boundaries.
- **Keyboard Accelerators:** Workstation navigation supports keyboard shortcuts:
  - `[` : Toggle sidebar collapse / expand.
  - `⌘K` or `Ctrl+K` : Global search focus.
  - `Esc` : Close modals, dropdowns, and overlays.
- **No Scientific Guessing:** Always display units (e.g., `$\mu\text{m}$`, `nm`, `m`, `ms`), sensor names, and calibration levels (`L2A_Surface_Reflectance`).

---

## 9. Local Development & Operational Runbook

### 9.1 Prerequisites
- **Node.js** `>= 20.0.0`
- **Python** `3.13`
- **Docker Desktop** (for PostgreSQL and Redis containers)

### 9.2 Step 1: Start Infrastructure (Database & Redis)
Ensure Docker is running, then execute from the repository root:
```bash
docker compose up -d
```
Verify containers are healthy:
```bash
docker compose ps
# Expected: geospectra-postgres (healthy on 5433), geospectra-redis (healthy on 6379)
```

### 9.3 Step 2: Configure and Start Scientific Engine (`ai-engine`)
```bash
cd ai-engine
python3.13 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- Health Check: `http://127.0.0.1:8000/health`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

### 9.4 Step 3: Configure and Start Application Backend (`backend`)
```bash
cd backend
npm install
cp .env.example .env

# Run Prisma migration to ensure PostgreSQL tables exist
npx prisma migrate dev --name init_core_models

# Start development server (with BullMQ worker initialized)
npm run dev
```
- Express Health: `http://127.0.0.1:5001/health`
- Integrated Services Diagnostic: `http://127.0.0.1:5001/api/v1/health/services`

### 9.5 Step 4: Configure and Start Frontend Workstation (`frontend`)
```bash
cd frontend
npm install
npm run dev
```
- Frontend Workstation: `http://localhost:3000`
- Component Showcase: `http://localhost:3000/design-system`

### 9.6 Running Test Suites
- **Backend Tests (Node.js native test runner):**
  ```bash
  cd backend && npm test
  ```
- **Scientific Engine Tests (Pytest):**
  ```bash
  cd ai-engine && source .venv/bin/activate && pytest tests/
  ```
- **Frontend Type-Check & Production Build:**
  ```bash
  cd frontend && npm run build
  ```

---

## 10. Environment Variables Reference

> [!CAUTION]
> **Security Rule:** Never commit `.env` files or expose real API keys, passwords, or tokens in documentation or code. Use the documented environment variable keys below.

### Backend (`backend/.env`)
| Variable | Default / Example | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `development` | Runtime environment mode |
| `PORT` | `5001` | Express HTTP server port (5001 prevents macOS AirPlay conflicts) |
| `DATABASE_URL` | `postgresql://geospectra:...@localhost:5433/geospectra?schema=public` | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection for BullMQ job queue |
| `JWT_SECRET` | `dev-secret-key-geospectra-...` | Secret key for signing authentication JWTs |
| `JWT_EXPIRES_IN` | `7d` | Token expiration duration |
| `AI_ENGINE_URL` | `http://localhost:8000` | URL of the internal Python scientific engine |
| `INTERNAL_API_KEY`| `dev-secret-key-geospectra` | Shared secret header `X-Internal-API-Key` |
| `AI_ENGINE_TIMEOUT_MS` | `10000` | HTTP timeout when calling Python engine |

### AI Engine (`ai-engine/.env`)
| Variable | Default / Example | Purpose |
| :--- | :--- | :--- |
| `ENVIRONMENT` | `development` | Runtime environment mode |
| `HOST` | `0.0.0.0` | Bind host |
| `PORT` | `8000` | FastAPI server port |
| `CORS_ORIGINS` | `["http://localhost:5000","http://localhost:5001","http://localhost:3000"]` | Allowed CORS origins |
| `INTERNAL_API_KEY`| `dev-secret-key-geospectra` | Required header `X-Internal-API-Key` |
| `NVIDIA_NIM_API_KEY` | *(Secret)* | API key for NVIDIA NIM LLM inference |
| `NVIDIA_NIM_MODEL_ID`| `nvidia/llama-3.1-nemotron-70b-instruct` | NVIDIA model identifier |
| `HUGGINGFACE_ACCESS_TOKEN` | *(Secret)* | Hugging Face inference router token |
| `HUGGINGFACE_MODEL_ID` | `meta-llama/Llama-3.2-3B-Instruct` | Hugging Face model identifier |
| `NARAROUTER_API_KEY` | *(Secret)* | NaraRouter inference API key |
| `NARAROUTER_MODEL_ID`| `deepseek/deepseek-chat` | NaraRouter model identifier |

---

## 11. Current Development State & Exact Next Tasks

### 11.1 Most Recently Completed
- **Phase 1: Design System & Application Shell** (Committed in `dd0c5f0`):
  - Created complete React 18 / TypeScript / Vite / Tailwind frontend in `frontend/`.
  - Built 19 design system components with accessibility and typing.
  - Implemented collapsible sidebar shell with WORKSPACE, INTELLIGENCE, and SYSTEM navigation.
  - Implemented top navigation bar with search trigger, notifications, and user avatar dropdown.
  - Mounted 11 route shells and an interactive Component Showcase (`/design-system`).
  - Production build verified with zero TypeScript errors.
- **Phase 2: API Client Foundations & Authentication Wiring**:
  - Installed and configured `axios` client with automatic Bearer token injection and envelope unwrapping.
  - Implemented complete typed API services: `authApi`, `healthApi`, `areaApi`, `sceneApi`, `signatureApi`, and `analysisApi` (with automatic algorithm `combined` -> `fusion` sanitization).
  - Built `useAuthStore` with local storage persistence and session initialization on boot.
  - Implemented `LoginPage` and `RegisterPage` with dark-first scientific workstation aesthetics and one-click demo login.
  - Implemented `ProtectedRoute` guarding all application workstation routes.
  - Implemented real diagnostic `StatusPage` with live polling of Express backend and Python AI engine health.
  - Updated `TopNav` with real user avatar information, working logout, and live telemetry status badge.

### 11.2 What Is Currently Working
- Backend API server (Port 5001) fully operational with authentication, AOI CRUD, scene seeding, signature library, and analysis queueing.
- AI scientific engine (Port 8000) fully operational with verified mathematical implementations of RXD, Matched Filter, CEM, Score Fusion, GeoTIFF exports, GeoJSON polygonization, and LLM explanation.
- Frontend workstation shell (Port 3000) fully operational with active route transitions, sidebar collapse animation, toast notifications, component workbench, authentication routes (`/login`, `/register`), session restoration, and live service status telemetry.

### 11.3 What Remains Unfinished
- **Frontend Phase 3:** Interactive cartographic canvas (Leaflet or MapLibre GL for drawing AOI polygons, inspecting scene footprints, and viewing spectral reflectance curves).
- **Frontend Phase 4:** Analysis launch modal, BullMQ polling controller, and result visualization (overlaying PNG heatmaps, GeoJSON vectors, and plotting ROC curves).

### 11.4 Immediate Next Development Tasks
When resuming work on GeoAstra, the immediate next milestone is:
**Phase 3: Geospatial Workstation Canvas & Catalog Exploration**
1. Integrate interactive mapping library (`leaflet` + `react-leaflet` or `maplibre-gl`) in `frontend/`.
2. Build **Geospatial Studio** (`/workspace`):
   - Polygon drawing and vertex editing tools for defining AOIs.
   - Coordinate reference system inspector (default EPSG:4326).
   - CRUD management for user's saved areas (`areaApi.listAreas`, `createArea`, `deleteArea`).
3. Build **Scene Explorer** (`/scenes`):
   - Interactive table/grid for browsing satellite scenes (`sceneApi.listScenes`).
   - Overlay scene bounding box footprints on the map canvas.
   - Sensor filter pills (AVIRIS, ROSIS, EMIT).
4. Build **Spectral Library** (`/signatures`):
   - Interactive list of reference signatures (`signatureApi.listSignatures`).
   - Reflectance vs wavelength curve chart viewer.
   - Custom signature creation modal (`signatureApi.createSignature`).

---

## 12. Mandatory Instructions for Future AI Agents

Any AI agent interacting with this repository must strictly adhere to the following directives:

1. **Read This File First:** Do not modify code without reviewing this document and understanding the system boundaries.
2. **Inspect Existing Implementations:** Always inspect the actual files before generating code. Never assume functionality is missing based solely on a task title or checklist.
3. **Never Recreate Existing Features:** Do not reimplement existing components (e.g., `Button`, `Modal`, `Toast`, `Sidebar`). Import them from `@/components/ui/` or `@/components/feedback/`.
4. **Preserve Scientific Authority:** Never allow LLM providers or generative models to calculate or modify hyperspectral detection scores. Scientific calculations must remain within `ai-engine/app/algorithms/`.
5. **Respect Design Tokens:** Never inject arbitrary inline hex codes or non-standard Tailwind colors. Use the centralized tokens defined in `tailwind.config.js` and `tokens.css` (`surface-*`, `accent-*`, `status-*`, `content-*`).
6. **Maintain Codebase Separation:** Do not blend backend Express logic into `frontend/` or scientific Python logic into `backend/`. Keep the decoupled multi-tier boundaries intact.
7. **Handle Caveats Intentionally:**
   - Always pass `algorithm: "fusion"` (never `"combined"`).
   - Normalize API responses in the API client layer.
   - Use client-side polygon intersection for AOI scene discovery.
8. **Update This Context Document:** When completing significant milestones or architectural changes, update `PROJECT_CONTEXT.md` to reflect the new state, versions, and progress.
9. **Ask for Clarification:** If a remote sensing or mathematical requirement is ambiguous, request clarification from the user rather than inventing speculative behavior.

