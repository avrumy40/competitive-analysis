export interface CompetitorCapabilities {
  analytics: boolean;
  financialPlanning: boolean;
  assortmentPlanning: boolean;
  initialAllocations: boolean;
  replenishment: boolean;
  storeTransfers: boolean;
  pricing: boolean;
  markdownOptimization: boolean;
  aiSpecialEvents: boolean;
  proactiveInsights: boolean;
  dynamicInventoryTargets: boolean;
}

export interface FilterOptions {
  category: string;
  similarity: number | null;
  searchTerm: string;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf';
  includeCapabilities: boolean;
  includeKillPoints: boolean;
}

export interface ChartDataPoint {
  name: string;
  x: number;
  y: number;
  category: string;
  similarity: number;
}
