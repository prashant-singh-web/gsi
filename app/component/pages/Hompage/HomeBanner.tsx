"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award, FlaskConical, Thermometer, Wind } from "lucide-react";
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";

const HEADLINE_LINES = [
  "Precision laboratory equipment,",
  "engineered to spec.",
];

const STATS = [
  { value: 15, suffix: "+", label: "Years manufacturing" },
  { value: 500, suffix: "+", label: "Installations" },
  { value: 30, suffix: "+", label: "Countries served" },
];

const FLOATING_ICONS = [
  { Icon: FlaskConical, top: "18%", left: "12%", delay: 0 },
  { Icon: Thermometer, top: "70%", left: "8%", delay: 1.2 },
  { Icon: Wind, top: "24%", left: "85%", delay: 0.6 },
  { Icon: Award, top: "76%", left: "88%", delay: 1.8 },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

const line = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay: 0.3 + i * 0.12, ease: easeOut },
  }),
};

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export default function HomeBanner() {
  const glowControls = useAnimation();
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse position tracked as motion values for the spotlight mask
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 40, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 40, mass: 0.6 });

  // The spotlight radius — a soft-edged circle mask centered on cursor
  const maskImage = useTransform(
    [smoothX, smoothY],
    ([x, y]) =>
      `radial-gradient(circle 220px at ${x}px ${y}px, black 0%, black 55%, transparent 100%)`
  );

  // Subtle parallax on the grid based on cursor
  const gridX = useTransform(smoothX, (v) => v * 0.008);
  const gridY = useTransform(smoothY, (v) => v * 0.008);

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
      className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-hero-dark"
    >
      {/* Base ambient glow */}
      <motion.div
        animate={glowControls}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[140px]"
      />

      {/* Engineering grid — base faint layer */}
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

      {/* Spotlight mask layer — grid is brighter INSIDE the cursor radius only */}
      <motion.div
        style={{
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
          x: gridX,
          y: gridY,
        }}
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
        {/* Glow dot right at cursor */}
        <div
          className="absolute h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: 0,
            top: 0,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, rgba(59,130,217,0.22) 0%, transparent 70%)",
            // position follows the same spring
            x: smoothX,
            y: smoothY,
          } as unknown as React.CSSProperties}
        />
      </motion.div>

      {/* Floating decorative icons */}
      {FLOATING_ICONS.map(({ Icon, top, left, delay }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{
            opacity: [0, 0.5, 0.3, 0.5],
            scale: 1,
            y: [0, -14, 0],
          }}
          transition={{
            opacity: { duration: 3, delay, repeat: Infinity, repeatType: "reverse" },
            scale: { duration: 0.8, delay: 0.8 + i * 0.15, ease: easeOut },
            y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut", delay },
          }}
          style={{ top, left }}
          className="pointer-events-none absolute hidden text-primary-light/40 lg:block"
        >
          <Icon size={28} strokeWidth={1.2} />
        </motion.div>
      ))}

      {/* Center content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center lg:px-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-text-secondary backdrop-blur-sm"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex"
          >
            <ShieldCheck size={15} className="text-primary-light" />
          </motion.span>
          ISO 9001:2015 certified manufacturing
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-light opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary-light" />
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="mt-8 text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-6xl xl:text-7xl">
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
                <span className="bg-gradient-to-r from-primary-light via-white to-primary-light bg-clip-text text-transparent">
                  {text}
                </span>
              ) : (
                text
              )}
            </motion.span>
          ))}
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.7, ease: easeOut }}
          className="mt-7 max-w-2xl text-base text-text-secondary sm:text-lg"
        >
          Autoclaves, incubators, and climate chambers built to hold
          tolerance under continuous use — designed, tested, and
          supported by our own engineering team.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: easeOut }}
          className="mt-11 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover="hover" initial="rest" animate="rest">
            <Link
              href="/products"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-primary px-7 py-3.5 text-sm font-medium text-white shadow-glow-button"
            >
              <motion.span
                className="absolute inset-0 bg-primary-hover"
                variants={{ rest: { x: "-100%" }, hover: { x: "0%" } }}
                transition={{ duration: 0.35, ease: easeOut }}
              />
              <span className="relative">Explore the range</span>
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
                className="absolute inset-0 bg-white/5"
                variants={{ rest: { scale: 0, opacity: 0 }, hover: { scale: 1, opacity: 1 } }}
                transition={{ duration: 0.35, ease: easeOut }}
              />
              <span className="relative">Request a quote</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.dl
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1, ease: easeOut }}
          className="mt-20 grid w-full max-w-2xl grid-cols-3 gap-6 border-t border-white/10 pt-10"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 + i * 0.12, ease: easeOut }}
              className="text-center"
            >
              <dt className="text-2xl font-semibold text-text-primary sm:text-3xl lg:text-4xl">
                <Counter value={stat.value} suffix={stat.suffix} />
              </dt>
              <dd className="mt-2 text-xs text-text-muted sm:text-sm">{stat.label}</dd>
            </motion.div>
          ))}
        </motion.dl>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
      >
        <span className="text-[11px] uppercase tracking-widest text-text-muted">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px bg-gradient-to-b from-primary-light via-text-muted to-transparent"
        />
      </motion.div>
    </section>
  );
}