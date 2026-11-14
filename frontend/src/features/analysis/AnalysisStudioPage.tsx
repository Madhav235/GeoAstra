import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/hooks/useToast";
import { BUILT_IN_SCENES } from "@/features/scenes/data/sceneCatalog";
import { useSceneCatalogStore } from "@/features/scenes/store/sceneCatalogStore";
import {
  Activity,
  Sliders,
  AlertTriangle,
  Play,
} from "lucide-react";

interface AlgorithmDefinition {
  id: "rxd" | "mf" | "cem" | "fusion";
  name: string;
  acronym: string;
  type: "Unsupervised Anomaly" | "Supervised Target" | "Constrained Energy" | "Multi-Modal";
  equation: string;
  summary: string;
  useCase: string;
  params: { name: string; defaultVal: string; desc: string }[];
}

const ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: "rxd",
    name: "Reed-Xiaoli Detector",
    acronym: "RXD",
    type: "Unsupervised Anomaly",
    equation: "δ_RX(r) = (r - μ)^T · K^(-1) · (r - μ)",
    summary: "Measures statistical Mahalanobis distance of pixel vector r from global background covariance K without requiring prior target signatures.",
    useCase: "Search for unknown spectral anomalies, man-made objects, pipeline leak candidates.",
    params: [
      { name: "Covariance Window", defaultVal: "Global (Full Cube)", desc: "Background statistics estimation mode" },
      { name: "Anomaly Threshold (σ)", defaultVal: "3.5 σ", desc: "Z-score outlier cutoff" },
    ],
  },
  {
    id: "mf",
    name: "Matched Filter",
    acronym: "MF",
    type: "Supervised Target",
    equation: "δ_MF(r) = [(s - μ)^T K^(-1) (r - μ)] / [(s - μ)^T K^(-1) (s - μ)]",
    summary: "Maximizes signal-to-noise ratio by projecting the pixel spectrum onto a known target signature s while whitening background clutter.",
    useCase: "Methane and gas plume pinpointing, specific mineral abundance quantification.",
    params: [
      { name: "Reference Target", defaultVal: "Methane Absorption (CH4)", desc: "Spectral library signature vector" },
      { name: "Whitening Regularization", defaultVal: "1e-4", desc: "Prevents singular matrix inversion" },
    ],
  },
  {
    id: "cem",
    name: "Constrained Energy Minimization",
    acronym: "CEM",
    type: "Constrained Energy",
    equation: "w_CEM = (R^(-1) · d) / (d^T · R^(-1) · d)",
    summary: "Designs a finite impulse response filter that minimizes total output energy while maintaining unity response to the desired target vector d.",
    useCase: "Sub-pixel target detection where background distribution is non-Gaussian.",
    params: [
      { name: "Target Vector (d)", defaultVal: "CH4 Permian Reference", desc: "Calibrated target reflectance" },
      { name: "Correlation Matrix (R)", defaultVal: "Autocorrelation Sample", desc: "Sample 2nd-moment matrix" },
    ],
  },
  {
    id: "fusion",
    name: "Spectral-Spatial Fusion",
    acronym: "FUSION",
    type: "Multi-Modal",
    equation: "S_Fused = α · S_Spectral + (1 - α) · S_Spatial",
    summary: "Combines high-dimensional spectral unmixing scores with spatial morphology and edge constraints to suppress false alarms.",
    useCase: "High-resolution urban material classification and environmental impact assessment.",
    params: [
      { name: "Alpha Weight (α)", defaultVal: "0.70", desc: "Balance between spectral and spatial cues" },
      { name: "Spatial Neighborhood", defaultVal: "5 x 5 Kernel", desc: "Local context filter window" },
    ],
  },
];

export const AnalysisStudioPage: React.FC = () => {
  const toast = useToast();
  const [selectedAlgoId, setSelectedAlgoId] = useState<"rxd" | "mf" | "cem" | "fusion">("cem");
  const [selectedScene, setSelectedScene] = useState("AVIRIS_NG_PERMIAN_2024_03A");
  const [threshold, setThreshold] = useState(0.85);
  const uploadedScenes = useSceneCatalogStore((state) => state.uploadedScenes);
  const selectedSceneIds = useSceneCatalogStore((state) => state.selectedSceneIds);
  const catalogueScenes = [...uploadedScenes, ...BUILT_IN_SCENES];
  const selectedCatalogueScene = catalogueScenes.find((scene) => selectedSceneIds.includes(scene.id));
  const activeScene = catalogueScenes.find((scene) => scene.name === selectedScene);

  useEffect(() => {
    if (selectedCatalogueScene) setSelectedScene(selectedCatalogueScene.name);
  }, [selectedCatalogueScene]);

  const selectedAlgo = ALGORITHMS.find((a) => a.id === selectedAlgoId) || ALGORITHMS[0];

  const handleLaunchJob = () => {
    toast.info(
      "Demo Workstation Notice",
      `Algorithmic mission for [${selectedAlgo.acronym}] configured with threshold ${threshold}. Backend AI engine execution will trigger in live integration.`
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        category="ALGORITHM STUDIO"
        title="Hyperspectral Target Detection & Analysis Studio"
        subtitle="Configure and execute high-dimensional spectral detection workflows using mathematical operators and AI feature extractors."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md" dot>
              CONFIG WORKFLOW PREVIEW
            </Badge>
          </div>
        }
      />

      {/* Demo Notice Banner */}
      <div className="p-3 rounded-lg border border-status-warning/30 bg-status-warning/10 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-status-warning shrink-0" />
          <span className="text-content-secondary">
            <strong className="text-status-warning font-semibold">Workflow Configuration Preview:</strong> This studio demonstrates the 4 verified algorithms supported by the Python AI Engine. In this workstation preview, job submission is simulated without running remote GPU workers.
          </span>
        </div>
      </div>

      {/* Step 1: Algorithm Selector (4 Supported Algorithms) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-wider text-content-secondary flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-accent-primary/20 text-accent-primary flex items-center justify-center text-[10px]">1</span>
            Select Detection Algorithm
          </h2>
          <Badge variant="outline" size="sm">
            4 ALGORITHMS AVAILABLE
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALGORITHMS.map((algo) => {
            const isSelected = algo.id === selectedAlgoId;
            return (
              <div
                key={algo.id}
                onClick={() => setSelectedAlgoId(algo.id)}
                className={`p-4 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-surface-elevated border-accent-primary ring-1 ring-accent-primary/50 shadow-md"
                    : "bg-surface-secondary/40 border-border-subtle hover:border-border-strong hover:bg-surface-secondary"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-sm font-bold text-accent-primary">
                      {algo.acronym}
                    </span>
                    <Badge variant={isSelected ? "primary" : "outline"} size="sm">
                      {algo.type}
                    </Badge>
                  </div>
                  <h3 className="text-xs font-semibold text-content-primary">{algo.name}</h3>
                  <p className="text-2xs text-content-muted mt-2 leading-relaxed">
                    {algo.summary}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border-subtle text-[10px] font-mono text-content-secondary">
                  {algo.useCase}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2 & 3: Configuration Panel and Mathematical Specification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Selection & Hyperparameters (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="elevated">
            <CardHeader className="pb-3 border-b border-border-subtle">
              <CardTitle className="text-xs flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-accent-primary" />
                Step 2: Input Datacube &amp; Detection Hyperparameters
              </CardTitle>
              <CardDescription className="text-2xs">
                Configure input scene, target signature, and detection threshold
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Scene Dropdown */}
              <div className="space-y-1.5">
                <label className="text-2xs font-mono uppercase tracking-wider text-content-secondary block">
                  Target Scene
                </label>
                <Select
                  value={selectedScene}
                  onChange={(e) => setSelectedScene(e.target.value)}
                  options={catalogueScenes.map((scene) => ({
                    label: `${scene.name} (${scene.spectralBands ?? "?"} bands, ${scene.spatialResolutionM ?? "?"}m GSD)`,
                    value: scene.name,
                  }))}
                />
              </div>

              {/* Spectral Target (if supervised) */}
              {selectedAlgo.id !== "rxd" && (
                <div className="space-y-1.5">
                  <label className="text-2xs font-mono uppercase tracking-wider text-content-secondary block">
                    Target Spectral Signature Vector
                  </label>
                  <Select
                    options={[
                      { label: "Methane Absorption Feature (1660 nm SWIR-1)", value: "methane" },
                      { label: "Kaolinite Al-OH Doublet (2200 nm SWIR-2)", value: "kaolinite" },
                      { label: "Hematite Iron Oxide (Fe2O3)", value: "hematite" },
                      { label: "Chlorophyll Red-Edge Reference", value: "chlorophyll" },
                    ]}
                  />
                </div>
              )}

              {/* Threshold Slider */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-2xs font-mono">
                  <span className="text-content-secondary">DETECTION CONFIDENCE THRESHOLD (&tau;)</span>
                  <span className="text-accent-primary font-bold text-xs">{threshold}</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="0.99"
                  step="0.01"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full accent-accent-primary bg-surface-panel rounded h-1 cursor-pointer"
                />
                <div className="flex justify-between text-2xs font-mono text-content-muted">
                  <span>0.50 (High Sensitivity / Higher False Alarm)</span>
                  <span>0.99 (High Specificity)</span>
                </div>
              </div>

              {/* Parameters List */}
              <div className="pt-2 border-t border-border-subtle space-y-2">
                <span className="text-2xs font-mono uppercase tracking-wider text-content-muted block">
                  Algorithm Parameters
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs font-mono">
                  {selectedAlgo.params.map((p, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-surface-secondary/50 border border-border-subtle">
                      <span className="text-content-muted block">{p.name}</span>
                      <span className="text-content-primary font-semibold">{p.defaultVal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Mathematical Formulation & Launch Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card variant="elevated">
            <CardHeader className="pb-3 border-b border-border-subtle">
              <CardTitle className="text-xs flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-accent-primary" />
                Mathematical Formulation
              </CardTitle>
              <CardDescription className="text-2xs">
                Analytical operator for {selectedAlgo.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Formula Callout */}
              <div className="p-3.5 rounded-lg bg-surface-panel border border-border-subtle font-mono text-xs text-accent-primary text-center">
                {selectedAlgo.equation}
              </div>

              <p className="text-2xs text-content-secondary leading-relaxed">
                {selectedAlgo.summary}
              </p>

              {/* Pre-flight summary */}
              <div className="p-3 rounded-lg bg-surface-secondary/40 border border-border-subtle space-y-1.5 text-2xs font-mono">
                <div className="flex justify-between">
                  <span className="text-content-muted">ALGORITHM:</span>
                  <span className="text-content-primary font-semibold">{selectedAlgo.acronym}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">TARGET SCENE:</span>
                  <span className="text-content-primary truncate max-w-[180px]">{selectedScene}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">THRESHOLD (&tau;):</span>
                  <span className="text-accent-primary font-semibold">{threshold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">SCENE BANDS:</span>
                  <span className="text-content-secondary">{activeScene?.spectralBands ?? "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-content-muted">EXECUTION:</span>
                  <span className="text-content-secondary">Frontend preview only</span>
                </div>
              </div>

              {/* Launch Mission Button */}
              <Button
                variant="primary"
                size="md"
                className="w-full justify-center"
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                onClick={handleLaunchJob}
              >
                Launch Detection Mission (Preview)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
