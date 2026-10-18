"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Play,
  Thermometer,
  Gauge,
  Timer,
} from "lucide-react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from "framer-motion";
import { useInView } from "react-intersection-observer";

const HEADLINE_LINES = ["Sterilization you can", "validate, every cycle."];

const SPECS = [
  { label: "Chamber", value: "150 L", Icon: Gauge },
  { label: "Max temp", value: "134 °C", Icon: Thermometer },
  { label: "Cycle time", value: "18 min", Icon: Timer },
];

const FEATURES = [
  "Class B vacuum-assisted sterilization",
  "Dual independent over-temp cutoffs",
  "Built-in cycle printer & USB audit log",
];

const easeOut = [0.16, 1, 0.3, 1] as const;

const line = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay: 0.25 + i * 0.12, ease: easeOut },
  }),
};

function SpecChip({
  label,
  value,
  Icon,
  delay,
}: {
  label: string;
  value: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: easeOut }}
      className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-3 backdrop-blur-sm"
    >
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-text-muted">
        <Icon size={11} className="text-primary-light" />
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-text-primary tabular-nums">{value}</div>
    </motion.div>
  );
}

export default function ProductBanner() {
  const glowControls = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const [ref] = useInView({ triggerOnce: true, threshold: 0.3 });

  // cursor spotlight
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 40, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 40, mass: 0.6 });

  const maskImage = useTransform(
    [smoothX, smoothY],
    ([x, y]) =>
      `radial-gradient(circle 240px at ${x}px ${y}px, black 0%, black 55%, transparent 100%)`
  );

  const gridX = useTransform(smoothX, (v) => v * 0.008);
  const gridY = useTransform(smoothY, (v) => v * 0.008);

  // image parallax on scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  useEffect(() => {
    glowControls.start({
      opacity: [0.4, 0.85, 0.4],
      scale: [1, 1.1, 1],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    });
  }, [glowControls]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };
  const handleMouseLeave = () => {
    mouseX.set(-1000);
    mouseY.set(-1000);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="dark relative flex min-h-[88vh] items-center overflow-hidden bg-gradient-hero-dark"
    >
      {/* Ambient glow */}
      <motion.div
        animate={glowControls}
        className="pointer-events-none absolute left-[60%] top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[140px]"
      />

      {/* Base faint grid */}
      <motion.div
        style={{ x: gridX, y: gridY }}
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
      >
        <div
          className="absolute inset-[-40px]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </motion.div>

      {/* Spotlight mask grid */}
      <motion.div
        style={{ WebkitMaskImage: maskImage, maskImage, x: gridX, y: gridY }}
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
      >
        <div
          className="absolute inset-[-40px]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(111,160,219,0.6) 1px, transparent 1px), linear-gradient(to bottom, rgba(111,160,219,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </motion.div>

      {/* ===== Split content ===== */}
      <div
        ref={ref}
        className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-8 lg:px-8"
      >
        {/* LEFT — copy */}
        <div className="flex flex-col items-start text-left">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: easeOut }}
            className="inline-flex items-center gap-2 rounded-full border border-primary-light/20 bg-white/5 px-4 py-2 text-sm text-text-secondary backdrop-blur-sm"
          >
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="flex"
            >
              <Sparkles size={15} className="text-primary-light" />
            </motion.span>
            New — Class B benchtop autoclaves
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-light" />
            </span>
          </motion.div>

          {/* Headline */}
          <h1 className="mt-7 text-4xl font-semibold leading-[1.08] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
            {HEADLINE_LINES.map((text, i) => (
              <motion.span
                key={text}
                custom={i}
                variants={line}
                initial="hidden"
                animate="visible"
                className="block"
              >
                {i === 1 ? (
                  <span className="bg-gradient-to-r from-primary-light via-[#DCE8F5] to-primary-light bg-clip-text text-transparent">
                    {text}
                  </span>
                ) : (
                  text
                )}
              </motion.span>
            ))}
          </h1>

          {/* Subhead */}
          <motion.p
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.65, ease: easeOut }}
            className="mt-6 max-w-xl text-base text-text-secondary sm:text-lg"
          >
            Vacuum-assisted steam sterilization engineered for wrapped
            instruments, hollow loads, and porous materials — with validated
            cycles and audit-ready logs on every run.
          </motion.p>

          {/* Feature bullets */}
          <ul className="mt-6 space-y-2.5">
            {FEATURES.map((f, i) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1, ease: easeOut }}
                className="flex items-center gap-2.5 text-sm text-text-secondary"
              >
                <CheckCircle2 size={16} className="shrink-0 text-primary-light" />
                {f}
              </motion.li>
            ))}
          </ul>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: easeOut }}
            className="mt-9 flex flex-wrap items-center gap-5"
          >
            <motion.div whileHover="hover" initial="rest" animate="rest">
              <Link
                href="/products"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-primary-light/30 bg-primary px-7 py-3.5 text-sm font-medium text-white shadow-glow-button"
              >
                <motion.span
                  className="absolute inset-0 bg-primary-hover"
                  variants={{ rest: { x: "-100%" }, hover: { x: "0%" } }}
                  transition={{ duration: 0.35, ease: easeOut }}
                />
                <span className="relative">Explore autoclaves</span>
                <motion.span
                  className="relative flex"
                  variants={{ rest: { x: 0 }, hover: { x: 4 } }}
                  transition={{ duration: 0.25 }}
                >
                  <ArrowRight size={16} />
                </motion.span>
              </Link>
            </motion.div>

            <motion.div whileHover="hover" initial="rest" animate="rest">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-white/15 px-7 py-3.5 text-sm font-medium text-text-primary"
              >
                <motion.span
                  className="absolute inset-0 bg-white/10"
                  variants={{ rest: { scale: 0, opacity: 0 }, hover: { scale: 1, opacity: 1 } }}
                  transition={{ duration: 0.35, ease: easeOut }}
                />
                <Play size={14} className="relative" />
                <span className="relative">Watch a cycle</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Spec chips */}
          <div className="mt-9 grid w-full max-w-md grid-cols-3 gap-3">
            {SPECS.map((s, i) => (
              <SpecChip key={s.label} {...s} delay={1.15 + i * 0.1} />
            ))}
          </div>
        </div>

        {/* RIGHT — image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease: easeOut }}
          className="relative mx-auto w-full max-w-lg lg:max-w-none"
          style={{ perspective: 1200 }}
        >
          {/* Orbiting ring accents */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute inset-[-8%] rounded-full border border-dashed border-primary-light/10"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="pointer-events-none absolute inset-[2%] rounded-full border border-primary-light/[0.07]"
          />

          {/* Glow behind image */}
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute inset-0 rounded-3xl bg-primary/30 blur-[80px]"
          />

          {/* Image card */}
          <motion.div
            style={{ y: imageY }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-surface-elevated to-background shadow-card-elevated"
          >
            <motion.div style={{ scale: imageScale }}>
              <Image
                src="/assets/images/product/product-banner-image.webp"
                alt="Class B benchtop autoclave"
                width={900}
                height={900}
                priority
                className="h-auto w-full object-cover"
              />
      
            </motion.div>

            {/* Glass sheen sweep */}
            <motion.div
              initial={{ x: "-120%" }}
              animate={{ x: "220%" }}
              transition={{ duration: 3.2, delay: 1.4, ease: easeOut, repeat: Infinity, repeatDelay: 4 }}
              className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/10 to-transparent"
            />

            {/* Floating badge on image */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.3, ease: easeOut }}
              className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/10 bg-background/70 px-3 py-2 backdrop-blur-md"
            >
              <ShieldCheck size={15} className="text-primary-light" />
              <span className="text-xs font-medium text-text-primary">
                EN 13060 · Class B certified
              </span>
            </motion.div>
          </motion.div>

          {/* Corner ticks */}
          {[
            "left-0 top-0 border-l border-t",
            "right-0 top-0 border-r border-t",
            "left-0 bottom-0 border-l border-b",
            "right-0 bottom-0 border-r border-b",
          ].map((pos, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 + i * 0.08, duration: 0.4 }}
              className={`pointer-events-none absolute h-5 w-5 border-primary-light/40 ${pos}`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}