"use client";

import { motion } from "framer-motion";

const ROW_ONE = [
  "MedLife Diagnostics",
  "BioCore Labs",
  "Apex Pharma",
  "Vitalis Research",
  "NorthGen Biotech",
  "Sterling Analytics",
];

const ROW_TWO = [
  "Quantum Biosciences",
  "Helix Diagnostics",
  "Meridian Pharma",
  "CoreLab Systems",
  "Precision Genomics",
  "Alderon Research",
];

const easeOut = [0.16, 1, 0.3, 1] as const;

function MarqueeRow({
  items,
  direction = "left",
  speed = 34,
}: {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
}) {
  // Duplicate the list so the loop has no visible seam.
  const track = [...items, ...items];

  return (
    <div className="group relative overflow-hidden">
      <div
        className={`flex w-max gap-4 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        } group-hover:[animation-play-state:paused]`}
        style={{ animationDuration: `${speed}s` }}
      >
        {track.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex shrink-0 items-center gap-2.5 rounded-lg border border-border bg-surface px-6 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-elevated"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40 transition-colors group-hover:bg-primary/40" />
            <span className="whitespace-nowrap text-sm font-medium text-text-secondary transition-colors hover:text-primary">
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CustomerName() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <p className="text-sm font-medium text-primary">Trusted across the industry</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
          Relied on by laboratories and manufacturers worldwide
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: easeOut }}
        className="relative mt-14 flex flex-col gap-4"
      >
        {/* Edge fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <MarqueeRow items={ROW_ONE} direction="left" speed={32} />
        <MarqueeRow items={ROW_TWO} direction="right" speed={38} />
      </motion.div>

      <style jsx global>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-marquee-left {
          animation-name: marquee-left;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .animate-marquee-right {
          animation-name: marquee-right;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee-left,
          .animate-marquee-right {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}