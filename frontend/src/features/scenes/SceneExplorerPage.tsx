import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Search,
  Calendar,
  Eye,
  ArrowRight,
  AlertTriangle,
  Globe,
} from "lucide-react";

interface SceneItem {
  id: string;
  name: string;
  sensor: string;
  sensorType: "Airborne" | "Spaceborne";
  location: string;
  date: string;
  bands: number;
  spectralRange: string;
  gsd: string;
  cloudCover: number;
  fileSize: string;
  crs: string;
  tags: string[];
}

const SAMPLE_SCENES: SceneItem[] = [
  {
    id: "scene_01",
    name: "AVIRIS_NG_PERMIAN_2024_03A",
    sensor: "NASA AVIRIS-NG",
    sensorType: "Airborne",
    location: "Permian Basin, Texas, USA",
    date: "2024-03-14",
    bands: 425,
    spectralRange: "380 – 2510 nm",
    gsd: "3.8 m / pixel",
    cloudCover: 0.2,
    fileSize: "1.82 GB (GeoTIFF)",
    crs: "EPSG:32613 (UTM 13N)",
    tags: ["Methane Plume", "Oil & Gas", "SWIR Calibrated"],
  },
  {
    id: "scene_02",
    name: "PRISMA_GULF_COAST_L2D_901",
    sensor: "ASI PRISMA",
    sensorType: "Spaceborne",
    location: "Gulf Coast Offshore, Louisiana",
    date: "2024-02-28",
    bands: 239,
    spectralRange: "400 – 2500 nm",
    gsd: "30.0 m / pixel",
    cloudCover: 3.4,
    fileSize: "840 MB (GeoTIFF)",
    crs: "EPSG:32615 (UTM 15N)",
    tags: ["Petroleum Sheen", "Coastal Estuary", "L2D Surface"],
  },
  {
    id: "scene_03",
    name: "ENMAP_SALAR_ATACAMA_04",
    sensor: "DLR EnMAP",
    sensorType: "Spaceborne",
    location: "Salar de Atacama, Chile",
    date: "2024-01-19",
    bands: 242,
    spectralRange: "420 – 2450 nm",
    gsd: "30.0 m / pixel",
    cloudCover: 0.0,
    fileSize: "1.24 GB (GeoTIFF)",
    crs: "EPSG:32719 (UTM 19S)",
    tags: ["Lithium Brine", "Evaporite Minerals", "VNIR/SWIR"],
  },
  {
    id: "scene_04",
    name: "EMIT_ALGERIA_MINERAL_22",
    sensor: "NASA EMIT (ISS)",
    sensorType: "Spaceborne",
    location: "Hoggar Mountains, Algeria",
    date: "2024-04-02",
    bands: 285,
    spectralRange: "381 – 2493 nm",
    gsd: "60.0 m / pixel",
    cloudCover: 1.1,
    fileSize: "620 MB (GeoTIFF)",
    crs: "EPSG:32631 (UTM 31N)",
    tags: ["Kaolinite", "Iron Oxide", "Mineral Mapping"],
  },
];

export const SceneExplorerPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSensor, setSelectedSensor] = useState("all");

  const filteredScenes = SAMPLE_SCENES.filter((scene) => {
    const matchesSearch =
      scene.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scene.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scene.sensor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSensor =
      selectedSensor === "all" ||
      scene.sensor.toLowerCase().includes(selectedSensor.toLowerCase());
    return matchesSearch && matchesSensor;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        category="DATA CATALOG"
        title="Satellite Scene Catalog Explorer"
        subtitle="Browse, filter, and inspect calibrated hyperspectral datacubes ingested across airborne and spaceborne sensors."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md" dot>
              SAMPLE CATALOG DATA
            </Badge>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-3 rounded-lg border border-status-warning/30 bg-status-warning/10 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span className="text-content-secondary">
            <strong className="text-status-warning font-semibold">Curated Sample Ingestion Catalog:</strong> Datasets below illustrate supported sensor models and metadata schemas verified in the architecture audit. Live storage uploads are disconnected in this demo workstation.
          </span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card variant="elevated">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6">
              <Input
                placeholder="Search by scene name, location, or target tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-content-muted" />}
              />
            </div>
            <div className="md:col-span-3">
              <Select
                value={selectedSensor}
                onChange={(e) => setSelectedSensor(e.target.value)}
                options={[
                  { label: "All Sensors", value: "all" },
                  { label: "NASA AVIRIS-NG (Airborne)", value: "aviris" },
                  { label: "ASI PRISMA (Spaceborne)", value: "prisma" },
                  { label: "DLR EnMAP (Spaceborne)", value: "enmap" },
                  { label: "NASA EMIT (ISS)", value: "emit" },
                ]}
              />
            </div>
            <div className="md:col-span-3 flex items-center justify-end">
              <span className="text-2xs font-mono text-content-muted">
                Showing {filteredScenes.length} of {SAMPLE_SCENES.length} sample scenes
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scene Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredScenes.map((scene) => (
          <Card key={scene.id} variant="elevated" className="hover:border-border-strong transition-all">
            <CardHeader className="pb-3 border-b border-border-subtle">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-semibold">{scene.name}</CardTitle>
                    <Badge variant={scene.sensorType === "Airborne" ? "primary" : "outline"} size="sm">
                      {scene.sensorType}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1.5 text-xs mt-1">
                    <Globe className="w-3.5 h-3.5 text-content-muted" />
                    {scene.location}
                  </CardDescription>
                </div>
                <Badge variant="warning" size="sm">
                  SAMPLE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-2xs font-mono bg-surface-secondary/40 p-3 rounded-lg border border-border-subtle">
                <div>
                  <span className="text-content-muted block">SENSOR</span>
                  <span className="text-content-primary font-semibold">{scene.sensor}</span>
                </div>
                <div>
                  <span className="text-content-muted block">BANDS</span>
                  <span className="text-accent-primary font-semibold">{scene.bands} bands</span>
                </div>
                <div>
                  <span className="text-content-muted block">RANGE</span>
                  <span className="text-content-primary">{scene.spectralRange}</span>
                </div>
                <div>
                  <span className="text-content-muted block">GSD</span>
                  <span className="text-content-primary">{scene.gsd}</span>
                </div>
                <div>
                  <span className="text-content-muted block">CLOUD COVER</span>
                  <span className="text-status-success">{scene.cloudCover}%</span>
                </div>
                <div>
                  <span className="text-content-muted block">SIZE</span>
                  <span className="text-content-primary">{scene.fileSize}</span>
                </div>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5">
                {scene.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-surface-panel border border-border-subtle text-content-secondary"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <span className="text-2xs font-mono text-content-muted flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Acquired: {scene.date}
                </span>
                <div className="flex items-center gap-2">
                  <Link to="/workspace">
                    <Button variant="outline" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                      Inspect
                    </Button>
                  </Link>
                  <Link to="/analysis/new">
                    <Button
                      variant="primary"
                      size="sm"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Run Detection
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
