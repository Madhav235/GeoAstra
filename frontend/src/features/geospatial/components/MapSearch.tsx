/**
 * Map Search Component
 * Provides debounced place name lookup, direct WGS84 coordinate navigation,
 * and persistent search history.
 */

import React, { useState, useEffect, useRef } from "react";
import { geocodingService } from "../services/geocodingService";
import { GeocodingResult } from "../types/geospatial.types";
import { useMapInstance } from "../hooks/useMapInstance";
import { Search, MapPin, Navigation, Compass, History, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const MapSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<GeocodingResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { flyTo, fitBounds } = useMapInstance();

  useEffect(() => {
    setRecentSearches(geocodingService.getRecentSearches());
  }, []);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const matches = await geocodingService.search(query);
        setResults(matches);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: GeocodingResult) => {
    geocodingService.addRecentSearch(item);
    setRecentSearches(geocodingService.getRecentSearches());

    if (item.bbox) {
      fitBounds(item.bbox, 60);
    } else {
      flyTo([item.lng, item.lat], item.type === "coordinate" ? 12 : 10);
    }

    setIsOpen(false);
    setQuery(item.name);
  };

  const handleClearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    geocodingService.clearRecentSearches();
    setRecentSearches([]);
  };

  return (
    <div className="relative w-64 sm:w-80" ref={containerRef}>
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-content-muted absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search place or Lat, Lon..."
          className={cn(
            "w-full h-8 pl-8.5 pr-8 bg-surface-elevated/90 border border-border-subtle rounded-md",
            "text-xs text-content-primary placeholder:text-content-muted",
            "focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary",
            "transition-colors"
          )}
        />
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 text-accent-primary absolute right-2.5 animate-spin" />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
            }}
            className="p-1 text-content-muted hover:text-content-primary absolute right-1.5"
          >
            <X className="w-3 h-3" />
          </button>
        ) : null}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-full rounded-lg bg-surface-elevated border border-border-subtle shadow-2xl p-1.5 z-50 max-h-80 overflow-y-auto space-y-1 backdrop-blur-md">
          {/* Query Results */}
          {results.length > 0 && (
            <div>
              <div className="px-2 py-1 text-2xs font-mono uppercase tracking-wider text-content-muted">
                Search Results
              </div>
              {results.map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => handleSelect(res)}
                  className="w-full flex items-start gap-2.5 px-2.5 py-2 rounded-md text-xs text-left text-content-secondary hover:bg-surface-panel hover:text-content-primary transition-colors"
                >
                  {res.type === "coordinate" ? (
                    <Navigation className="w-3.5 h-3.5 text-status-warning shrink-0 mt-0.5" />
                  ) : res.type === "benchmark" ? (
                    <Compass className="w-3.5 h-3.5 text-accent-primary shrink-0 mt-0.5" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-content-muted shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-content-primary truncate">{res.name}</div>
                    <div className="text-2xs text-content-muted truncate">{res.displayName}</div>
                  </div>
                  {res.type === "benchmark" && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-primary/10 text-accent-primary border border-accent-primary/20 shrink-0">
                      BENCHMARK
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No results message */}
          {query.trim().length >= 3 && !isLoading && results.length === 0 && (
            <div className="px-3 py-4 text-center text-xs text-content-muted">
              No matching locations or benchmarks found
            </div>
          )}

          {/* Recent Searches History */}
          {!query && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 py-1 text-2xs font-mono uppercase tracking-wider text-content-muted">
                <span className="flex items-center gap-1">
                  <History className="w-3 h-3" /> Recent Searches
                </span>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="hover:text-status-danger transition-colors text-2xs"
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => handleSelect(rec)}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs text-left text-content-secondary hover:bg-surface-panel hover:text-content-primary transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-content-muted shrink-0" />
                  <span className="truncate flex-1">{rec.name}</span>
                  <span className="text-2xs font-mono text-content-muted">
                    {rec.lat.toFixed(2)}, {rec.lng.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Helper tip */}
          {!query && recentSearches.length === 0 && (
            <div className="px-3 py-3 text-2xs text-content-muted leading-relaxed">
              <span className="text-content-secondary font-medium">Search Tips:</span> Enter place name (e.g., "Permian Basin", "Pavia") or decimal coordinates (e.g., <code className="text-accent-primary">31.968, -102.098</code>).
            </div>
          )}
        </div>
      )}
    </div>
  );
};

