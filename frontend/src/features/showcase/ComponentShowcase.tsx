import React, { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Tooltip } from "@/components/ui/Tooltip";
import { Modal } from "@/components/ui/Modal";
import { Tabs, TabsList, TabTrigger, TabContent } from "@/components/ui/Tabs";
import { Avatar } from "@/components/ui/Avatar";
import { Divider } from "@/components/ui/Divider";
import { IconButton } from "@/components/ui/IconButton";
import { Spinner } from "@/components/feedback/Spinner";
import { Skeleton } from "@/components/feedback/Skeleton";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ErrorState } from "@/components/feedback/ErrorState";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { useToast } from "@/hooks/useToast";
import {
  Sparkles,
  Layers,
  Satellite,
  Download,
  Trash2,
  Settings,
  Bell,
  Cpu,
  RefreshCw,
} from "lucide-react";

export const ComponentShowcase: React.FC = () => {
  const toast = useToast();

  // Component state
  const [activeTab, setActiveTab] = useState("buttons");
  const [textVal, setTextVal] = useState("AVIRIS Indian Pines");
  const [searchVal, setSearchVal] = useState("");
  const [pwdVal, setPwdVal] = useState("GeoSecret2026!");
  const [selectVal, setSelectVal] = useState("rxd");
  const [chk1, setChk1] = useState(true);
  const [chk2, setChk2] = useState(false);
  const [chkIndet, setChkIndet] = useState(true);
  const [switch1, setSwitch1] = useState(true);
  const [switch2, setSwitch2] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const simulateLoading = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
      toast.success("Algorithm Executed", "Processing completed in 1.42s");
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <PageHeader
        category="SYSTEM DESIGN"
        title="Design System & Component Showcase"
        subtitle="Interactive workbench for testing and inspecting GeoAstra's dark-first scientific workstation components."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Bell className="w-3.5 h-3.5 text-accent-primary" />}
              onClick={() =>
                toast.info("Toast System", "Interactive notification triggered successfully.")
              }
            >
              Test Notification
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={() => setIsModalOpen(true)}
            >
              Open Test Dialog
            </Button>
          </div>
        }
      />

      {/* Tabs navigation for categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="pills" className="overflow-x-auto max-w-full">
          <TabTrigger value="buttons" variant="pills">
            Buttons & Icons
          </TabTrigger>
          <TabTrigger value="inputs" variant="pills">
            Inputs & Forms
          </TabTrigger>
          <TabTrigger value="surfaces" variant="pills">
            Cards & Badges
          </TabTrigger>
          <TabTrigger value="feedback" variant="pills">
            Feedback & Modals
          </TabTrigger>
        </TabsList>

        {/* 1. BUTTONS & ICONS */}
        <TabContent value="buttons" className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                Interactive button styles with hover, active, loading, and disabled states.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="destructive">Destructive Button</Button>
              </div>

              <Divider label="BUTTON SIZES" />

              <div className="flex flex-wrap items-center gap-3">
                <Button size="xs">Extra Small (xs)</Button>
                <Button size="sm">Small (sm)</Button>
                <Button size="md">Medium (md)</Button>
                <Button size="lg">Large (lg)</Button>
              </div>

              <Divider label="STATES & ICONS" />

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  isLoading={btnLoading}
                  onClick={simulateLoading}
                  leftIcon={<Cpu className="w-4 h-4" />}
                >
                  {btnLoading ? "Processing..." : "Trigger Async Job"}
                </Button>
                <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />}>
                  Export GeoTIFF
                </Button>
                <Button variant="destructive" leftIcon={<Trash2 className="w-4 h-4" />}>
                  Delete AOI
                </Button>
                <Button variant="primary" disabled>
                  Disabled State
                </Button>
              </div>

              <Divider label="ICON BUTTONS" />

              <div className="flex flex-wrap items-center gap-3">
                <IconButton
                  icon={<Settings className="w-4 h-4" />}
                  tooltip="Workstation Settings"
                  variant="default"
                />
                <IconButton
                  icon={<Satellite className="w-4 h-4" />}
                  tooltip="Scene Explorer"
                  variant="primary"
                />
                <IconButton
                  icon={<Layers className="w-4 h-4" />}
                  tooltip="Layers Manager"
                  variant="outline"
                />
                <IconButton
                  icon={<RefreshCw className="w-4 h-4" />}
                  tooltip="Refresh Telemetry"
                  variant="ghost"
                />
                <IconButton
                  icon={<Trash2 className="w-4 h-4" />}
                  tooltip="Delete Area"
                  variant="destructive"
                />
              </div>
            </CardContent>
          </Card>
        </TabContent>

        {/* 2. INPUTS & FORMS */}
        <TabContent value="inputs" className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Form Controls</CardTitle>
              <CardDescription>
                Accessible, styled inputs tailored for scientific parameters and data entry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Dataset Title"
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  helperText="User-friendly name for spatial observation"
                />

                <Input
                  type="search"
                  label="Search Observations"
                  placeholder="Filter by sensor, date, or AOI..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  clearable
                  onClear={() => setSearchVal("")}
                />

                <Input
                  type="password"
                  label="AI Provider API Key"
                  value={pwdVal}
                  onChange={(e) => setPwdVal(e.target.value)}
                  helperText="Supports NVIDIA NIM, Hugging Face, or NaraRouter keys"
                />

                <Input
                  type="number"
                  label="Regularization Lambda"
                  defaultValue="0.0001"
                  step="0.0001"
                  helperText="Diagonal loading factor to prevent covariance matrix singularity"
                />

                <Input
                  label="Input with Error"
                  defaultValue="invalid_spectral_value"
                  error="Wavelength vector length (103) does not match target bands (200)"
                />

                <Select
                  label="Detection Algorithm"
                  value={selectVal}
                  onChange={(e) => setSelectVal(e.target.value)}
                  options={[
                    { value: "rxd", label: "Reed-Xiaoli Anomaly Detector (RXD)" },
                    { value: "matched_filter", label: "Matched Filter (MF)" },
                    { value: "cem", label: "Constrained Energy Minimization (CEM)" },
                    { value: "fusion", label: "Score Fusion (MF + RXD)" },
                  ]}
                  helperText="Select target or anomaly detection formulation"
                />
              </div>

              <Divider label="CHECKBOXES & SWITCHES" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-content-primary">
                    Checkboxes
                  </h4>
                  <div className="space-y-2">
                    <Checkbox
                      checked={chk1}
                      onChange={(e) => setChk1(e.target.checked)}
                      label="Atmospheric Water Vapor Correction"
                      description="Filters bad bands in 1350-1450nm and 1800-1950nm"
                    />
                    <Checkbox
                      checked={chk2}
                      onChange={(e) => setChk2(e.target.checked)}
                      label="PCA Dimensionality Reduction"
                      description="Reduces spectral dimensions to principal components"
                    />
                    <Checkbox
                      checked={false}
                      indeterminate={chkIndet}
                      onChange={() => setChkIndet(!chkIndet)}
                      label="Partial Selection (Indeterminate)"
                    />
                    <Checkbox disabled label="Disabled Option" />
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-content-primary">
                    Switches / Toggles
                  </h4>
                  <div className="space-y-3">
                    <Switch
                      checked={switch1}
                      onChange={setSwitch1}
                      label="Multi-Provider LLM Explanation"
                      description="Dispatches metrics to NVIDIA NIM & Hugging Face"
                    />
                    <Switch
                      checked={switch2}
                      onChange={setSwitch2}
                      label="Client-side GeoTIFF In-memory Rendering"
                      description="Parses 32-bit rasters directly in the browser"
                    />
                    <Switch
                      checked={false}
                      disabled
                      label="Hardware Acceleration (Disabled)"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabContent>

        {/* 3. SURFACES & BADGES */}
        <TabContent value="surfaces" className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Badges & Status Indicators</CardTitle>
              <CardDescription>
                Telemetry pills, algorithm indicators, and system condition markers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary Accent</Badge>
                <Badge variant="secondary">Secondary Accent</Badge>
                <Badge variant="success" dot>
                  Online / Success
                </Badge>
                <Badge variant="warning" dot>
                  Warning
                </Badge>
                <Badge variant="danger" dot>
                  Critical Error
                </Badge>
                <Badge variant="outline">Outline</Badge>
              </div>

              <Divider label="USER AVATARS" />

              <div className="flex items-center gap-4">
                <Avatar name="Alex Mercer" size="xs" status="online" />
                <Avatar name="Elena Rostova" size="sm" status="busy" />
                <Avatar name="Marcus Vance" size="md" status="idle" />
                <Avatar name="David Chen" size="lg" status="offline" />
              </div>

              <Divider label="TOOLTIPS (ALL POSITIONS)" />

              <div className="flex flex-wrap items-center gap-6">
                <Tooltip content="Tooltip positioned on top" position="top">
                  <Button variant="outline" size="xs">
                    Hover Top
                  </Button>
                </Tooltip>
                <Tooltip content="Tooltip positioned on bottom" position="bottom">
                  <Button variant="outline" size="xs">
                    Hover Bottom
                  </Button>
                </Tooltip>
                <Tooltip content="Tooltip positioned on left" position="left">
                  <Button variant="outline" size="xs">
                    Hover Left
                  </Button>
                </Tooltip>
                <Tooltip content="Tooltip positioned on right" position="right">
                  <Button variant="outline" size="xs">
                    Hover Right
                  </Button>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </TabContent>

        {/* 4. FEEDBACK & MODALS */}
        <TabContent value="feedback" className="space-y-6">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Feedback Components</CardTitle>
              <CardDescription>
                Interactive notifications, loading states, error boundaries, and empty states.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-xs font-semibold text-content-primary mb-3">
                  Toast Notification Triggers
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.success(
                        "Job COMPLETED",
                        "Reed-Xiaoli Detector identified 8 anomalous clusters."
                      )
                    }
                  >
                    Trigger Success Toast
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.error(
                        "Covariance Singularity",
                        "Matrix inversion failed. Increase regularization lambda."
                      )
                    }
                  >
                    Trigger Error Toast
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.warning(
                        "Quota Approaching",
                        "NVIDIA NIM token utilization reached 85%."
                      )
                    }
                  >
                    Trigger Warning Toast
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.info(
                        "Scene Seeded",
                        "Indian Pines 200 bands dataset ready in storage/input/."
                      )
                    }
                  >
                    Trigger Info Toast
                  </Button>
                </div>
              </div>

              <Divider label="LOADING SPINNERS & SKELETONS" />

              <div className="flex items-center gap-6">
                <Spinner size="xs" variant="primary" />
                <Spinner size="sm" variant="secondary" />
                <Spinner size="md" variant="primary" />
                <Spinner size="lg" variant="white" />
                <Spinner size="xl" variant="muted" />
              </div>

              <div className="space-y-2 max-w-md">
                <Skeleton variant="rectangle" height="18px" className="w-3/4" />
                <Skeleton variant="text" />
                <Skeleton variant="text" className="w-5/6" />
                <div className="flex items-center gap-3 mt-3">
                  <Skeleton variant="circle" width="36px" height="36px" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton variant="text" className="w-1/2" />
                    <Skeleton variant="text" className="w-1/3" />
                  </div>
                </div>
              </div>

              <Divider label="MODALS & DIALOGS" />

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                >
                  Open Analysis Config Modal
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Open Destructive Confirmation
                </Button>
              </div>

              <Divider label="EMPTY & ERROR STATES" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EmptyState
                  title="No Hyperspectral Observations Found"
                  description="No satellite observations intersect the selected spatial area for the chosen temporal range."
                  action={
                    <Button variant="outline" size="sm">
                      Expand Spatial Bounding Box
                    </Button>
                  }
                />

                <ErrorState
                  title="FastAPI Scientific Gateway Unreachable"
                  code="ERR_CONN_REFUSED_8000"
                  message="ai-engine container on port 8000 did not respond within 10000ms timeout."
                  onRetry={() =>
                    toast.info("Retrying", "Attempting connection to ai-engine...")
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabContent>
      </Tabs>

      {/* Test Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configure Hyperspectral Pipeline"
        description="Select scientific detector and regularization parameters."
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsModalOpen(false);
                toast.success("Job Enqueued", "Dispatched to BullMQ analysis queue.");
              }}
            >
              Enqueue Execution
            </Button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs text-content-secondary">
          <p>
            The scientific engine will preprocess the cube, remove dead bands, and calculate
            Mahalanobis distance statistics.
          </p>
          <Input
            label="Analysis Label"
            defaultValue="Run #2026-11-13_RXD_IndianPines"
          />
          <Select
            label="Selected Sensor"
            options={[
              { value: "aviris", label: "AVIRIS (Airborne Visible/Infrared)" },
              { value: "emit", label: "EMIT (Earth Surface Mineral Dust)" },
              { value: "rosis", label: "ROSIS (Reflective Optics System)" },
            ]}
          />
        </div>
      </Modal>

      {/* Test Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          toast.warning("Cancelled", "BullMQ job was dequeued and halted.");
        }}
        title="Cancel Scientific Processing Job?"
        message="This will immediately stop algorithm execution on worker nodes and discard intermediate covariance matrices."
        confirmLabel="Cancel Job"
        isDestructive
      />
    </div>
  );
};
