import type { Category } from "@/types/print";

// A catalog category, or "tous" to not filter.
// Used by the filter buttons above the gallery.
export type CategoryFilter = Category | "tous";

// A category filter button displayed above the gallery.
export type CategoryFilterOption = {
  value: CategoryFilter;
  label: string;
};
