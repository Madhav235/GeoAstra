import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Server, AlertTriangle } from "lucide-react";

interface ServiceTopologyNode {
  name: string;
  role: string;
  port: number;
  protocol: string;
  framework: string;
  endpoint: string;
  status: string;
  description: string;
  auditNotes: string;
}

const TOPOLOGY_NODES: ServiceTopologyNode[] = [
  {
    name: "Express API Gateway",
    role: "Main HTTP Gateway & Session Auth",
    port: 5001,
    protocol: "HTTP/REST",
    framework: "Node.js 20, Express 4, Prisma Client",
    endpoint: "http://localhost:5001/api",
    status: "NOT CONNECTED (DEMO PREVIEW)",
    description: "Handles JWT authentication, dataset metadata uploads, BullMQ queue dispatch, and analytical proxying.",
    auditNotes: "All 18 routes verified in backend audit. Gateway will be connected in future milestone.",
  },
  {
    name: "Python AI Engine",
    role: "Hyperspectral Compute & ML",
    port: 8000,
    protocol: "HTTP/REST",
    framework: "Python 3.11, FastAPI, NumPy, SciPy, Rasterio",
    endpoint: "http://localhost:8000/api",
    status: "NOT CONNECTED (DEMO PREVIEW)",
    description: "Executes RXD anomaly detection, Matched Filter projections, CEM energy minimization, and false-alarm suppression.",
    auditNotes: "Standalone FastAPI microservice with vectorized NumPy covariance tensor inversion.",
  },
  {
    name: "PostGIS Spatial Database",
    role: "Relational & Geospatial Storage",
    port: 5432,
    protocol: "PostgreSQL Wire Protocol",
    framework: "PostgreSQL 15 + PostGIS 3.3",
    endpoint: "postgresql://localhost:5432/geoastra",
    status: "NOT CONNECTED (DEMO PREVIEW)",
    description: "Stores spatial geometries (ST_Polygon), scene bounding footprints, user credentials, and analysis logs.",
    auditNotes: "Schema managed via Prisma migrations with spatial indexing on target bounding polygons.",
  },
  {
    name: "Redis Queue & BullMQ",
    role: "Distributed Async Job Broker",
    port: 6379,
    protocol: "Redis RESP",
    framework: "Redis 7-Alpine, BullMQ 5",
    endpoint: "redis://localhost:6379",
    status: "NOT CONNECTED (DEMO PREVIEW)",
    description: "Decouples heavy multi-gigabyte raster processing jobs from the HTTP request-response cycle.",
    auditNotes: "BullMQ job worker queues: 'scene-ingestion' and 'hyperspectral-analysis'.",
  },
];

export const StatusPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <PageHeader
        category="SYSTEM ARCHITECTURE"
        title="Service Topology & Architecture Status"
        subtitle="Architectural topology and service mappings for Express Gateway, Python AI Engine, PostGIS Spatial Database, and BullMQ Task Queue."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" size="md" dot>
              BACKEND NOT CONNECTED (DEMO MODE)
            </Badge>
          </div>
        }
      />

      {/* Prominent Demo Notice Banner */}
      <div className="p-4 rounded-lg border border-status-warning/40 bg-status-warning/10 space-y-2">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />
          <h3 className="text-xs font-semibold text-status-warning uppercase font-mono tracking-wider">
            Demo Workstation Mode Active — Live Backend Not Connected
          </h3>
        </div>
        <p className="text-2xs text-content-secondary leading-relaxed pl-7">
          This frontend application is currently operating as an independent client-side workstation demo.
          No live network requests are dispatched to port 5001 or port 8000. All metrics, catalog items, and
          processing queues across the interface use curated sample data.
          Backend connectivity and real-time health telemetry will be activated in subsequent integration milestones.
        </p>
      </div>

      {/* Grid of 4 Service Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOPOLOGY_NODES.map((node, idx) => (
          <Card key={idx} variant="elevated" className="border-border-strong/70 flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-border-subtle">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-xs font-bold text-content-primary">{node.name}</CardTitle>
                  <CardDescription className="font-mono text-2xs text-accent-primary">
                    Port {node.port}
                  </CardDescription>
                </div>
                <Badge variant="warning" size="sm">
                  OFFLINE
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-2xs text-content-secondary leading-relaxed">
                  {node.description}
                </p>
                <div className="p-2 rounded bg-surface-secondary/60 border border-border-subtle text-[11px] font-mono space-y-1">
                  <div className="text-content-muted">STACK:</div>
                  <div className="text-content-primary">{node.framework}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-border-subtle text-[10px] font-mono text-content-muted">
                {node.auditNotes}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Topology Architecture Table */}
      <Card variant="elevated">
        <CardHeader className="pb-3 border-b border-border-subtle">
          <CardTitle className="text-xs flex items-center gap-2">
            <Server className="w-4 h-4 text-accent-primary" />
            Backend Integration Specifications (From Audit)
          </CardTitle>
          <CardDescription className="text-2xs">
            Verified service interfaces and communication protocols
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-2xs font-mono">
              <thead className="bg-surface-secondary border-b border-border-subtle text-content-muted">
                <tr>
                  <th className="p-3">SUBSYSTEM</th>
                  <th className="p-3">LOCAL ENDPOINT</th>
                  <th className="p-3">PROTOCOL</th>
                  <th className="p-3">INTEGRATION STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-content-secondary">
                <tr className="hover:bg-surface-elevated/40">
                  <td className="p-3 font-semibold text-content-primary">Express API Gateway</td>
                  <td className="p-3 text-accent-primary">http://localhost:5001/api</td>
                  <td className="p-3">HTTP / JSON (REST)</td>
                  <td className="p-3"><Badge variant="warning" size="sm">Awaiting Milestone 3</Badge></td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="p-3 font-semibold text-content-primary">FastAPI AI Engine</td>
                  <td className="p-3 text-accent-primary">http://localhost:8000/api</td>
                  <td className="p-3">HTTP / REST + NumPy</td>
                  <td className="p-3"><Badge variant="warning" size="sm">Awaiting Milestone 4</Badge></td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="p-3 font-semibold text-content-primary">PostgreSQL / PostGIS</td>
                  <td className="p-3 text-accent-primary">localhost:5432</td>
                  <td className="p-3">TCP / PostgreSQL</td>
                  <td className="p-3"><Badge variant="outline" size="sm">Ready (Docker Compose)</Badge></td>
                </tr>
                <tr className="hover:bg-surface-elevated/40">
                  <td className="p-3 font-semibold text-content-primary">Redis BullMQ Broker</td>
                  <td className="p-3 text-accent-primary">localhost:6379</td>
                  <td className="p-3">TCP / Redis RESP</td>
                  <td className="p-3"><Badge variant="outline" size="sm">Ready (Docker Compose)</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
