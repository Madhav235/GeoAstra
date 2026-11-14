import { bbox as turfBbox, centroid as turfCentroid, booleanPointInPolygon } from "@turf/turf";
import { AOIFeature } from "@/features/geospatial/types/geospatial.types";
import { SceneCatalogItem } from "@/features/scenes/types";
import { AnalysisJobRecord } from "@/features/analysis/types";
import { DemoResultFixture } from "../types";

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result = Math.imul(result ^ value.charCodeAt(index), 16777619);
  }
  return result >>> 0;
}

function randomUnit(seed: number): () => number {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function getExtent(aoi: AOIFeature | undefined, scene: SceneCatalogItem | undefined): [number, number, number, number] {
  if (aoi) return turfBbox(aoi) as [number, number, number, number];
  if (scene?.footprint) return turfBbox(scene.footprint) as [number, number, number, number];
  if (scene?.coordinates) {
    const [lng, lat] = scene.coordinates;
    return [lng - 0.06, lat - 0.04, lng + 0.06, lat + 0.04];
  }
  return [-102.14, 31.93, -102.05, 32.01];
}

function isWithinAoi(point: [number, number], aoi: AOIFeature | undefined): boolean {
  if (!aoi) return true;
  try {
    return booleanPointInPolygon(point, aoi);
  } catch (error) {
    console.error("Could not test illustrative point against AOI geometry:", error);
    return true;
  }
}

export function createDemoResultFixture(
  job: AnalysisJobRecord,
  aoi: AOIFeature | undefined,
  scene: SceneCatalogItem | undefined
): DemoResultFixture {
  const [west, south, east, north] = getExtent(aoi, scene);
  const width = Math.max(east - west, 0.0001);
  const height = Math.max(north - south, 0.0001);
  const center: [number, number] = aoi
    ? (turfCentroid(aoi).geometry.coordinates as [number, number])
    : scene?.coordinates ?? [(west + east) / 2, (south + north) / 2];
  const rng = randomUnit(hash(job.id));
  const target = job.targetSignatureName ?? (
    job.configuration.algorithm === "rxd" ? "Unsupervised anomaly example" : "Unspecified illustrative target"
  );
  const scoreBase = 0.72 + rng() * 0.2;
  const featureCount = 5;

  const features = Array.from({ length: featureCount }, (_, index) => {
    const col = index % 3;
    const row = Math.floor(index / 3);
    let lng = west + width * (0.25 + col * 0.24);
    let lat = south + height * (0.28 + row * 0.42);
    if (aoi && !isWithinAoi([lng, lat], aoi)) {
      lng = center[0] + (col - 1) * width * 0.08;
      lat = center[1] + (row - 0.5) * height * 0.08;
    }
    const halfWidth = width * 0.022;
    const halfHeight = height * 0.025;
    const id = `${job.id}-demo-detection-${String(index + 1).padStart(2, "0")}`;
    const coordinates = [[
      [lng - halfWidth, lat - halfHeight],
      [lng + halfWidth, lat - halfHeight],
      [lng + halfWidth, lat + halfHeight],
      [lng - halfWidth, lat + halfHeight],
      [lng - halfWidth, lat - halfHeight],
    ]];
    return {
      type: "Feature" as const,
      id,
      geometry: { type: "Polygon" as const, coordinates },
      properties: {
        id,
        detectionId: `DEMO-${String(index + 1).padStart(3, "0")}`,
        score: Number(Math.min(0.99, scoreBase - index * 0.045).toFixed(3)),
        category: target,
        areaKm2: Number(((aoi?.properties.areaKm2 ?? 10) * (0.0015 + index * 0.0003)).toFixed(3)),
        centroid: [Number(lng.toFixed(6)), Number(lat.toFixed(6))] as [number, number],
        aoiName: job.aoiName,
        sceneName: job.sceneName,
        illustrative: true as const,
      },
    };
  });

  const heatmapFeatures = Array.from({ length: 28 }, () => {
    const lng = west + width * (0.12 + rng() * 0.76);
    const lat = south + height * (0.12 + rng() * 0.76);
    return {
      type: "Feature" as const,
      geometry: { type: "Point" as const, coordinates: [lng, lat] as [number, number] },
      properties: { intensity: Number((0.2 + rng() * 0.8).toFixed(3)), illustrative: true as const },
    };
  }).filter((feature) => isWithinAoi(feature.geometry.coordinates, aoi));

  const metrics = {
    precision: Number((0.74 + rng() * 0.18).toFixed(3)),
    recall: Number((0.69 + rng() * 0.2).toFixed(3)),
    f1: 0,
    auc: Number((0.78 + rng() * 0.17).toFixed(3)),
  };
  metrics.f1 = Number((2 * metrics.precision * metrics.recall / (metrics.precision + metrics.recall)).toFixed(3));

  return {
    jobId: job.id,
    illustrative: true,
    features: { type: "FeatureCollection", features },
    heatmap: { type: "FeatureCollection", features: heatmapFeatures },
    metrics,
    roc: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.04, tpr: 0.34 },
      { fpr: 0.1, tpr: 0.61 },
      { fpr: 0.2, tpr: 0.78 },
      { fpr: 0.38, tpr: 0.89 },
      { fpr: 0.62, tpr: 0.96 },
      { fpr: 1, tpr: 1 },
    ],
    scoreDistribution: [
      { range: "0.0–0.2", count: 8 },
      { range: "0.2–0.4", count: 17 },
      { range: "0.4–0.6", count: 24 },
      { range: "0.6–0.8", count: 31 },
      { range: "0.8–1.0", count: 20 },
    ],
  };
}
