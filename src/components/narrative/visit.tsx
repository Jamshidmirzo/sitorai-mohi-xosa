"use client";

import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Crescent } from "./crescent";
import { useIsMobile } from "./use-mobile";
import { useNarrative } from "./narrative-root";

const VISIT_STARS = [
  { left: "16%", top: "12%", size: 2, delay: ".3s", color: "#fff" },
  { left: "74%", top: "9%", size: 3, delay: "1.2s", color: "#f4e9cf" },
  { left: "48%", top: "18%", size: 2, delay: "2.1s", color: "#fff" },
];

export function Visit() {
  const isMobile = useIsMobile();
  const { night, setNight } = useNarrative();
  const t = useTranslations("narrative.visit");
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale().toUpperCase() as "UZ" | "RU" | "EN";
  const LANGS: Array<"UZ" | "RU" | "EN"> = ["UZ", "RU", "EN"];
  const ROWS = [
    {
      label: t("hours"),
      primary: t("hoursValue"),
      secondary: t("hoursClosed"),
    },
    {
      label: t("place"),
      primary: t("placeValue"),
      secondary: t("placeCountry"),
    },
    {
      label: t("entry"),
      primary: t("entryValue"),
      secondary: t("entryAudio"),
    },
  ];

  return (
    <section
      id="visit"
      style={{
        position: "relative",
        background:
          "linear-gradient(180deg,var(--mid2) 0%,#0a1124 55%,#070a18 100%)",
        padding: isMobile ? "80px 30px 48px" : "110px 80px 64px",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {VISIT_STARS.map((st, i) => (
          <span
            key={i}
            className="wtwk"
            style={{
              position: "absolute",
              left: st.left,
              top: st.top,
              width: st.size,
              height: st.size,
              borderRadius: "50%",
              background: st.color,
              animationDelay: st.delay,
            }}
          />
        ))}
      </div>
      <div style={{ position: "relative", maxWidth: 1080, margin: "0 auto" }}>
        <div
          className="wreveal"
          style={{ textAlign: "center", marginBottom: isMobile ? 40 : 64 }}
        >
          <div style={{ display: "inline-flex", marginBottom: 22 }}>
            <Crescent />
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "rgba(216,185,120,.8)",
            }}
          >
            {t("eyebrow")}
          </div>
          <h2
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 500,
              fontStyle: "italic",
              fontSize: isMobile ? 36 : 56,
              lineHeight: 1.08,
              color: "#F3ECDD",
              marginTop: 18,
            }}
          >
            {t("title")}
          </h2>
        </div>

        <div
          className="wreveal"
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4,1fr)",
            gap: isMobile ? 24 : 48,
            borderTop: "1px solid rgba(216,185,120,.22)",
            paddingTop: isMobile ? 32 : 48,
          }}
        >
          {ROWS.map((r) => (
            <div key={r.label}>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#8c90a6",
                  marginBottom: 14,
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  fontSize: 16,
                  color: "#d8d3c6",
                  lineHeight: 1.6,
                }}
              >
                {r.primary}
                <br />
                <span style={{ color: "#8c90a6", fontSize: 14 }}>
                  {r.secondary}
                </span>
              </div>
            </div>
          ))}
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "#8c90a6",
                marginBottom: 14,
              }}
            >
              {t("language")}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {LANGS.map((L) => {
                const active = L === currentLocale;
                return (
                  <button
                    key={L}
                    onClick={() =>
                      router.replace(pathname, {
                        locale: L.toLowerCase() as "uz" | "ru" | "en",
                      })
                    }
                    style={{
                      padding: "8px 14px",
                      borderRadius: 3,
                      border: active
                        ? "1px solid #D8B978"
                        : "1px solid rgba(216,185,120,.28)",
                      background: active ? "#D8B978" : "transparent",
                      color: active ? "#221E17" : "#d8d3c6",
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 11,
                      letterSpacing: ".14em",
                      cursor: "pointer",
                    }}
                  >
                    {L}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 26 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#8c90a6",
                  marginBottom: 14,
                }}
              >
                {t("mood")}
              </div>
              <button
                onClick={() => setNight(!night)}
                aria-label="Day / Night toggle"
                style={{
                  position: "relative",
                  width: 58,
                  height: 28,
                  borderRadius: 20,
                  border: "1px solid rgba(216,185,120,.45)",
                  background: night
                    ? "rgba(11,17,36,.9)"
                    : "rgba(255,255,255,.04)",
                  cursor: "pointer",
                  padding: 0,
                  transition: "background .4s var(--ease-editorial)",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: night ? 34 : 3,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#D8B978",
                    transition: "left .4s var(--ease-editorial)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: isMobile ? 48 : 64,
            borderTop: "1px solid rgba(216,185,120,.18)",
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: 12,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: ".16em",
              color: "#6c7188",
              textTransform: "uppercase",
            }}
          >
            {t("colophon")}
          </div>
          <div style={{ fontSize: 12, color: "#6c7188" }}>
            © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </section>
  );
}
