"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ArrowUpRight, Package, Clock } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Product = {
  id: string;
  name: string;
  spec: string;
  badge: string;
  image: string;
  href: string;
};

const PRODUCTS: Product[] = [
  {
    id: "vertical-autoclave",
    name: "Vertical Autoclave",
    spec: "50L · 134°C · Class B",
    badge: "In Stock",
    image: "https://picsum.photos/seed/autoclave/1200/900",
    href: "/products/vertical-autoclave",
  },
  {
    id: "orbital-shaking-incubator",
    name: "Orbital Shaking Incubator",
    spec: "5–500 RPM · ±0.1°C",
    badge: "In Stock",
    image: "https://picsum.photos/seed/incubator/1200/900",
    href: "/products/orbital-shaking-incubator",
  },
  {
    id: "stability-chamber",
    name: "Stability Chamber",
    spec: "ICH Q1A compliant",
    badge: "Made to order",
    image: "https://picsum.photos/seed/chamber/1200/900",
    href: "/products/stability-chamber",
  },
  {
    id: "vacuum-oven",
    name: "Laboratory Vacuum Oven",
    spec: "Up to 250°C · Digital control",
    badge: "In Stock",
    image: "https://picsum.photos/seed/oven/1200/900",
    href: "/products/vacuum-oven",
  },
  {
    id: "laminar-airflow",
    name: "Laminar Airflow",
    spec: "HEPA H14 · Horizontal/Vertical",
    badge: "In Stock",
    image: "https://picsum.photos/seed/airflow/1200/900",
    href: "/products/laminar-airflow",
  },
  {
    id: "bod-incubator",
    name: "BOD Incubator",
    spec: "0–60°C · Microprocessor control",
    badge: "In Stock",
    image: "https://picsum.photos/seed/bod/1200/900",
    href: "/products/bod-incubator",
  },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

/* ---------------------------- Card ---------------------------- */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 220, damping: 28, mass: 0.5 });
  const smy = useSpring(my, { stiffness: 220, damping: 28, mass: 0.5 });
  const imgX = useTransform(smx, [-0.5, 0.5], [-14, 14]);
  const imgY = useTransform(smy, [-0.5, 0.5], [-10, 10]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const madeToOrder = product.badge.toLowerCase().includes("order");

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: easeOut }}
      className="group relative h-full w-full"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-primary/40 group-hover:shadow-card-elevated">
        {/* Image */}
        <div className="relative aspect-[16/11] overflow-hidden bg-background-secondary">
          <motion.div style={{ x: imgX, y: imgY }} className="absolute inset-[-18px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 86vw, (max-width: 1024px) 64vw, 42vw"
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
              unoptimized
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />

          <span
            className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur-md ${
              madeToOrder
                ? "border-warning/40 bg-warning/20 text-warning"
                : "border-white/25 bg-black/45 text-white"
            }`}
          >
            {madeToOrder ? <Clock size={11} /> : <Package size={11} />}
            {product.badge}
          </span>

          <p className="absolute bottom-4 left-4 text-sm font-medium text-white/90">
            {product.spec}
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-lg font-semibold tracking-tight text-text-primary lg:text-xl">
            {product.name}
          </h3>

          <Link
            href={product.href}
            className="group/link mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            View details
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/25 bg-primary/5 transition-all duration-300 group-hover/link:border-primary group-hover/link:bg-primary group-hover/link:text-white">
              <ArrowUpRight size={13} />
            </span>
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/* --------------------------- Slider --------------------------- */
export default function ProductSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    const card = cardRefs.current[index];
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  const prev = useCallback(() => {
    scrollTo(activeIndex === 0 ? PRODUCTS.length - 1 : activeIndex - 1);
  }, [activeIndex, scrollTo]);

  const next = useCallback(() => {
    scrollTo(activeIndex === PRODUCTS.length - 1 ? 0 : activeIndex + 1);
  }, [activeIndex, scrollTo]);

  // Latest handlers in refs so the keydown listener registers once
  const prevRef = useRef(prev);
  const nextRef = useRef(next);
  useEffect(() => {
    prevRef.current = prev;
    nextRef.current = next;
  }, [prev, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevRef.current();
      if (e.key === "ArrowRight") nextRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Active index
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const i = cardRefs.current.findIndex((el) => el === entry.target);
            if (i !== -1) setActiveIndex(i);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );
    cardRefs.current.forEach((c) => c && observer.observe(c));
    return () => observer.disconnect();
  }, []);

  const dots = useMemo(() => PRODUCTS.map((p) => p.id), []);

  return (
    <section className="relative bg-background py-24 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easeOut }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Product range
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-4xl">
              Equipment built for{" "}
              <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                continuous lab use
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous product"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface transition-all duration-300 hover:border-primary hover:shadow-glow-sm active:scale-95"
            >
              <ArrowLeft size={18} className="text-text-secondary transition-colors hover:text-primary" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next product"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface transition-all duration-300 hover:border-primary hover:shadow-glow-sm active:scale-95"
            >
              <ArrowRight size={18} className="text-text-secondary transition-colors hover:text-primary" />
            </button>
          </div>
        </motion.div>

        {/* Track */}
        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {PRODUCTS.map((product, index) => (
            <div
              key={product.id}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="w-[86%] shrink-0 snap-start sm:w-[64%] lg:w-[42%] xl:w-[38%]"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
          <div className="w-2 shrink-0" aria-hidden />
        </div>

        {/* Single morphing indicator */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {dots.map((id, index) => (
            <button
              key={id}
              type="button"
              onClick={() => scrollTo(index)}
              aria-label={`Go to ${PRODUCTS[index].name}`}
              aria-current={index === activeIndex}
              className="py-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${
                  index === activeIndex
                    ? "w-8 bg-primary shadow-glow-sm"
                    : "w-1.5 bg-border hover:bg-primary/40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}