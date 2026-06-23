"use client";

import { useTranslations } from "next-intl";
import { useIsMobile } from "./use-mobile";

const HERO_PHOTO =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Sitori-i-Mokhi%20Khosa%20palace%20harem%201.JPG?width=1600";

export function Hero() {
  const isMobile = useIsMobile();
  const t = useTranslations("narrative.hero");
  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: isMobile ? "100vh" : 768,
        minHeight: isMobile ? 600 : 768,
        overflow: "hidden",
        background: "#0c1226",
      }}
    >
      <div
        data-parallax
        data-speed={isMobile ? "0.28" : "0.22"}
        style={{
          position: "absolute",
          inset: "-8% 0",
          background:
            "linear-gradient(155deg,#caa56a 0%,#9c7338 28%,#54451f 58%,#171622 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${HERO_PHOTO}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            animation: "imgfade 1.8s ease both",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(120deg,rgba(255,248,232,.06) 0 2px,transparent 2px 16px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 70% at 50% 24%,rgba(255,233,190,.22),transparent 58%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom,rgba(8,10,22,.55) 0%,transparent 22%,transparent 55%,rgba(8,10,22,.82) 100%)",
        }}
      />

      <div
        data-parallax
        data-speed={isMobile ? "-0.06" : "-0.05"}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: isMobile ? 104 : 118,
          textAlign: "center",
          padding: "0 40px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: isMobile ? 11 : 12,
            letterSpacing: isMobile ? ".34em" : ".4em",
            textTransform: "uppercase",
            color: "rgba(247,238,222,.8)",
            marginBottom: isMobile ? 22 : 28,
          }}
        >
          {isMobile ? t("eyebrowMobile") : t("eyebrowWeb")}
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 500,
            color: "#FBF5E8",
            fontSize: isMobile ? 54 : 104,
            lineHeight: isMobile ? 0.96 : 0.92,
            letterSpacing: ".01em",
            textShadow: "0 4px 50px rgba(0,0,0,.4)",
            margin: 0,
          }}
        >
          {t("titlePrefix")}{" "}
          <span style={{ fontStyle: "italic", fontWeight: 400 }}>
            {t("titleItalic")}
          </span>
        </h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 12 : 18,
            marginTop: isMobile ? 22 : 30,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              height: 1,
              width: isMobile ? 40 : 60,
              background: "rgba(216,185,120,.7)",
            }}
          />
          <span
            style={{
              fontSize: isMobile ? 14 : 18,
              letterSpacing: ".04em",
              color: "rgba(247,238,222,.94)",
            }}
          >
            {t("subtitle")}
          </span>
          <span
            style={{
              height: 1,
              width: isMobile ? 40 : 60,
              background: "rgba(216,185,120,.7)",
            }}
          />
        </div>
      </div>

      <div
        className="wbob"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 42,
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: "rgba(247,238,222,.66)",
          }}
        >
          {t("scrollCue")}
        </span>
        <span
          style={{
            width: 1,
            height: 38,
            background:
              "linear-gradient(to bottom,rgba(216,185,120,.85),transparent)",
          }}
        />
      </div>
    </section>
  );
}
