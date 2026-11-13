import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Sparkles,
  Search,
  Download,
  AlertTriangle,
} from "lucide-react";

interface SignatureSpec {
  id: string;
  name: string;
  category: "Gas / Emission" | "Vegetation" | "Mineral" | "Water";
  color: string;
  source: string;
  bands: number;
  diagnosticWavelengths: string;
  description: string;
  svgPath: string;
}

const SAMPLE_SIGNATURES: SignatureSpec[] = [
  {
    id: "sig_methane",
    name: "Methane Absorption (CH4)",
    category: "Gas / Emission",
    color: "#F59E0B", // amber
    source: "HITRAN / JPL Laboratory",
    bands: 425,
    diagnosticWavelengths: "1660 nm (2&nu;3) & 2320 nm (&nu;3+&nu;4)",
    description: "Strong diagnostic overtone absorption bands in SWIR-1 and SWIR-2 used for plume pinpointing.",
    svgPath: "M 0 70 Q 50 65, 80 40 T 115 20 T 140 75 T 160 30 T 200 78 T 240 35 T 280 40",
  },
  {
    id: "sig_vegetation",
    name: "Healthy Vegetation (Chlorophyll)",
    category: "Vegetation",
    color: "#10B981", // emerald
    source: "USGS Spectral Library v7",
    bands: 425,
    diagnosticWavelengths: "680 nm (Red edge), 1450 nm & 1940 nm (H2O)",
    description: "Low visible reflectance with sharp red-edge rise at 700 nm, high NIR plateau and liquid water absorption dips.",
    svgPath: "M 0 75 Q 30 72, 45 40 T 80 15 T 120 18 T 150 55 T 190 25 T 230 65 T 280 45",
  },
  {
    id: "sig_kaolinite",
    name: "Kaolinite Hydrothermal Clay",
    category: "Mineral",
    color: "#38BDF8", // sky
    source: "USGS Spectral Library v7",
    bands: 425,
    diagnosticWavelengths: "2160 nm & 2208 nm (Al-OH doublet)",
    description: "Diagnostic Al-OH absorption doublet in SWIR used for porphyry copper and epithermal gold alteration mapping.",
    svgPath: "M 0 50 Q 50 45, 90 35 T 130 30 T 170 30 T 210 25 T 235 60 T 250 65 T 280 40",
  },
  {
    id: "sig_hematite",
    name: "Hematite (Iron Oxide Fe2O3)",
    category: "Mineral",
    color: "#EF4444", // red
    source: "JPL ECOSTRESS Library",
    bands: 425,
    diagnosticWavelengths: "860 nm (Crystal field transition)",
    description: "Strong ferric iron absorption below 550 nm with crystal field absorption band centered near 860 nm.",
    svgPath: "M 0 80 Q 40 75, 70 50 T 110 30 T 145 60 T 180 35 T 220 30 T 250 32 T 280 35",
  },
];

export const SpectralLibraryPage: React.FC = () => {
  const [selectedSigId, setSelectedSigId] = useState<string>("sig_methane");
  const [searchQuery, setSearchQuery] = useState("");

  const activeSig =
    SAMPLE_SIGNATURES.find((s) => s.id === selectedSigId) || SAMPLE_SIGNATURES[0];

  const filteredSignatures = SAMPLE_SIGNATURES.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        category="SPECTRAL SIGNATURES"
        title="Reference Spectral Signature Library"
        subtitle="Calibrated laboratory and field reflectance spectra (400 nm – 2500 nm) used for matched filtering, material identification, and classification."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md" dot>
              SAMPLE REFERENCE LIBRARY
            </Badge>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-3 rounded-lg border border-status-warning/30 bg-status-warning/10 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span className="text-content-secondary">
            <strong className="text-status-warning font-semibold">Diagnostic Reference Signatures:</strong> The spectral curves and absorption bands below are curated sample references from USGS and HITRAN databases for algorithm development preview.
          </span>
        </div>
      </div>

      {/* Large Spectral Chart Card */}
      <Card variant="elevated">
        <CardHeader className="pb-3 border-b border-border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-primary" />
                Spectral Reflectance Response: {activeSig.name}
              </CardTitle>
              <CardDescription className="text-2xs font-mono">
                Wavelength Range: 400 nm – 2500 nm (VNIR to SWIR-2) • {activeSig.source}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" size="sm">
                425 CHANNELS
              </Badge>
              <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          {/* SVG Spectral Curve Canvas */}
          <div className="h-64 w-full rounded-lg bg-surface-panel/80 border border-border-subtle p-4 relative flex flex-col justify-between overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

            {/* Absorption Feature Overlay Annotations */}
            <div className="relative z-10 flex justify-between text-2xs font-mono text-content-muted">
              <span>0.80 Reflectance</span>
              <span className="text-accent-primary">VNIR (400-1000nm)</span>
              <span className="text-status-warning">SWIR-1 (1000-1800nm)</span>
              <span className="text-indigo-400">SWIR-2 (1800-2500nm)</span>
            </div>

            {/* SVG Plot */}
            <div className="relative flex-1 py-2">
              <svg
                viewBox="0 0 280 90"
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Horizontal reference lines */}
                <line x1="0" y1="18" x2="280" y2="18" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="45" x2="280" y2="45" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="72" x2="280" y2="72" stroke="#1E293B" strokeWidth="1" strokeDasharray="3,3" />

                {/* Render active signature curve */}
                <path
                  d={activeSig.svgPath}
                  fill="none"
                  stroke={activeSig.color}
                  strokeWidth="2.5"
                  className="transition-all duration-300"
                />

                {/* Absorption Marker pin */}
                <circle cx="145" cy="74" r="4" fill="#F59E0B" />
                <line x1="145" y1="10" x2="145" y2="74" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2,2" />
              </svg>
            </div>

            {/* X Axis labels */}
            <div className="relative z-10 flex justify-between text-2xs font-mono text-content-muted border-t border-border-subtle pt-2">
              <span>400 nm</span>
              <span>750 nm</span>
              <span className="text-status-warning font-semibold">1660 nm (CH4)</span>
              <span>2000 nm</span>
              <span className="text-status-warning font-semibold">2320 nm (CH4)</span>
              <span>2500 nm</span>
            </div>
          </div>

          {/* Active Signature Detail Banner */}
          <div className="p-3 rounded-lg bg-surface-secondary/40 border border-border-subtle grid grid-cols-1 md:grid-cols-3 gap-3 text-2xs font-mono">
            <div>
              <span className="text-content-muted block">DIAGNOSTIC BANDS:</span>
              <span className="text-status-warning font-semibold">{activeSig.diagnosticWavelengths}</span>
            </div>
            <div>
              <span className="text-content-muted block">CLASSIFICATION:</span>
              <span className="text-content-primary">{activeSig.category}</span>
            </div>
            <div>
              <span className="text-content-muted block">SPECTRAL SOURCE:</span>
              <span className="text-content-primary">{activeSig.source}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Signature Catalog List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-content-secondary">
            Reference Signatures Catalog (Sample Data)
          </h3>
          <div className="flex items-center gap-2 max-w-xs w-full">
            <Input
              placeholder="Filter signatures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5 text-content-muted" />}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSignatures.map((sig) => {
            const isSelected = sig.id === selectedSigId;
            return (
              <div
                key={sig.id}
                onClick={() => setSelectedSigId(sig.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-surface-elevated/90 border-accent-primary shadow-lg"
                    : "bg-surface-secondary/50 border-border-subtle hover:border-border-strong"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: sig.color }}
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-content-primary">{sig.name}</h4>
                      <span className="text-2xs font-mono text-content-muted">{sig.category}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <Badge variant="primary" size="sm">
                      ACTIVE
                    </Badge>
                  )}
                </div>
                <p className="text-2xs text-content-secondary mt-2 leading-relaxed">
                  {sig.description}
                </p>
                <div className="pt-2 mt-2 border-t border-border-subtle flex items-center justify-between text-2xs font-mono text-content-muted">
                  <span>{sig.source}</span>
                  <span className="text-accent-primary">{sig.bands} bands</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
