"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Quote, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "The autoclaves have run continuous cycles for three years without a single validation failure. That reliability is why we standardised on them across all four of our labs.",
    name: "Dr. Ananya Rao",
    role: "Head of Microbiology",
    company: "Sunrise Diagnostics",
    avatar: "https://picsum.photos/seed/person1/200/200",
    rating: 5,
  },
  {
    id: "t2",
    quote:
      "Their engineering team sat with ours during specification. The stability chambers came pre-validated to ICH Q1A — we were running studies the week they were installed.",
    name: "Marcus Weber",
    role: "Director, Analytical Operations",
    company: "Helix Pharmaceuticals",
    avatar: "https://picsum.photos/seed/person2/200/200",
    rating: 5,
  },
  {
    id: "t3",
    quote:
      "Service response within 24 hours, every time. In a GMP environment that's not a luxury — it's the difference between a study and a deviation.",
    name: "Priya Menon",
    role: "QA Manager",
    company: "BioNova Labs",
    avatar: "https://picsum.photos/seed/person3/200/200",
    rating: 5,
  },
  {
    id: "t4",
    quote:
      "We compared five vendors. Only these incubators held ±0.1°C across a full 48-hour profile in our own validation. That's why they're on our standard list now.",
    name: "Dr. Yusuf Karim",
    role: "Research Lead",
    company: "Aster Life Sciences",
    avatar: "https://picsum.photos/seed/person4/200/200",
    rating: 5,
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;
const AUTOPLAY_MS = 6000;

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Mouse-follow glow inside the card */
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const smx = useSpring(mx, { stiffness: 120, damping: 20 });
  const smy = useSpring(my, { stiffness: 120, damping: 20 });
  const glowX = useTransform(smx, (v) => `${v}%`);
  const glowY = useTransform(smy, (v) => `${v}%`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);
    },
    [index]
  );

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  /* Autoplay — pauses on hover */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [next, paused, index]);

  /* Keyboard nav */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const active = TESTIMONIALS[index];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-background-secondary py-24 lg:py-32">
      {/* Ambient blobs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-32 top-1/4 h-[420px] w-[420px] rounded-full bg-primary/[0.08] blur-[120px]"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-32 bottom-1/4 h-[420px] w-[420px] rounded-full bg-primary-light/[0.06] blur-[120px]"
      />

      {/* Faint grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          color: "var(--color-text-primary)",
          maskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: easeOut }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: easeOut }}
            className="inline-flex items-center gap-2 rounded-full border border-badge-border bg-badge-bg px-3 py-1 text-xs font-medium text-badge-text"
          >
            <Star size={12} className="fill-primary text-primary" />
            4.9 average from 200+ labs
          </motion.span>

          <h2 className="mt-5 text-3xl font-semibold leading-[1.15] tracking-tight text-text-primary sm:text-4xl lg:text-5xl">
            Voices from the{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                bench
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-primary to-transparent"
              />
            </span>
          </h2>

          <p className="mt-5 text-sm text-text-secondary sm:text-base">
            Real feedback from the people who run our equipment every day.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
          className="relative mx-auto mt-16 max-w-4xl lg:mt-20"
        >
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 shadow-card-elevated sm:p-12 lg:p-16"
          >
            {/* Cursor spotlight */}
            <motion.div
              className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `radial-gradient(500px circle at ${glowX.get()} ${glowY.get()}, rgba(59,130,217,0.12), transparent 70%)`,
                backgroundImage: useTransform(
                  [glowX, glowY],
                  ([x, y]) =>
                    `radial-gradient(500px circle at ${x} ${y}, rgba(59,130,217,0.14), transparent 70%)`
                ),
              }}
            />

            {/* Big quote mark */}
            <motion.div
              animate={{ rotate: [0, 4, -4, 0], y: [0, -4, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 left-6 text-primary/10 sm:left-10"
            >
              <Quote size={110} strokeWidth={0.7} />
            </motion.div>

            {/* Quote + author, animated swap */}
            <div className="relative min-h-[220px] sm:min-h-[200px] lg:min-h-[180px]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active.id}
                  custom={direction}
                  initial={{
                    opacity: 0,
                    y: direction > 0 ? 32 : -32,
                    filter: "blur(10px)",
                  }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    y: direction > 0 ? -24 : 24,
                    filter: "blur(10px)",
                  }}
                  transition={{ duration: 0.55, ease: easeOut }}
                >
                  {/* Stars */}
                  <div className="flex items-center gap-1">
                    {Array.from({ length: active.rating }).map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.1 + i * 0.06,
                          ease: easeOut,
                        }}
                      >
                        <Star
                          size={16}
                          className="fill-primary text-primary"
                        />
                      </motion.span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="mt-6 text-lg leading-relaxed text-text-primary sm:text-xl lg:text-2xl">
                    “{active.quote}”
                  </p>

                  {/* Author */}
                  <div className="mt-8 flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0">
                      <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.15, 0.4] }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-primary/40 blur-md"
                      />
                      <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-primary/30">
                        <Image
                          src={active.avatar}
                          alt={active.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {active.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {active.role} · {active.company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between gap-6">
            {/* Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface transition-all duration-300 hover:border-primary hover:shadow-glow-sm active:scale-95"
              >
                <ArrowLeft
                  size={16}
                  className="text-text-secondary transition-all group-hover:-translate-x-0.5 group-hover:text-primary"
                />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="group flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface transition-all duration-300 hover:border-primary hover:shadow-glow-sm active:scale-95"
              >
                <ArrowRight
                  size={16}
                  className="text-text-secondary transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </button>
            </div>

            {/* Avatar dots */}
            <div className="flex items-center gap-3">
              {TESTIMONIALS.map((t, i) => {
                const isActive = i === index;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show testimonial from ${t.name}`}
                    aria-current={isActive}
                    className="group relative"
                  >
                    <motion.span
                      animate={{
                        scale: isActive ? 1 : 0.75,
                        opacity: isActive ? 1 : 0.55,
                      }}
                      transition={{ duration: 0.35, ease: easeOut }}
                      className={`block h-10 w-10 overflow-hidden rounded-full border-2 transition-colors duration-300 ${
                        isActive
                          ? "border-primary shadow-glow-sm"
                          : "border-border group-hover:border-primary/50"
                      }`}
                    >
                      <span className="relative block h-full w-full">
                        <Image
                          src={t.avatar}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      </span>
                    </motion.span>
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="hidden h-[3px] flex-1 overflow-hidden rounded-full bg-border sm:block">
              <motion.div
                key={`${index}-${paused}`}
                initial={{ width: "0%" }}
                animate={{ width: paused ? "30%" : "100%" }}
                transition={{
                  duration: paused ? 0.3 : AUTOPLAY_MS / 1000,
                  ease: paused ? easeOut : "linear",
                }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}