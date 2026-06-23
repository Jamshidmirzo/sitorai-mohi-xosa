"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type NarrativeCtx = {
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  narrativeRef: React.RefObject<HTMLDivElement | null>;
  navRef: React.RefObject<HTMLDivElement | null>;
  progressRef: React.RefObject<HTMLDivElement | null>;
  scrollTo: (id: string) => void;
  reduced: boolean;
  night: boolean;
  setNight: (v: boolean) => void;
  lang: "UZ" | "RU" | "EN";
  setLang: (v: "UZ" | "RU" | "EN") => void;
};

const Ctx = createContext<NarrativeCtx | null>(null);

export function useNarrative() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNarrative must be used inside <NarrativeRoot>");
  return ctx;
}

export function NarrativeRoot({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  const [night, setNight] = useState(false);
  const [lang, setLang] = useState<"UZ" | "RU" | "EN">("EN");

  // Detect reduced motion
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    m.addEventListener("change", handler);
    return () => m.removeEventListener("change", handler);
  }, []);

  // Reveal + parallax + progress + nav-solidify on a single rAF scroll handler
  useEffect(() => {
    const scroller = scrollerRef.current;
    const root = narrativeRef.current;
    if (!scroller || !root) return;

    // Reveal-on-scroll observer
    const revealEls = Array.from(
      root.querySelectorAll<HTMLElement>(".wreveal, .wclip"),
    );
    let io: IntersectionObserver | null = null;
    if (reduced) {
      revealEls.forEach((el) => el.classList.add("in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io?.unobserve(e.target);
            }
          });
        },
        { root: scroller, threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
      );
      revealEls.forEach((el) => io!.observe(el));
    }

    const parallaxEls = Array.from(
      root.querySelectorAll<HTMLElement>("[data-parallax]"),
    );

    let rafId: number | null = null;
    const tick = () => {
      rafId = null;
      const r = scroller.getBoundingClientRect();
      const mid = r.top + r.height / 2;
      if (!reduced) {
        for (const el of parallaxEls) {
          const sp = parseFloat(el.dataset.speed || "0");
          const er = el.getBoundingClientRect();
          const c = er.top + er.height / 2;
          el.style.transform =
            "translate3d(0," + (-(c - mid) * sp).toFixed(1) + "px,0)";
        }
      }
      const max = scroller.scrollHeight - scroller.clientHeight;
      const p = max > 0 ? scroller.scrollTop / max : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
      }
      const nav = navRef.current;
      if (nav) {
        if (scroller.scrollTop > 560) {
          nav.style.background = "rgba(8,11,24,.78)";
          nav.style.backdropFilter = "blur(14px)";
          (nav.style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter =
            "blur(14px)";
          nav.style.borderBottomColor = "rgba(216,185,120,.18)";
        } else {
          nav.style.background = "transparent";
          nav.style.backdropFilter = "none";
          (nav.style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter =
            "none";
          nav.style.borderBottomColor = "transparent";
        }
      }
    };
    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(tick);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    tick();

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
      io?.disconnect();
    };
  }, [reduced]);

  const scrollTo = useCallback(
    (id: string) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const el = scroller.querySelector<HTMLElement>(`#${id}`);
      if (!el) return;
      const top =
        el.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop;
      scroller.scrollTo({
        top,
        behavior: reduced ? "auto" : "smooth",
      });
    },
    [reduced],
  );

  const value = useMemo<NarrativeCtx>(
    () => ({
      scrollerRef,
      narrativeRef,
      navRef,
      progressRef,
      scrollTo,
      reduced,
      night,
      setNight,
      lang,
      setLang,
    }),
    [scrollTo, reduced, night, lang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function NarrativeScroller({ children }: { children: ReactNode }) {
  const { scrollerRef, narrativeRef, progressRef, night } = useNarrative();
  return (
    <div
      ref={scrollerRef}
      className="smx"
      style={{
        position: "relative",
        height: "100vh",
        overflowY: "auto",
        overflowX: "hidden",
        background: "var(--mid)",
      }}
    >
      <div
        ref={progressRef}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          right: 0,
          height: 2,
          transformOrigin: "left",
          transform: "scaleX(0)",
          background:
            "linear-gradient(90deg, rgba(216,185,120,0), #D8B978 50%, rgba(216,185,120,0))",
          zIndex: 100,
          pointerEvents: "none",
        }}
      />
      <div
        ref={narrativeRef}
        className={`wnarr${night ? " night" : ""}`}
        style={{ position: "relative" }}
      >
        {children}
      </div>
    </div>
  );
}
