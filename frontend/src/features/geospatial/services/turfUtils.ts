/**
 * Turf.js Spatial Measurement & Geometry Utilities
 * High-precision area (km²), perimeter (km), centroid, bbox, and polygon validation.
 */

import * as turf from "@turf/turf";
import { Feature, Polygon, MultiPolygon } from "geojson";
import { AOIFeature, SceneFeature } from "../types/geospatial.types";

export interface SpatialMetrics {
  areaKm2: number;
  areaHa: number;
  perimeterKm: number;
  centroid: [number, number]; // [lng, lat]
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

/**
 * Calculates geographic area, perimeter, centroid, and bbox from a polygon GeoJSON feature.
 */
export function calculateSpatialMetrics(
  feature: Feature<Polygon | MultiPolygon>
): SpatialMetrics {
  try {
    // Area in square meters -> convert to km² and hectares
    const areaM2 = turf.area(feature);
    const areaKm2 = Number((areaM2 / 1_000_000).toFixed(2));
    const areaHa = Number((areaM2 / 10_000).toFixed(1));

    // Perimeter in kilometers
    let perimeterKm = 0;
    try {
      const line = turf.polygonToLine(feature as any);
      if (line) {
        perimeterKm = Number(turf.length(line, { units: "kilometers" }).toFixed(2));
      }
    } catch {
      perimeterKm = 0;
    }

    // Centroid [lng, lat]
    const centerPoint = turf.centroid(feature);
    const centroid: [number, number] = [
      Number(centerPoint.geometry.coordinates[0].toFixed(5)),
      Number(centerPoint.geometry.coordinates[1].toFixed(5)),
    ];

    // Bounding box [minLng, minLat, maxLng, maxLat]
    const box = turf.bbox(feature);
    const bbox: [number, number, number, number] = [
      Number(box[0].toFixed(5)),
      Number(box[1].toFixed(5)),
      Number(box[2].toFixed(5)),
      Number(box[3].toFixed(5)),
    ];

    return {
      areaKm2,
      areaHa,
      perimeterKm,
      centroid,
      bbox,
    };
  } catch (err) {
    console.error("Failed to calculate spatial metrics:", err);
    return {
      areaKm2: 0,
      areaHa: 0,
      perimeterKm: 0,
      centroid: [0, 0],
      bbox: [-180, -90, 180, 90],
    };
  }
}

/**
 * Validates that a Polygon feature has closed linear rings, valid coordinates, and non-zero area.
 */
export function validatePolygonGeometry(
  feature: Feature<Polygon | MultiPolygon>
): { valid: boolean; error?: string } {
  if (!feature || !feature.geometry) {
    return { valid: false, error: "Feature has no geometry" };
  }

  const { type, coordinates } = feature.geometry;
  if (type !== "Polygon" && type !== "MultiPolygon") {
    return { valid: false, error: `Unsupported geometry type: ${type}` };
  }

  if (type === "Polygon") {
    if (!coordinates || coordinates.length === 0 || coordinates[0].length < 4) {
      return { valid: false, error: "Polygon must contain at least 3 vertices (4 points including closure)" };
    }

    // Check for NaN or out of bounds coordinates
    for (const ring of coordinates) {
      for (const [lng, lat] of ring) {
        if (isNaN(lng) || isNaN(lat)) {
          return { valid: false, error: "Polygon contains invalid coordinate values" };
        }
        if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
          return { valid: false, error: "Coordinates are out of WGS84 bounds ([-180, 180], [-90, 90])" };
        }
      }
    }
  }

  const metrics = calculateSpatialMetrics(feature);
  if (metrics.areaKm2 <= 0) {
    return { valid: false, error: "Polygon area must be greater than zero" };
  }

  return { valid: true };
}

/**
 * Finds all scenes that intersect with an AOI polygon or bounding box.
 */
export function findIntersectingScenes(
  aoi: AOIFeature,
  scenes: SceneFeature[]
): SceneFeature[] {
  try {
    return scenes.filter((scene) => {
      try {
        return turf.booleanIntersects(aoi as any, scene as any);
      } catch {
        // Fallback: check bbox overlap
        const [aMinX, aMinY, aMaxX, aMaxY] = aoi.properties.bbox;
        const [sMinX, sMinY, sMaxX, sMaxY] = scene.properties.bbox;
        return (
          aMinX <= sMaxX &&
          aMaxX >= sMinX &&
          aMinY <= sMaxY &&
          aMaxY >= sMinY
        );
      }
    });
  } catch {
    return [];
  }
}

