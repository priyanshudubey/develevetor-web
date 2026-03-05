import { useMemo, useState } from "react";
import type { FileInsight } from "../../../context/InsightsContext";

export type HeatmapFilter = "all" | "security" | "complexity" | "nesting";

export interface ScoreBreakdown {
  total: number;
  ccHealth: number;
  securityHealth: number;
  nestingHealth: number;
  ccFiles: FileInsight[];
  securityFiles: FileInsight[];
  nestingFiles: FileInsight[];
}

export function useInsightsData(insights: FileInsight[]) {
  const [heatmapFilter, setHeatmapFilter] = useState<HeatmapFilter>("all");
  const [isFiltering, setIsFiltering] = useState(false);
  const [refactorFile, setRefactorFile] = useState<FileInsight | null>(null);

  // Fake filtering delay for solid skeleton experience
  const handleFilterClick = (key: HeatmapFilter) => {
    setIsFiltering(true);
    setHeatmapFilter((prev) => (prev === key ? "all" : key));
    setTimeout(() => setIsFiltering(false), 800);
  };

  const breakdown = useMemo<ScoreBreakdown>(() => {
    if (insights.length === 0) {
      return {
        total: 100,
        ccHealth: 100,
        securityHealth: 100,
        nestingHealth: 100,
        ccFiles: [],
        securityFiles: [],
        nestingFiles: [],
      };
    }

    const ccFiles: FileInsight[] = [];
    const securityFiles: FileInsight[] = [];
    const nestingFiles: FileInsight[] = [];

    for (const f of insights) {
      if (f.cyclomatic_complexity > 15) ccFiles.push(f);
      if (f.vulnerability_tags.length > 0) securityFiles.push(f);
      if (f.max_nesting_depth > 5) nestingFiles.push(f);
    }

    const n = insights.length;
    // Per-category health: 100 * (clean files / total files)
    const ccHealth = Math.round(100 * ((n - ccFiles.length) / n));
    const securityHealth = Math.round(100 * ((n - securityFiles.length) / n));
    const nestingHealth = Math.round(100 * ((n - nestingFiles.length) / n));

    // Weighted average: 40% Complexity, 40% Security, 20% Nesting
    const total = Math.round(
      ccHealth * 0.4 + securityHealth * 0.4 + nestingHealth * 0.2
    );

    return {
      total,
      ccHealth,
      securityHealth,
      nestingHealth,
      ccFiles,
      securityFiles,
      nestingFiles,
    };
  }, [insights]);

  const topComplex = useMemo(() => {
    return [...insights]
      .sort((a, b) => b.cyclomatic_complexity - a.cyclomatic_complexity)
      .slice(0, 5);
  }, [insights]);

  // Apply heatmap filter — show ALL files when filtered, top 9 for "all"
  const filteredHeatmap = useMemo(() => {
    let pool: FileInsight[];
    switch (heatmapFilter) {
      case "security":
        pool = breakdown.securityFiles;
        break;
      case "complexity":
        pool = breakdown.ccFiles;
        break;
      case "nesting":
        pool = breakdown.nestingFiles;
        break;
      default:
        pool = insights;
    }
    const sorted = [...pool].sort(
      (a, b) => b.vulnerability_tags.length - a.vulnerability_tags.length
    );
    // Only cap at 9 for the default "all" view
    return heatmapFilter === "all" ? sorted.slice(0, 9) : sorted;
  }, [heatmapFilter, breakdown, insights]);

  return {
    heatmapFilter,
    isFiltering,
    refactorFile,
    setRefactorFile,
    handleFilterClick,
    breakdown,
    topComplex,
    filteredHeatmap,
  };
}
