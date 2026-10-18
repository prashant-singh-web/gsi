"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Phone, Sun, Moon } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Company", href: "/company" },
  { label: "Clients", href: "/clients" },
];

const easeOut = [0.16, 1, 0.3, 1] as const;

/* ------------------------------------------------------------------ */
/* Theme toggle                                                        */
/* ------------------------------------------------------------------ */
function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (typeof window !== "undefined"
      ? (localStorage.getItem("theme") as "light" | "dark" | null)
      : null);
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial: "light" | "dark" = stored ?? (prefersDark ? "dark" : "light");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  };

  return { theme, toggle, mounted };
}

function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-primary/40"
    >
      {/* Soft ambient glow behind the icon */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/0 to-primary-light/0 transition-colors duration-500 group-hover:from-primary/10 group-hover:to-primary-light/10" />

      {mounted ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3, ease: easeOut }}
            className="relative flex"
          >
            {isDark ? (
              <Moon size={17} className="text-primary-light" />
            ) : (
              <Sun size={17} className="text-primary" />
            )}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="flex h-[17px] w-[17px]" />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* NavLink                                                             */
/* ------------------------------------------------------------------ */
function NavLink({
  href,
  label,
  isActive,
  onHoverStart,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  onHoverStart?: () => void;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -10, filter: "blur(6px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.5, ease: easeOut },
        },
      }}
      onMouseEnter={onHoverStart}
      className="relative"
    >
      <Link
        href={href}
        className="relative z-10 inline-block px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-text-primary"
      >
        {label}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute inset-x-2 -bottom-0.5 h-px bg-primary"
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 12);
  });

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setIsMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Magnetic logo */
  const logoRef = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 250, damping: 18, mass: 0.4 });
  const smy = useSpring(my, { stiffness: 250, damping: 18, mass: 0.4 });
  const logoRotY = useTransform(smx, [-0.5, 0.5], [-12, 12]);
  const logoRotX = useTransform(smy, [-0.5, 0.5], [8, -8]);

  const handleLogoMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const r = logoRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLogoLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.header
      initial={{ y: -110, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: easeOut }}
      className="fixed top-0 z-50 w-full"
    >
      <motion.div
        animate={{
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--color-background) 82%, transparent)"
            : "color-mix(in srgb, var(--color-background) 0%, transparent)",
          borderColor: scrolled ? "var(--color-border)" : "transparent",
          boxShadow: scrolled
            ? "0 10px 40px -12px rgba(11,13,17,0.10)"
            : "0 0 0 rgba(0,0,0,0)",
          backdropFilter: scrolled ? "blur(16px)" : "blur(0px)",
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="border-b"
      >
        <motion.div
          animate={{
            paddingTop: scrolled ? 12 : 20,
            paddingBottom: scrolled ? 12 : 20,
          }}
          transition={{ duration: 0.4, ease: easeOut }}
          className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8"
        >
          {/* Logo */}
          <Link
            ref={logoRef}
            href="/"
            onMouseMove={handleLogoMove}
            onMouseLeave={handleLogoLeave}
            className="group flex shrink-0 items-center gap-2.5 [perspective:800px]"
          >
            <motion.span
              style={{
                rotateX: logoRotX,
                rotateY: logoRotY,
                transformStyle: "preserve-3d",
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary-dark shadow-glow-button"
            >
              <span className="text-sm font-bold text-white">G</span>
              <motion.span
                className="absolute inset-0 -z-10 rounded-lg bg-primary"
                animate={{ opacity: [0.5, 0, 0.5], scale: [1, 1.6, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="pointer-events-none absolute inset-0 -translate-x-full rounded-lg bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            </motion.span>
            <span className="text-lg font-semibold tracking-tight text-text-primary">
              GSI
            </span>
          </Link>

          {/* Center nav */}
          <motion.nav
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
            }}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative hidden items-center md:flex"
          >
            {hoveredIndex !== null && (
              <motion.span
                layoutId="nav-hover-pill"
                className="absolute inset-y-0 rounded-full bg-background-secondary"
                style={{
                  left: `calc(${(hoveredIndex * 100) / NAV_LINKS.length}% + 0px)`,
                  width: `calc(100% / ${NAV_LINKS.length})`,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}

            {NAV_LINKS.map((link, i) => (
              <NavLink
                key={link.href}
                {...link}
                isActive={activeIndex === i}
                onHoverStart={() => setHoveredIndex(i)}
              />
            ))}
          </motion.nav>

          {/* Right cluster: phone + toggle + CTA */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: easeOut }}
            className="hidden items-center gap-3 md:flex"
          >
            <a
              href="tel:+10000000000"
              className="group hidden items-center gap-2 text-sm font-medium text-text-secondary transition-colors hover:text-primary lg:flex"
            >
              <Phone size={14} className="transition-transform group-hover:-rotate-12" />
              +1 (000) 000-0000
            </a>

            <ThemeToggle />

            <motion.div whileHover="hover" initial="rest" animate="rest">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-glow-button"
              >
                <motion.span
                  className="absolute inset-0 bg-primary-hover"
                  variants={{ rest: { x: "-101%" }, hover: { x: "0%" } }}
                  transition={{ duration: 0.35, ease: easeOut }}
                />
                <motion.span
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  variants={{ rest: { x: "-100%" }, hover: { x: "100%" } }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
                <span className="relative">Get a Quote</span>
                <motion.span
                  className="relative flex"
                  variants={{ rest: { x: 0 }, hover: { x: 3 } }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <ArrowRight size={15} />
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Mobile cluster: toggle + menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface text-text-primary transition-colors hover:border-primary/40"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isMenuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.22, ease: easeOut }}
                  className="flex"
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 top-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            />

            <motion.div
              key="panel"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="relative z-50 overflow-hidden border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/[0.06] to-transparent" />

              <motion.nav
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                }}
                className="relative flex flex-col gap-1 px-6 pb-8 pt-6"
              >
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: -20, filter: "blur(8px)" },
                      visible: {
                        opacity: 1,
                        x: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.45, ease: easeOut },
                      },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-text-primary transition-colors hover:bg-background-secondary"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xs tabular-nums text-text-muted">
                          0{i + 1}
                        </span>
                        {link.label}
                      </span>
                      <ArrowRight
                        size={16}
                        className="text-text-muted transition-all group-hover:translate-x-1 group-hover:text-primary"
                      />
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: easeOut },
                    },
                  }}
                  className="mt-4 flex flex-col gap-3"
                >
                  <Link
                    href="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-medium text-white shadow-glow-button transition-colors hover:bg-primary-hover"
                  >
                    Get a Quote
                    <ArrowRight size={15} />
                  </Link>

                  <a
                    href="tel:+10000000000"
                    className="flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 text-sm font-medium text-text-secondary transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Phone size={14} />
                    +1 (000) 000-0000
                  </a>
                </motion.div>
              </motion.nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}