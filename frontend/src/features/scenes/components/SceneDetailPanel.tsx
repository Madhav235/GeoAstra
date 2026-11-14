import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ExternalLink,
  MapPin,
  Ruler,
  Satellite,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { MapCanvas } from "@/features/geospatial/components/MapCanvas";
import { getMapInstance, useMapInstance } from "@/features/geospatial/hooks/useMapInstance";
import { useGeospatialStore } from "@/features/geospatial/store/geospatialStore";
import { SceneCatalogItem } from "../types";

interface SceneDetailPanelProps {
  scene: SceneCatalogItem;
  selected: boolean;
  onToggleSelection: () => void;
  onReturn: () => void;
}

function display(value: string | number | null | undefined, suffix = ""): string {
  return value === null || value === undefined || value === "" ? "Unknown" : `${value}${suffix}`;
}

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "Unknown";
  if (bytes === 0) return "0 bytes";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1000)), units.length - 1);
  return `${(bytes / 1000 ** index).toFixed(index > 1 ? 2 : 1)} ${units[index]}`;
}

function SceneFootprintPreview({ scene }: { scene: SceneCatalogItem }) {
  const { fitBounds } = useMapInstance();

  useEffect(() => {
    if (!scene.footprint) return;
    const [west, south, east, north] = scene.footprint.properties.bbox;
    const bounds: [number, number, number, number] = [west, south, east, north];
    let timeout = 0;
    let cancelled = false;

    const fitWhenReady = () => {
      if (cancelled) return;
      const liveMap = getMapInstance();
      if (liveMap?.isStyleLoaded()) {
        useGeospatialStore.getState().selectScene(scene.id);
        fitBounds(bounds, 36);
        return;
      }
      if (liveMap) {
        liveMap.once("load", () => {
          if (!cancelled) {
            useGeospatialStore.getState().selectScene(scene.id);
            fitBounds(bounds, 36);
          }
        });
        return;
      }
      timeout = window.setTimeout(fitWhenReady, 80);
    };

    fitWhenReady();
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [fitBounds, scene]);

  if (!scene.footprint) {
    return (
      <div className="flex h-[360px] flex-col items-center justify-center rounded border border-border-subtle bg-surface-secondary/40 p-6 text-center">
        <MapPin className="mb-2 h-6 w-6 text-content-muted" />
        <p className="text-sm font-medium text-content-primary">Footprint unavailable</p>
        <p className="mt-1 max-w-sm text-xs text-content-muted">
          No verified footprint coordinates are present in the sample catalogue for this scene.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[360px] overflow-hidden rounded border border-border-subtle">
      <MapCanvas />
    </div>
  );
}

export const SceneDetailPanel: React.FC<SceneDetailPanelProps> = ({
  scene,
  selected,
  onToggleSelection,
  onReturn,
}) => (
  <div className="space-y-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={onReturn}>
        Return to Catalogue
      </Button>
      <div className="flex gap-2">
        <Button
          variant={selected ? "secondary" : "primary"}
          size="sm"
          leftIcon={selected ? <Check className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          onClick={onToggleSelection}
        >
          {selected ? "Deselect Scene" : "Select Scene"}
        </Button>
        {scene.footprint && (
          <Link to="/workspace">
            <Button variant="outline" size="sm" rightIcon={<ExternalLink className="h-3.5 w-3.5" />}>
              Open in Geospatial Studio
            </Button>
          </Link>
        )}
      </div>
    </div>

    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)]">
      <div className="space-y-5">
        <Card variant="elevated">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-2xs uppercase tracking-wider text-accent-primary">Scene Overview</p>
                <CardTitle className="mt-1 break-all text-base">{scene.name}</CardTitle>
                <p className="mt-1 font-mono text-xs text-content-muted">{scene.datasetId}</p>
              </div>
              <Badge variant={scene.availability === "Available" ? "success" : "warning"} size="sm">
                {scene.availability}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-content-secondary">{scene.description}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Metadata label="Provider" value={scene.provider} />
              <Metadata label="Acquisition date" value={scene.acquisitionDate ?? "Unknown"} />
              <Metadata label="Sensor / instrument" value={scene.sensor} />
              <Metadata label="Platform" value={scene.sensorType} />
              <Metadata label="Location" value={scene.location} />
              <Metadata label="Cloud cover" value={scene.cloudCoverPercent === null ? "Unknown" : `${scene.cloudCoverPercent}% (sample metadata)`} />
              <Metadata label="Data source" value={scene.source} />
            </div>
            <p className="rounded border border-status-warning/20 bg-status-warning/5 p-3 text-xs text-content-secondary">
              {scene.metadataNote}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Ruler className="h-4 w-4 text-accent-primary" /> Spatial Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Metadata label="Geographic location" value={scene.location} />
            <Metadata
              label="Coordinates (longitude, latitude)"
              value={scene.coordinates ? `${scene.coordinates[0].toFixed(5)}, ${scene.coordinates[1].toFixed(5)}` : "Unknown"}
            />
            <Metadata label="Spatial resolution" value={display(scene.spatialResolutionM, " m")} />
            <Metadata label="Original coordinate reference system" value={scene.crs ?? "Unknown"} />
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Satellite className="h-4 w-4 text-accent-primary" /> Spectral Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Metadata label="Total spectral bands" value={display(scene.spectralBands)} />
              <Metadata
                label="Wavelength range"
                value={scene.wavelengthRangeNm
                  ? `${scene.wavelengthRangeNm[0]}–${scene.wavelengthRangeNm[1]} nm`
                  : "Unknown"}
              />
            </div>
            <div className="rounded border border-border-subtle bg-surface-secondary/40 p-3">
              <div className="mb-2 flex items-center justify-between text-2xs font-mono text-content-muted">
                <span>AVAILABLE SPECTRAL RANGE</span>
                <span>Wavelength reference only</span>
              </div>
              <div className="h-2 rounded bg-gradient-to-r from-violet-500 via-cyan-400 via-50% to-amber-400" />
              <p className="mt-2 text-xs text-content-secondary">
                {scene.spectralBands && scene.wavelengthRangeNm
                  ? `${scene.spectralBands} bands are recorded in the catalogue. Band-by-band wavelengths are not available here; no reflectance values are simulated.`
                  : "Band count and wavelength calibration are unavailable in the sample metadata."}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] text-left text-xs">
                <thead className="text-2xs uppercase text-content-muted">
                  <tr>
                    <th className="py-2">Band metadata</th>
                    <th className="py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border-subtle">
                    <td className="py-2 text-content-secondary">Band index / wavelength samples</td>
                    <td className="py-2 text-content-muted">Not provided by this catalogue record</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="text-sm">Scene Footprint Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <SceneFootprintPreview scene={scene} />
            <p className="mt-2 text-2xs text-content-muted">
              {scene.footprint
                ? "Interactive OpenFreeMap preview. Coordinates are geographic (EPSG:4326); attribution is shown on map."
                : "No preview map or attribution is shown because verified footprint coordinates are unavailable."}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader><CardTitle className="text-sm">Ground Truth</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Metadata
              label="Availability"
              value={scene.groundTruthAvailable === null
                ? "Unknown"
                : scene.groundTruthAvailable ? "Available" : "Not available"}
            />
            {scene.groundTruthClasses.length > 0 ? (
              <div>
                <p className="mb-2 text-2xs font-mono uppercase text-content-muted">Example benchmark classes (not exhaustive)</p>
                <div className="flex flex-wrap gap-1.5">
                  {scene.groundTruthClasses.map((label) => (
                    <Badge key={label} variant="outline" size="sm">{label}</Badge>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-content-muted">No class annotations are included in this catalogue record.</p>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader><CardTitle className="text-sm">Technical Metadata</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <Metadata label="Scene dimensions" value={scene.dimensions ? `${scene.dimensions[0]} × ${scene.dimensions[1]} px` : "Unknown"} />
            <Metadata label="File format" value={scene.dataFormat ?? "Unknown"} />
            <Metadata label="Data size" value={formatBytes(scene.dataSizeBytes)} />
            <Metadata label="Metadata quality" value={scene.isSample ? "Sample / benchmark metadata" : "Catalogue record"} />
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

function Metadata({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-2xs font-mono uppercase tracking-wide text-content-muted">{label}</p>
      <p className="mt-1 break-words text-xs font-medium text-content-primary">{value}</p>
    </div>
  );
}
