"use client";

import { useTranslations } from "next-intl";
import { useIsMobile } from "./use-mobile";

const PORTRAIT_PHOTO =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Alim%20Khan%20(1880%E2%80%931944),%20Emir%20of%20Bukhara,%20photographed%20by%20S.M.%20Prokudin-Gorskiy%20in%201911.jpg?width=900";

export function Story() {
  const isMobile = useIsMobile();
  const t = useTranslations("narrative.story");
  const STATS = [
    { value: "1912", label: t("stats.begun") },
    { value: "30", label: t("stats.masters") },
    { value: "UNESCO", label: t("stats.listed") },
  ];
  return (
    <section
      id="story"
      data-light
      style={{
        position: "relative",
        background: "var(--cream)",
        padding: isMobile ? "72px 30px" : "120px 80px",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div
          className="wreveal"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: isMobile ? 28 : 40,
          }}
        >
          <span
            data-wrule
            style={{
              height: 1,
              width: 44,
              background: "rgba(185,140,70,.55)",
            }}
          />
          <span
            data-wsoft
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "var(--ink2)",
            }}
          >
            {t("eyebrow")}
          </span>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1.15fr .85fr",
            gap: isMobile ? 36 : 80,
            alignItems: "start",
          }}
        >
          <div>
            <h2
              className="wreveal"
              data-wink
              style={{
                fontFamily: "var(--font-display), serif",
                fontWeight: 500,
                fontSize: isMobile ? 34 : 54,
                lineHeight: 1.1,
                color: "var(--ink)",
                margin: 0,
              }}
            >
              {t("headLead")}{" "}
              <span style={{ fontStyle: "italic" }}>{t("headItalic")}</span>
            </h2>
            <p
              className="wreveal"
              data-wsoft
              style={{
                fontSize: isMobile ? 16 : 19,
                lineHeight: 1.7,
                color: "var(--ink2)",
                marginTop: isMobile ? 22 : 32,
                maxWidth: 560,
                textWrap: "pretty",
                transitionDelay: ".08s",
              }}
            >
              {t("p1")}
            </p>
            <p
              className="wreveal"
              data-wsoft
              style={{
                fontSize: isMobile ? 15 : 17,
                lineHeight: 1.74,
                color: "var(--ink2)",
                marginTop: isMobile ? 18 : 24,
                maxWidth: 560,
                textWrap: "pretty",
                transitionDelay: ".12s",
              }}
            >
              {t("p2")}
            </p>
            <div
              className="wreveal"
              style={{
                display: "flex",
                marginTop: isMobile ? 36 : 48,
                borderTop: "1px solid rgba(185,140,70,.28)",
                borderBottom: "1px solid rgba(185,140,70,.28)",
                maxWidth: 560,
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    flex: 1,
                    padding: "24px 8px",
                    textAlign: "center",
                    borderRight:
                      i < STATS.length - 1
                        ? "1px solid rgba(185,140,70,.2)"
                        : undefined,
                  }}
                >
                  <div
                    data-wink
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: isMobile ? 28 : 34,
                      color: "var(--ink)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div
                    data-wsoft
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 10,
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "var(--ink2)",
                      marginTop: 8,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="wreveal"
            data-parallax
            data-speed="0.04"
            style={{ transitionDelay: ".1s" }}
          >
            <div
              style={{
                position: "relative",
                borderRadius: 4,
                overflow: "hidden",
                aspectRatio: "3/4",
                background: "linear-gradient(150deg,#e4d6bb,#c9b489)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "repeating-linear-gradient(128deg,rgba(120,90,40,.14) 0 2px,transparent 2px 14px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url('${PORTRAIT_PHOTO}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "50% 22%",
                  animation: "imgfade 1.8s ease both",
                }}
              />
            </div>
            <p
              style={{
                fontFamily: "var(--font-display), serif",
                fontStyle: "italic",
                fontSize: isMobile ? 16 : 18,
                lineHeight: 1.5,
                color: "var(--ink)",
                marginTop: 20,
                opacity: 0.78,
              }}
            >
              {t("caption")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
