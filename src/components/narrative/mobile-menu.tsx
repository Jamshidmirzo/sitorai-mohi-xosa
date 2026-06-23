"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useNarrative } from "./narrative-root";
import { useIsMobile } from "./use-mobile";
import { Crescent } from "./crescent";

const MOBILE_LANGS: Array<"uz" | "ru" | "en"> = ["uz", "ru", "en"];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const { scrollTo } = useNarrative();
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

  if (!isMobile) return null;

  return (
    <>
      {/* Top bar — replaces TopNav on mobile */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          zIndex: 95,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 18px",
          background: "rgba(7,10,24,.55)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(216,185,120,.14)",
        }}
      >
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          style={{
            width: 32,
            height: 32,
            border: 0,
            background: "transparent",
            cursor: "pointer",
            display: "inline-flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 5,
            padding: 0,
          }}
        >
          <span style={{ height: 1, background: "#F3ECDD", width: 20 }} />
          <span style={{ height: 1, background: "#F3ECDD", width: 20 }} />
        </button>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 12,
            letterSpacing: ".28em",
            color: "#F3ECDD",
          }}
        >
          {t("mobileWordmark")}
        </div>
        <div style={{ width: 32 }} />
      </div>

      {/* Floating bottom "Plan your visit" pill */}
      <button
        onClick={() => scrollTo("visit")}
        style={{
          position: "fixed",
          left: "50%",
          bottom: 22,
          transform: "translateX(-50%)",
          zIndex: 95,
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "12px 22px",
          borderRadius: 26,
          border: "1px solid rgba(216,185,120,.45)",
          background: "rgba(7,10,24,.78)",
          color: "#F3ECDD",
          fontFamily: "var(--font-body), sans-serif",
          fontSize: 13,
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          boxShadow: "0 12px 30px -10px rgba(0,0,0,.6)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#D8B978",
            boxShadow: "0 0 10px rgba(216,185,120,.7)",
          }}
        />
        {t("mobilePlanVisit")}
      </button>

      {/* Menu overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 110,
            background: "rgba(7,10,24,.88)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            display: "flex",
            flexDirection: "column",
            padding: "32px 28px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 12,
                letterSpacing: ".28em",
                color: "#F3ECDD",
              }}
            >
              {t("wordmark").toUpperCase()}
            </div>
            <button
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                border: "1px solid rgba(216,185,120,.4)",
                background: "transparent",
                color: "#F3ECDD",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
          <div style={{ marginTop: 64, display: "flex", flexDirection: "column" }}>
            {ITEMS.map((it, i) => (
              <button
                key={it.id}
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => scrollTo(it.id), 60);
                }}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 18,
                  padding: "22px 0",
                  borderBottom: "1px solid rgba(216,185,120,.18)",
                  background: "transparent",
                  border: 0,
                  borderTop: 0,
                  borderLeft: 0,
                  borderRight: 0,
                  color: "#F3ECDD",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 12,
                    color: "rgba(216,185,120,.8)",
                  }}
                >
                  0{i + 1}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontWeight: 500,
                    fontSize: 34,
                    lineHeight: 1.1,
                  }}
                >
                  {it.label}
                </span>
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
              paddingTop: 32,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                gap: 4,
                padding: "4px 6px",
                borderRadius: 24,
                border: "1px solid rgba(216,185,120,.28)",
                background: "rgba(255,255,255,.04)",
              }}
            >
              {MOBILE_LANGS.map((L) => {
                const active = L === currentLocale;
                return (
                  <button
                    key={L}
                    onClick={() => {
                      setOpen(false);
                      router.replace(pathname, { locale: L });
                    }}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 20,
                      border: 0,
                      background: active ? "#D8B978" : "transparent",
                      color: active ? "#221E17" : "rgba(247,238,222,.85)",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 12,
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontWeight: active ? 600 : 400,
                    }}
                  >
                    {L}
                  </button>
                );
              })}
            </div>
            <Crescent size={42} />
          </div>
        </div>
      )}
    </>
  );
}
