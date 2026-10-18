"use client";

import { useMemo, useState } from "react";
import { ChevronDown, X, Check, SlidersHorizontal, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilterProduct,
  valueLabels,
  buildFilterCounts,
} from "@/lib/product/FilterProduct";

const counts = buildFilterCounts();
const easeOut = [0.16, 1, 0.3, 1] as const;

type Props = {
  selected: Record<string, string[]>;
  onToggle: (key: string, value: string) => void;
  onClearAll: () => void;
};

/* --------------------------- Checkbox --------------------------- */
function AnimatedCheckbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={`relative flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-200 ${
        checked
          ? "border-primary bg-primary shadow-[0_0_0_3px_var(--color-primary-glow)]"
          : "border-border bg-surface"
      }`}
    >
      <AnimatePresence initial={false}>
        {checked && (
          <motion.span
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: easeOut }}
            className="flex text-white"
          >
            <Check size={11} strokeWidth={3} />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* -------------------------- Filter Node ------------------------- */
function FilterNode({
  group,
  depth,
  selected,
  onToggle,
  openMap,
  setOpen,
}: {
  group: any;
  depth: number;
  selected: Record<string, string[]>;
  onToggle: (k: string, v: string) => void;
  openMap: Record<string, boolean>;
  setOpen: (k: string, v: boolean) => void;
}) {
  const isOpen = openMap[group.key] ?? depth === 0;
  const vals = Object.keys(counts[group.key] ?? {});
  if (!vals.length && !group.children) return null;

  const activeInGroup = vals.filter((v) => selected[group.key]?.includes(v)).length;

  return (
    <div
      className={
        depth > 0
          ? "ml-3 border-l border-border-subtle pl-3"
          : depth === 0
          ? "border-b border-border-subtle pb-3 last:border-b-0 last:pb-0"
          : ""
      }
    >
      <button
        type="button"
        onClick={() => setOpen(group.key, !isOpen)}
        className="group flex w-full items-center justify-between py-2.5 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
          {group.label}
          {activeInGroup > 0 && (
            <motion.span
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary"
            >
              {activeInGroup}
            </motion.span>
          )}
        </span>
        {group.children && (
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="flex text-text-muted transition-colors group-hover:text-primary"
          >
            <ChevronDown size={14} />
          </motion.span>
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="space-y-0.5 pb-3">
              {vals.map((v, i) => {
                const checked = !!selected[group.key]?.includes(v);
                const label = valueLabels[group.key]?.[v] ?? v;
                const count = counts[group.key][v];
                return (
                  <motion.label
                    key={v}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: i * 0.02,
                      ease: easeOut,
                    }}
                    className={`group/row flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors ${
                      checked
                        ? "bg-primary/5 text-text-primary"
                        : "text-text-secondary hover:bg-background-secondary hover:text-text-primary"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(group.key, v)}
                      className="peer sr-only"
                    />
                    <AnimatedCheckbox checked={checked} />
                    <span className="flex-1 truncate">{label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium tabular-nums transition-colors ${
                        checked
                          ? "bg-primary/15 text-primary"
                          : "bg-background-secondary text-text-muted group-hover/row:bg-border-subtle"
                      }`}
                    >
                      {count}
                    </span>
                  </motion.label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {group.children?.map((child: any) => (
        <FilterNode
          key={child.key}
          group={child}
          depth={depth + 1}
          selected={selected}
          onToggle={onToggle}
          openMap={openMap}
          setOpen={setOpen}
        />
      ))}
    </div>
  );
}

/* ---------------------------- Sidebar --------------------------- */
export default function ProductFilterSidebar({
  selected,
  onToggle,
  onClearAll,
}: Props) {
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const setOpen = (k: string, v: boolean) =>
    setOpenMap((m) => ({ ...m, [k]: v }));

  const totalActive = useMemo(
    () => Object.values(selected).reduce((sum, arr) => sum + arr.length, 0),
    [selected]
  );

  return (
    <aside className="sticky top-24 h-fit w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOut }}
        className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
              <SlidersHorizontal size={14} />
            </span>
            <h2 className="text-sm font-semibold tracking-tight text-text-primary">
              Filters
            </h2>
            {totalActive > 0 && (
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-semibold text-white"
              >
                {totalActive}
              </motion.span>
            )}
          </div>

          <AnimatePresence>
            {totalActive > 0 && (
              <motion.button
                type="button"
                onClick={onClearAll}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-error"
              >
                <RotateCcw size={11} />
                Reset
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Filter tree */}
        <div className="px-5 py-3">
          {FilterProduct.map((g) => (
            <FilterNode
              key={g.key}
              group={g}
              depth={0}
              selected={selected}
              onToggle={onToggle}
              openMap={openMap}
              setOpen={setOpen}
            />
          ))}
        </div>
      </motion.div>

      {/* Active pill summary (below the card, optional) */}
      <AnimatePresence>
        {totalActive > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="mt-3 flex flex-wrap gap-1.5 px-1"
          >
            {Object.entries(selected).flatMap(([k, vs]) =>
              vs.map((v) => (
                <button
                  key={`${k}-${v}`}
                  onClick={() => onToggle(k, v)}
                  className="group inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] font-medium text-text-secondary transition-colors hover:border-error/40 hover:text-error"
                >
                  {valueLabels[k]?.[v] ?? v}
                  <X
                    size={10}
                    className="text-text-muted transition-colors group-hover:text-error"
                  />
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}