import { Feature, FeatureCollection, Point, Polygon, MultiPolygon } from "geojson";

export interface DemoDetectionProperties {
  id: string;
  detectionId: string;
  score: number;
  category: string;
  areaKm2: number | null;
  centroid: [number, number] | null;
  aoiName: string;
  sceneName: string;
  illustrative: true;
}

export type DemoDetectionFeature = Feature<Polygon | MultiPolygon, DemoDetectionProperties>;

export interface DemoResultFixture {
  jobId: string;
  illustrative: true;
  features: FeatureCollection<Polygon | MultiPolygon, DemoDetectionProperties>;
  heatmap: FeatureCollection<Point, { intensity: number; illustrative: true }>;
  metrics: {
    precision: number;
    recall: number;
    f1: number;
    auc: number;
  };
  roc: Array<{ fpr: number; tpr: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
}
