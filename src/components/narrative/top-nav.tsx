"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useNarrative } from "./narrative-root";

const LANGS: Array<"uz" | "ru" | "en"> = ["uz", "ru", "en"];

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-body), sans-serif",
  fontSize: 14,
  color: "rgba(247,238,222,.86)",
  textDecoration: "none",
  cursor: "pointer",
};

export function TopNav() {
  const { navRef, scrollTo } = useNarrative();
  const t = useTranslations("narrative.nav");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const ANCHORS = [
    { id: "story", label: t("story") },
    { id: "hall", label: t("hall") },
    { id: "museums", label: t("museums") },
    { id: "exhibits", label: t("collection") },
    { id: "visit", label: t("visit") },
  ];
  const MORE_LINKS = [
    { href: "/history", label: t("history") },
    { href: "/masters", label: t("masters") },
    { href: "/branches", label: t("branches") },
    { href: "/sources", label: t("sources") },
    { href: "/glossary", label: t("glossary") },
  ];

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [moreOpen]);

  return (
    <div
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 72,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 80px",
        borderBottom: "1px solid transparent",
        transition:
          "background .5s ease, backdrop-filter .5s ease, border-color .5s ease",
        background: "transparent",
      }}
      className="wnav"
    >
      <button
        onClick={() => scrollTo("hero")}
        style={{
          background: "none",
          border: 0,
          color: "rgba(247,238,222,.92)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 12,
          letterSpacing: ".24em",
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {t("wordmark")}
      </button>

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        {ANCHORS.map((it) => (
          <a
            key={it.id}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(it.id);
            }}
            href={`#${it.id}`}
            style={linkStyle}
          >
            {it.label}
          </a>
        ))}

        <div ref={moreRef} style={{ position: "relative" }}>
          <button
            onClick={() => setMoreOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={moreOpen}
            style={{
              ...linkStyle,
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "none",
              border: 0,
              padding: 0,
            }}
          >
            {t("more")}
            <span
              style={{
                display: "inline-block",
                transform: moreOpen ? "rotate(180deg)" : "none",
                transition: "transform .2s ease",
                fontSize: 10,
              }}
            >
              ▾
            </span>
          </button>
          {moreOpen && (
            <div
              role="menu"
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                minWidth: 200,
                padding: 8,
                borderRadius: 12,
                background: "rgba(12,15,28,.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(216,185,120,.22)",
                boxShadow: "0 12px 32px rgba(0,0,0,.4)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {MORE_LINKS.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  role="menuitem"
                  onClick={() => setMoreOpen(false)}
                  style={{
                    ...linkStyle,
                    padding: "9px 12px",
                    borderRadius: 8,
                    transition: "background .2s ease",
                  }}
                  className="wnav-more-item"
                >
                  {it.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "4px 6px",
            borderRadius: 24,
            border: "1px solid rgba(216,185,120,.28)",
            background: "rgba(255,255,255,.04)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          {LANGS.map((L) => {
            const active = L === currentLocale;
            return (
              <button
                key={L}
                onClick={() => router.replace(pathname, { locale: L })}
                style={{
                  padding: "5px 10px",
                  borderRadius: 20,
                  border: 0,
                  background: active ? "#D8B978" : "transparent",
                  color: active ? "#221E17" : "rgba(247,238,222,.78)",
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontWeight: active ? 600 : 400,
                  transition: "all .25s ease",
                }}
              >
                {L}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollTo("visit")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 18px",
            borderRadius: 24,
            border: "1px solid rgba(216,185,120,.45)",
            background: "rgba(255,255,255,.04)",
            color: "#F3ECDD",
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 13,
            cursor: "pointer",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#D8B978",
              boxShadow: "0 0 12px rgba(216,185,120,.7)",
            }}
          />
          {t("visitPill")}
        </button>
      </nav>

      <style jsx>{`
        :global(.wnav-more-item:hover) {
          background: rgba(216, 185, 120, 0.12);
        }
      `}</style>
    </div>
  );
}
