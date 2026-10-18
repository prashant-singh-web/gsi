"use client";

import { X } from "lucide-react";
import { valueLabels } from "@/lib/product/FilterProduct";

const ORDER = ["category", "type", "load", "features"];

export default function ActiveFilters({
  selected,
  onToggle,
  onClearAll,
}: {
  selected: Record<string, string[]>;
  onToggle: (k: string, v: string) => void;
  onClearAll: () => void;
}) {
  const pills = Object.entries(selected)
    .flatMap(([k, vs]) => vs.map((v) => ({ k, v })))
    .sort((a, b) => ORDER.indexOf(a.k) - ORDER.indexOf(b.k));

  if (!pills.length) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      {pills.map(({ k, v }) => (
        <button
          key={`${k}-${v}`}
          onClick={() => onToggle(k, v)}
          className="
            inline-flex items-center gap-1.5 rounded-full
            border border-border
            bg-surface
            px-3 py-1 text-xs
            text-text-secondary
            transition
            hover:border-primary/40
            hover:bg-primary/5
            hover:text-primary
          "
        >
          {valueLabels[k]?.[v] ?? v}
          <X size={12} className="text-text-muted" />
        </button>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-text-muted transition hover:text-text-primary"
      >
        Clear all
      </button>
    </div>
  );
}