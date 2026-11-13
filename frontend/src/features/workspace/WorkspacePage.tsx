import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";
import {
  Layers,
  MapPin,
  Crosshair,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Compass,
  Activity,
  AlertTriangle,
} from "lucide-react";

export const WorkspacePage: React.FC = () => {
  // Layer visibility toggles (sample UI state)
  const [showTrueColor, setShowTrueColor] = useState(true);
  const [showSwirComposite, setShowSwirComposite] = useState(true);
  const [showDetectionMask, setShowDetectionMask] = useState(true);
  const [showVectorAoi, setShowVectorAoi] = useState(true);
  const [activeBandIndex, setActiveBandIndex] = useState(145);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-5">
      {/* Page Header */}
      <PageHeader
        category="PRIMARY WORKSPACE"
        title="Geospatial Intelligence Studio"
        subtitle="Primary analytical viewport for multi-band hyperspectral raster inspection, false-color composite synthesis, and spatial target pinpointing."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md" dot>
              MAP CANVAS PREVIEW
            </Badge>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-3 rounded-lg border border-status-warning/30 bg-status-warning/10 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span className="text-content-secondary">
            <strong className="text-status-warning font-semibold">Interactive Studio Viewport:</strong> The spatial canvas below demonstrates the workstation layout prepared for MapLibre GL and COG raster rendering in future milestones.
          </span>
        </div>
        <Badge variant="outline" size="sm" className="hidden sm:inline-flex">
          EPSG:4326 (WGS84)
        </Badge>
      </div>

      {/* Workspace Coordinates HUD Bar */}
      <div className="px-4 py-2.5 rounded-lg bg-surface-secondary/70 border border-border-subtle flex flex-wrap items-center justify-between gap-3 text-2xs font-mono text-content-secondary">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-accent-primary">
            <Crosshair className="w-3.5 h-3.5" />
            <span>CROSSHAIR:</span>
            <span className="text-content-primary">31°58'07.0"N 102°05'55.7"W</span>
          </span>
          <span className="hidden md:inline text-content-muted">|</span>
          <span className="hidden md:inline">
            ELEV: <span className="text-content-primary">874 m</span>
          </span>
          <span className="hidden md:inline text-content-muted">|</span>
          <span className="hidden md:inline">
            SCALE: <span className="text-content-primary">1 : 25,000 (3.8m/px)</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-content-muted">ACTIVE CUBE:</span>
          <span className="text-content-primary font-semibold">AVIRIS_NG_PERMIAN_2024_03A</span>
          <Badge variant="primary" size="sm">
            425 BANDS
          </Badge>
        </div>
      </div>

      {/* Main Studio Grid: Left Layers | Center Viewport | Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
        {/* Left Column: Layer Tree & Spectral Channels (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card variant="elevated" className="h-full">
            <CardHeader className="pb-3 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-accent-primary" />
                  Raster &amp; Feature Layers
                </CardTitle>
                <Badge variant="outline" size="sm">
                  SAMPLE TREE
                </Badge>
              </div>
              <CardDescription className="text-2xs">
                Toggle display channels and detection overlays
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3.5 space-y-4">
              {/* Raster Overlays */}
              <div className="space-y-3">
                <span className="text-2xs font-mono uppercase tracking-wider text-content-muted block">
                  Active Channels
                </span>

                <div className="p-2.5 rounded bg-surface-secondary/50 border border-border-subtle space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-primary font-medium">
                      SWIR False Color (B180, B110, B45)
                    </span>
                    <Switch
                      checked={showSwirComposite}
                      onChange={setShowSwirComposite}
                    />
                  </div>
                  <p className="text-2xs text-content-muted">
                    Enhances hydrocarbon absorption features and soil moisture
                  </p>
                </div>

                <div className="p-2.5 rounded bg-surface-secondary/50 border border-border-subtle space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-primary font-medium">
                      True Color (RGB 660, 560, 480 nm)
                    </span>
                    <Switch
                      checked={showTrueColor}
                      onChange={setShowTrueColor}
                    />
                  </div>
                  <p className="text-2xs text-content-muted">
                    Calibrated surface reflectance in visible spectrum
                  </p>
                </div>

                <div className="p-2.5 rounded bg-surface-secondary/50 border border-border-subtle space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-status-warning font-medium flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-status-warning" />
                      CEM Detection Mask (Methane)
                    </span>
                    <Switch
                      checked={showDetectionMask}
                      onChange={setShowDetectionMask}
                    />
                  </div>
                  <p className="text-2xs text-content-muted">
                    Constrained Energy Minimization output heatmap overlay
                  </p>
                </div>

                <div className="p-2.5 rounded bg-surface-secondary/50 border border-border-subtle space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-content-primary font-medium flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-accent-primary" />
                      Vector AOI &amp; Target Hotspots
                    </span>
                    <Switch
                      checked={showVectorAoi}
                      onChange={setShowVectorAoi}
                    />
                  </div>
                  <p className="text-2xs text-content-muted">
                    Bounding boxes for confirmed spectral targets
                  </p>
                </div>
              </div>

              {/* Band Channel Slider */}
              <div className="pt-2 border-t border-border-subtle space-y-2">
                <div className="flex items-center justify-between text-2xs font-mono">
                  <span className="text-content-secondary">BAND SLICE PROBE</span>
                  <span className="text-accent-primary font-semibold">
                    Band #{activeBandIndex} (1658 nm)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="425"
                  value={activeBandIndex}
                  onChange={(e) => setActiveBandIndex(Number(e.target.value))}
                  className="w-full accent-accent-primary bg-surface-panel rounded h-1 cursor-pointer"
                />
                <div className="flex justify-between text-2xs font-mono text-content-muted">
                  <span>380 nm (VNIR)</span>
                  <span>2510 nm (SWIR)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center: Large Interactive Map Viewport Canvas (6 cols) */}
        <div className="lg:col-span-6 flex flex-col space-y-3">
          <div className="relative flex-1 min-h-[460px] rounded-lg border border-border-subtle bg-surface-panel/90 overflow-hidden flex flex-col">
            {/* Viewport Top Bar */}
            <div className="h-9 px-3 bg-surface-secondary/80 border-b border-border-subtle flex items-center justify-between z-10 shrink-0">
              <div className="flex items-center gap-2 text-2xs font-mono text-content-secondary">
                <Compass className="w-3.5 h-3.5 text-accent-primary" />
                <span>GEOSPATIAL VIEWPORT CANVAS</span>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Zoom in">
                  <ZoomIn className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Zoom out">
                  <ZoomOut className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" title="Maximize">
                  <Maximize2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Simulated Map / Raster Viewport Area */}
            <div className="relative flex-1 bg-[#090F1B] flex items-center justify-center overflow-hidden p-6">
              {/* Technical Grid Overlay */}
              <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

              {/* Concentric Coordinate Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full border border-border-subtle/40" />
                <div className="w-96 h-96 rounded-full border border-border-subtle/20" />
                <div className="absolute w-full h-[1px] bg-border-subtle/30" />
                <div className="absolute h-full w-[1px] bg-border-subtle/30" />
              </div>

              {/* Sample Target Detection Callout Box */}
              <div className="relative z-10 p-4 rounded-lg bg-surface-secondary/90 border border-status-warning/40 max-w-sm w-full backdrop-blur-md shadow-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant="warning" size="sm" dot>
                    TARGET DETECTED [SAMPLE]
                  </Badge>
                  <span className="font-mono text-2xs text-status-warning font-semibold">
                    CEM SCORE: 0.942
                  </span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-content-primary">
                    Methane Absorption Plume Alpha
                  </h4>
                  <p className="text-2xs text-content-secondary leading-relaxed">
                    Strong diagnostic absorption detected at SWIR-1 (1660 nm) and SWIR-2 (2320 nm). Spatial extent: 240m x 85m downwind plume.
                  </p>
                </div>
                <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between text-2xs font-mono text-content-muted">
                  <span>Coord: 31.9686°N, 102.0988°W</span>
                  <span className="text-accent-primary">Band: 145 / 425</span>
                </div>
              </div>

              {/* Viewport Bottom Controls: Scale Bar & North Arrow */}
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 px-2.5 py-1 rounded bg-surface-secondary/80 border border-border-subtle text-2xs font-mono text-content-muted">
                <div className="w-12 h-1 bg-accent-primary" />
                <span>500 m</span>
              </div>

              <div className="absolute bottom-3 right-3 z-10 px-2 py-1 rounded bg-surface-secondary/80 border border-border-subtle text-2xs font-mono text-content-secondary flex items-center gap-1">
                <span className="text-accent-primary font-bold">N</span>
                <span className="text-content-muted">0.0°</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pixel Probe & Spectral Curve Preview (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <Card variant="elevated" className="h-full">
            <CardHeader className="pb-3 border-b border-border-subtle">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-accent-primary" />
                  Pixel Spectra Probe
                </CardTitle>
                <Badge variant="outline" size="sm">
                  PROBE
                </Badge>
              </div>
              <CardDescription className="text-2xs">
                Real-time 224-channel reflectance at cursor
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3.5 space-y-4">
              {/* Illustrative Spectral Profile SVG */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-2xs font-mono">
                  <span className="text-content-secondary">Reflectance Profile</span>
                  <span className="text-accent-primary">r(x, y, &lambda;)</span>
                </div>
                <div className="h-32 w-full rounded bg-surface-panel border border-border-subtle p-2 flex flex-col justify-end">
                  <svg
                    viewBox="0 0 200 80"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="200" y2="20" stroke="#1E293B" strokeWidth="1" />
                    <line x1="0" y1="40" x2="200" y2="40" stroke="#1E293B" strokeWidth="1" />
                    <line x1="0" y1="60" x2="200" y2="60" stroke="#1E293B" strokeWidth="1" />
                    {/* Spectral reflectance curve with methane dip */}
                    <path
                      d="M 0 65 Q 30 55, 60 30 T 90 25 T 120 70 T 140 30 T 170 75 T 200 40"
                      fill="none"
                      stroke="#38BDF8"
                      strokeWidth="2"
                    />
                    {/* Target signature overlay */}
                    <path
                      d="M 0 60 Q 30 50, 60 28 T 90 22 T 120 75 T 140 28 T 170 78 T 200 38"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                      strokeDasharray="3,3"
                    />
                  </svg>
                  <div className="flex justify-between text-[9px] font-mono text-content-muted mt-1">
                    <span>400 nm</span>
                    <span className="text-status-warning">1660 nm</span>
                    <span>2500 nm</span>
                  </div>
                </div>
              </div>

              {/* Probe Coordinates and Pixel Stats */}
              <div className="space-y-2 border-t border-border-subtle pt-3 text-2xs font-mono">
                <div className="flex justify-between">
                  <span className="text-content-muted">Pixel Grid (X, Y):</span>
                  <span className="text-content-primary">1420, 894</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Wavelength (&lambda;):</span>
                  <span className="text-accent-primary">1658.4 nm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">Reflectance value:</span>
                  <span className="text-content-primary font-semibold">0.418</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">SNR at band:</span>
                  <span className="text-status-success">380 : 1</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  Export Spectral Curve (CSV)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
