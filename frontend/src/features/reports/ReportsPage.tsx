import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import {
  Download,
  AlertTriangle,
  Printer,
} from "lucide-react";

interface ReportDossier {
  id: string;
  code: string;
  title: string;
  sceneName: string;
  sensor: string;
  date: string;
  analyst: string;
  classification: string;
  summary: string;
  detectionCount: number;
  peakConfidence: number;
  status: "Finalized" | "Draft";
}

const SAMPLE_REPORTS: ReportDossier[] = [
  {
    id: "rep_01",
    code: "GEOASTRA-REP-2024-0042",
    title: "Permian Basin Methane Emission & Point-Source Anomaly Audit",
    sceneName: "AVIRIS_NG_PERMIAN_2024_03A",
    sensor: "NASA AVIRIS-NG (425 bands, 3.8m GSD)",
    date: "2024-03-15",
    analyst: "Alex Mercer (Senior Geospatial Analyst)",
    classification: "GEOSPATIAL INTELLIGENCE REPORT [SAMPLE]",
    summary: "High-resolution airborne hyperspectral survey of northern Delaware basin identified 18 anomalous SWIR absorption plumes consistent with fugitive methane emissions (1660 nm & 2320 nm). Peak CEM detection confidence reached 0.964.",
    detectionCount: 18,
    peakConfidence: 0.964,
    status: "Finalized",
  },
  {
    id: "rep_02",
    code: "GEOASTRA-REP-2024-0039",
    title: "Atacama Lithium Brine Evaporite & Mineral Mapping Dossier",
    sceneName: "ENMAP_SALAR_ATACAMA_04",
    sensor: "DLR EnMAP (242 bands, 30m GSD)",
    date: "2024-02-20",
    analyst: "Elena Vance (Spectral Remote Sensing Lead)",
    classification: "GEOSPATIAL INTELLIGENCE REPORT [SAMPLE]",
    summary: "Spaceborne EnMAP VNIR/SWIR acquisition unmixed lithium carbonate and borate evaporite crusts across 450 km² of the Salar de Atacama basin. Spectral angle mapping confirmed high purity evaporite distribution.",
    detectionCount: 26,
    peakConfidence: 0.928,
    status: "Finalized",
  },
  {
    id: "rep_03",
    code: "GEOASTRA-REP-2024-0031",
    title: "Gulf Coast Offshore Marine Hydrocarbon Sheen Investigation",
    sceneName: "PRISMA_GULF_COAST_L2D_901",
    sensor: "ASI PRISMA (239 bands, 30m GSD)",
    date: "2024-01-11",
    analyst: "Alex Mercer (Senior Geospatial Analyst)",
    classification: "GEOSPATIAL INTELLIGENCE REPORT [SAMPLE]",
    summary: "PRISMA hyperspectral L2D datacube analyzed with RXD anomaly detector and SWIR oil sheen matched filter. 14 spatial outliers identified along active offshore production leases.",
    detectionCount: 14,
    peakConfidence: 0.892,
    status: "Draft",
  },
];

export const ReportsPage: React.FC = () => {
  const toast = useToast();
  const [selectedReportId, setSelectedReportId] = useState("rep_01");

  const activeReport =
    SAMPLE_REPORTS.find((r) => r.id === selectedReportId) || SAMPLE_REPORTS[0];

  const handleExport = (format: string) => {
    toast.info(
      "Report Export (Demo)",
      `Generated sample download for [${activeReport.code}] in ${format} format.`
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        category="INTELLIGENCE REPORTING"
        title="Mission Intelligence Reports & Exports"
        subtitle="Generate, review, and export formal geospatial intelligence briefs, executive target summaries, and spectral validation dossiers."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md" dot>
              SAMPLE REPORT CATALOG
            </Badge>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-3 rounded-lg border border-status-warning/30 bg-status-warning/10 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span className="text-content-secondary">
            <strong className="text-status-warning font-semibold">Report Catalog & Dossier Preview:</strong> Intelligence briefings shown below represent sample formatted exports. In this demo workstation, PDF and GeoJSON rendering is preview data.
          </span>
        </div>
      </div>

      {/* Report Workspace: Left List (4 cols) | Right Document Preview (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Report List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-content-secondary">
              Report Archives (Sample)
            </h3>
            <Badge variant="outline" size="sm">
              {SAMPLE_REPORTS.length} DOSSIERS
            </Badge>
          </div>

          <div className="space-y-3">
            {SAMPLE_REPORTS.map((rep) => {
              const isSelected = rep.id === selectedReportId;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReportId(rep.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-surface-elevated border-accent-primary ring-1 ring-accent-primary/40 shadow-md"
                      : "bg-surface-secondary/50 border-border-subtle hover:border-border-strong hover:bg-surface-secondary"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xs text-accent-primary font-semibold">
                      {rep.code}
                    </span>
                    <Badge variant={rep.status === "Finalized" ? "success" : "outline"} size="sm">
                      {rep.status}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-semibold text-content-primary mt-1 line-clamp-2">
                    {rep.title}
                  </h4>
                  <div className="mt-2 pt-2 border-t border-border-subtle flex items-center justify-between text-2xs font-mono text-content-muted">
                    <span>{rep.date}</span>
                    <span>{rep.detectionCount} Targets</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Formal Briefing Document Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card variant="elevated" className="border-border-strong/70">
            {/* Dossier Header Toolbar */}
            <CardHeader className="pb-3 border-b border-border-subtle bg-surface-secondary/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xs font-mono px-2 py-0.5 rounded bg-status-warning/10 text-status-warning border border-status-warning/30 font-semibold">
                      {activeReport.classification}
                    </span>
                    <span className="text-2xs font-mono text-content-muted">{activeReport.code}</span>
                  </div>
                  <CardTitle className="text-sm font-bold mt-1 text-content-primary">
                    {activeReport.title}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Printer className="w-3.5 h-3.5" />}
                    onClick={() => handleExport("PDF")}
                  >
                    Export PDF
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Download className="w-3.5 h-3.5" />}
                    onClick={() => handleExport("GeoJSON")}
                  >
                    GeoJSON Package
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Document Body */}
            <CardContent className="p-6 space-y-5">
              {/* Executive Summary Block */}
              <div className="space-y-2">
                <h4 className="text-2xs font-mono uppercase tracking-wider text-accent-primary font-bold">
                  1. Executive Briefing &amp; Mission Summary
                </h4>
                <p className="text-xs text-content-secondary leading-relaxed bg-surface-panel p-3.5 rounded-lg border border-border-subtle">
                  {activeReport.summary}
                </p>
              </div>

              {/* Mission Metadata Grid */}
              <div className="space-y-2">
                <h4 className="text-2xs font-mono uppercase tracking-wider text-accent-primary font-bold">
                  2. Sensor &amp; Analysis Parameters
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-2xs font-mono bg-surface-secondary/50 p-3.5 rounded-lg border border-border-subtle">
                  <div>
                    <span className="text-content-muted block">INPUT SCENE:</span>
                    <span className="text-content-primary font-semibold">{activeReport.sceneName}</span>
                  </div>
                  <div>
                    <span className="text-content-muted block">SENSOR PLATFORM:</span>
                    <span className="text-content-primary">{activeReport.sensor}</span>
                  </div>
                  <div>
                    <span className="text-content-muted block">ANALYST:</span>
                    <span className="text-content-primary">{activeReport.analyst}</span>
                  </div>
                  <div>
                    <span className="text-content-muted block">DATE COMPILED:</span>
                    <span className="text-content-primary">{activeReport.date}</span>
                  </div>
                </div>
              </div>

              {/* Target Detection Findings Table */}
              <div className="space-y-2">
                <h4 className="text-2xs font-mono uppercase tracking-wider text-accent-primary font-bold">
                  3. Confirmed Spatial Hotspots (Top Detections)
                </h4>
                <div className="border border-border-subtle rounded-lg overflow-hidden">
                  <table className="w-full text-left text-2xs font-mono">
                    <thead className="bg-surface-secondary border-b border-border-subtle text-content-muted">
                      <tr>
                        <th className="p-2.5">TARGET ID</th>
                        <th className="p-2.5">COORDINATES (WGS84)</th>
                        <th className="p-2.5">CONFIDENCE</th>
                        <th className="p-2.5">EST. FOOTPRINT</th>
                        <th className="p-2.5">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle text-content-secondary">
                      <tr className="hover:bg-surface-elevated/40">
                        <td className="p-2.5 font-semibold text-content-primary">HOTSPOT-01</td>
                        <td className="p-2.5">31.9686°N, 102.0988°W</td>
                        <td className="p-2.5 text-status-warning font-semibold">0.964</td>
                        <td className="p-2.5">14,200 m²</td>
                        <td className="p-2.5"><Badge variant="danger" size="sm">CRITICAL</Badge></td>
                      </tr>
                      <tr className="hover:bg-surface-elevated/40">
                        <td className="p-2.5 font-semibold text-content-primary">HOTSPOT-02</td>
                        <td className="p-2.5">31.9712°N, 102.1024°W</td>
                        <td className="p-2.5 text-status-warning font-semibold">0.941</td>
                        <td className="p-2.5">8,800 m²</td>
                        <td className="p-2.5"><Badge variant="warning" size="sm">ELEVATED</Badge></td>
                      </tr>
                      <tr className="hover:bg-surface-elevated/40">
                        <td className="p-2.5 font-semibold text-content-primary">HOTSPOT-03</td>
                        <td className="p-2.5">31.9644°N, 102.0910°W</td>
                        <td className="p-2.5 text-accent-primary font-semibold">0.887</td>
                        <td className="p-2.5">5,100 m²</td>
                        <td className="p-2.5"><Badge variant="outline" size="sm">MONITOR</Badge></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
