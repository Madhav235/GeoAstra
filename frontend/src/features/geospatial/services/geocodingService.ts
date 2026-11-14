/**
 * Geocoding & Coordinate Resolution Service
 * Supports place search via Nominatim with robust offline fallback,
 * coordinate syntax parsing with range validation, and search history caching.
 */

import { GeocodingResult } from "../types/geospatial.types";

const RECENT_SEARCHES_KEY = "geoastra_recent_searches";
const MAX_RECENT_SEARCHES = 8;

/**
 * Curated offline geospatial locations and benchmarks
 */
const OFFLINE_LOCATIONS: GeocodingResult[] = [
  {
    id: "loc-permian",
    name: "Permian Basin (Delaware Basin)",
    displayName: "Reeves County, Texas, United States",
    lat: 31.9686,
    lng: -102.0988,
    type: "benchmark",
    bbox: [-102.25, 31.85, -101.95, 32.08],
  },
  {
    id: "loc-atacama",
    name: "Salar de Atacama",
    displayName: "Antofagasta Region, Atacama Desert, Chile",
    lat: -23.5,
    lng: -68.25,
    type: "benchmark",
    bbox: [-68.45, -23.7, -68.05, -23.3],
  },
  {
    id: "loc-pavia",
    name: "University of Pavia",
    displayName: "Corso Strada Nuova, Pavia, Lombardy, Italy",
    lat: 45.201,
    lng: 9.133,
    type: "benchmark",
    bbox: [9.11, 45.18, 9.16, 45.22],
  },
  {
    id: "loc-indian-pines",
    name: "Indian Pines Test Site",
    displayName: "Tippecanoe County, Indiana, United States",
    lat: 40.485,
    lng: -87.005,
    type: "benchmark",
    bbox: [-87.05, 40.45, -86.95, 40.52],
  },
  {
    id: "loc-hoggar",
    name: "Hoggar Mountains (Ahaggar)",
    displayName: "Tamanrasset Province, Southern Algeria",
    lat: 23.28,
    lng: 5.53,
    type: "benchmark",
    bbox: [5.35, 23.1, 5.75, 23.45],
  },
  {
    id: "loc-gulf",
    name: "Mississippi River Delta & Gulf Coast",
    displayName: "Pl观念ines Parish, Louisiana, United States",
    lat: 28.85,
    lng: -89.95,
    type: "benchmark",
    bbox: [-90.15, 28.65, -89.75, 29.05],
  },
  {
    id: "loc-geneva",
    name: "Geneva",
    displayName: "Canton of Geneva, Switzerland",
    lat: 46.2044,
    lng: 6.1432,
    type: "place",
  },
  {
    id: "loc-houston",
    name: "Houston",
    displayName: "Harris County, Texas, United States",
    lat: 29.7604,
    lng: -95.3698,
    type: "place",
  },
  {
    id: "loc-tokyo",
    name: "Tokyo",
    displayName: "Tokyo Metropolis, Kanto Region, Japan",
    lat: 35.6762,
    lng: 139.6503,
    type: "place",
  },
];

/**
 * Attempts to parse coordinate text (e.g., "31.9686, -102.0988" or "31.9686 -102.0988")
 * Returns [lng, lat] if valid within bounds [-180, 180] and [-90, 90], otherwise null.
 */
export function parseCoordinates(query: string): [number, number] | null {
  const trimmed = query.trim();
  // Match "lat, lon" or "lat lon"
  const regex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)[,\s]+[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
  if (!regex.test(trimmed)) return null;

  const parts = trimmed.split(/[\s,]+/).map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;

  const lat = parts[0];
  const lng = parts[1];

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }

  return [lng, lat];
}

export const geocodingService = {
  /**
   * Search for places or evaluate coordinates
   */
  async search(query: string): Promise<GeocodingResult[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    // Check if user input is coordinate format
    const coords = parseCoordinates(trimmed);
    if (coords) {
      const [lng, lat] = coords;
      return [
        {
          id: `coord-${lat.toFixed(4)}-${lng.toFixed(4)}`,
          name: `${lat.toFixed(5)}°, ${lng.toFixed(5)}°`,
          displayName: `Explicit Coordinates: Lat ${lat.toFixed(5)}, Lon ${lng.toFixed(5)} (WGS84)`,
          lat,
          lng,
          type: "coordinate",
        },
      ];
    }

    // Filter offline benchmark locations
    const localMatches = OFFLINE_LOCATIONS.filter(
      (loc) =>
        loc.name.toLowerCase().includes(trimmed.toLowerCase()) ||
        loc.displayName.toLowerCase().includes(trimmed.toLowerCase())
    );

    // If query is short, return local matches
    if (trimmed.length < 3) {
      return localMatches;
    }

    try {
      // Query OSM Nominatim with 3s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          trimmed
        )}&limit=5&addressdetails=1`,
        {
          headers: {
            "Accept-Language": "en",
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const apiResults: GeocodingResult[] = data.map((item: any) => ({
          id: `osm-${item.place_id}`,
          name: item.name || item.display_name.split(",")[0],
          displayName: item.display_name,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
          type: "place",
          bbox: item.boundingbox
            ? [
                parseFloat(item.boundingbox[2]),
                parseFloat(item.boundingbox[0]),
                parseFloat(item.boundingbox[3]),
                parseFloat(item.boundingbox[1]),
              ]
            : undefined,
        }));

        // Merge local matches with API results, avoiding duplicates
        const combined = [...localMatches];
        for (const res of apiResults) {
          if (!combined.some((c) => Math.abs(c.lat - res.lat) < 0.05 && Math.abs(c.lng - res.lng) < 0.05)) {
            combined.push(res);
          }
        }
        return combined.slice(0, 8);
      }
    } catch {
      // Network failure or timeout -> fallback safely to local matches
    }

    return localMatches;
  },

  /**
   * History of recent searches in localStorage
   */
  getRecentSearches(): GeocodingResult[] {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addRecentSearch(result: GeocodingResult): void {
    try {
      const history = this.getRecentSearches();
      const filtered = history.filter((h) => h.id !== result.id);
      const updated = [result, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  },

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore
    }
  },
};

