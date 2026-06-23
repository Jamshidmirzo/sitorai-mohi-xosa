"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useNarrative } from "./narrative-root";

const LANGS: Array<"uz" | "ru" | "en"> = ["uz", "ru", "en"];

export function TopNav() {
  const { navRef, scrollTo } = useNarrative();
  const t = useTranslations("narrative.nav");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const ITEMS = [
    { id: "story", label: t("story") },
    { id: "hall", label: t("hall") },
    { id: "exhibits", label: t("collection") },
    { id: "visit", label: t("visit") },
  ];
  const historyLabel = t("history");
  const mastersLabel = t("masters");
  const branchesLabel = t("branches");
  const sourcesLabel = t("sources");
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
          gap: 36,
        }}
      >
        {ITEMS.map((it) => (
          <a
            key={it.id}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(it.id);
            }}
            href={`#${it.id}`}
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 14,
              color: "rgba(247,238,222,.86)",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            {it.label}
          </a>
        ))}
        <Link
          href="/history"
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 14,
            color: "rgba(247,238,222,.86)",
            textDecoration: "none",
          }}
        >
          {historyLabel}
        </Link>
        <Link
          href="/masters"
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 14,
            color: "rgba(247,238,222,.86)",
            textDecoration: "none",
          }}
        >
          {mastersLabel}
        </Link>
        <Link
          href="/branches"
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 14,
            color: "rgba(247,238,222,.86)",
            textDecoration: "none",
          }}
        >
          {branchesLabel}
        </Link>
        <Link
          href="/sources"
          style={{
            fontFamily: "var(--font-body), sans-serif",
            fontSize: 14,
            color: "rgba(247,238,222,.86)",
            textDecoration: "none",
          }}
        >
          {sourcesLabel}
        </Link>
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
    </div>
  );
}
