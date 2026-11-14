import { SceneCatalogItem, SceneFilters, SceneSortField, SortDirection } from "../types";

export function listScenes(builtIn: SceneCatalogItem[], uploaded: SceneCatalogItem[] = []): SceneCatalogItem[] {
  return [...uploaded, ...builtIn];
}

export function searchScenes(scenes: SceneCatalogItem[], query: string): SceneCatalogItem[] {
  const term = query.trim().toLocaleLowerCase();
  if (!term) return scenes;

  return scenes.filter((scene) =>
    [
      scene.name,
      scene.datasetId,
      scene.sensor,
      scene.provider,
      scene.location,
    ].some((value) => value.toLocaleLowerCase().includes(term))
  );
}

export function filterScenes(scenes: SceneCatalogItem[], filters: SceneFilters): SceneCatalogItem[] {
  const minResolution = filters.minResolution === "" ? null : Number(filters.minResolution);
  const maxResolution = filters.maxResolution === "" ? null : Number(filters.maxResolution);

  return scenes.filter((scene) => {
    if (filters.sensors.length && !filters.sensors.includes(scene.sensor)) return false;
    if (filters.providers.length && !filters.providers.includes(scene.provider)) return false;
    if (filters.startDate && (!scene.acquisitionDate || scene.acquisitionDate < filters.startDate)) return false;
    if (filters.endDate && (!scene.acquisitionDate || scene.acquisitionDate > filters.endDate)) return false;
    if (filters.groundTruth === "available" && scene.groundTruthAvailable !== true) return false;
    if (filters.groundTruth === "unavailable" && scene.groundTruthAvailable !== false) return false;
    if (filters.availability !== "all" && scene.availability !== filters.availability) return false;
    if (minResolution !== null && (scene.spatialResolutionM === null || scene.spatialResolutionM < minResolution)) return false;
    if (maxResolution !== null && (scene.spatialResolutionM === null || scene.spatialResolutionM > maxResolution)) return false;
    return true;
  });
}

export function sortScenes(
  scenes: SceneCatalogItem[],
  field: SceneSortField,
  direction: SortDirection
): SceneCatalogItem[] {
  const multiplier = direction === "asc" ? 1 : -1;
  return [...scenes].sort((a, b) => {
    const first = a[field];
    const second = b[field];
    if (first === null || first === undefined) return second === null || second === undefined ? 0 : 1;
    if (second === null || second === undefined) return -1;
    if (typeof first === "string" && typeof second === "string") {
      return first.localeCompare(second) * multiplier;
    }
    return (Number(first) - Number(second)) * multiplier;
  });
}

export function queryScenes(
  scenes: SceneCatalogItem[],
  query: string,
  filters: SceneFilters,
  sortField: SceneSortField,
  sortDirection: SortDirection
): SceneCatalogItem[] {
  return sortScenes(filterScenes(searchScenes(scenes, query), filters), sortField, sortDirection);
}

export function getSceneDetails(scenes: SceneCatalogItem[], id: string): SceneCatalogItem | undefined {
  return scenes.find((scene) => scene.id === id);
}

export function toggleCatalogSceneSelection(selectedIds: string[], id: string): string[] {
  return selectedIds.includes(id)
    ? selectedIds.filter((sceneId) => sceneId !== id)
    : [...selectedIds, id];
}

export function removeCatalogSceneSelection(selectedIds: string[], id: string): string[] {
  return selectedIds.filter((sceneId) => sceneId !== id);
}

export const MAX_UPLOAD_BYTES = 1_000_000_000;
const SUPPORTED_EXTENSIONS = [".tif", ".tiff", ".hdr", ".raw", ".zip"];

export function validateDatasetFile(file: File): string | null {
  const extension = file.name.toLocaleLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    return "Unsupported file type. Choose a .tif, .tiff, .hdr, .raw, or .zip file.";
  }
  if (file.size === 0) return "The selected file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "File exceeds the 1 GB demo upload limit.";
  return null;
}

function wait(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Upload cancelled", "AbortError"));
      return;
    }
    const timeout = window.setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout);
        reject(new DOMException("Upload cancelled", "AbortError"));
      },
      { once: true }
    );
  });
}

export async function simulateDatasetUpload(
  file: File,
  onProgress: (progress: number) => void,
  signal: AbortSignal
): Promise<void> {
  for (const progress of [12, 28, 46, 64, 82, 100]) {
    await wait(180, signal);
    onProgress(progress);
  }
  if (file.name.toLocaleLowerCase().includes("simulate-failure")) {
    throw new Error("The demo upload failure was simulated. No file was sent or stored.");
  }
}

export function createUploadedScene(file: File): SceneCatalogItem {
  const id = `demo-upload-${Date.now()}`;
  const name = file.name.replace(/\.[^.]+$/, "");
  const extension = file.name.toLocaleLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
  return {
    id,
    name: name || file.name,
    datasetId: id.toLocaleUpperCase(),
    sensor: "Unknown",
    sensorType: "Unknown",
    provider: "User-supplied (local demo)",
    acquisitionDate: null,
    location: "Not provided",
    coordinates: null,
    crs: null,
    spatialResolutionM: null,
    spectralBands: null,
    wavelengthRangeNm: null,
    dataFormat: extension.replace(".", "").toUpperCase(),
    groundTruthAvailable: null,
    groundTruthClasses: [],
    dimensions: null,
    dataSizeBytes: file.size,
    availability: "Demo Upload",
    cloudCoverPercent: null,
    tags: [],
    description: "A local file was accepted by the frontend demo validator. Dataset metadata has not been inspected.",
    source: "Frontend-only simulated upload",
    metadataNote: "The file bytes are not uploaded or persisted. Reloading the page removes this demo catalogue entry.",
    footprint: null,
    isSample: true,
  };
}
