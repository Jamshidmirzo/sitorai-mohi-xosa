"use client";

import { useTranslations } from "next-intl";
import type { Exhibit } from "@/lib/narrative-types";
import { useIsMobile } from "./use-mobile";

export function Collection({
  onOpen,
  exhibits,
}: {
  onOpen: (index: number) => void;
  exhibits: Exhibit[];
}) {
  const isMobile = useIsMobile();
  const t = useTranslations("narrative.collection");
  const EXHIBITS = exhibits;
  return (
    <section
      id="exhibits"
      style={{
        position: "relative",
        background: "var(--mid2)",
        padding: isMobile ? "80px 0 90px" : "110px 0 120px",
      }}
    >
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          padding: isMobile ? "0 30px" : "0 80px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "flex-start" : "flex-end",
          gap: isMobile ? 18 : 0,
        }}
      >
        <div>
          <div
            className="wreveal"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                height: 1,
                width: 44,
                background: "rgba(216,185,120,.6)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 12,
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: "rgba(216,185,120,.85)",
              }}
            >
              {t("eyebrow")}
            </span>
          </div>
          <h2
            className="wreveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 500,
              fontSize: isMobile ? 33 : 54,
              lineHeight: 1.06,
              color: "#F3ECDD",
              margin: 0,
            }}
          >
            {t("title")}
          </h2>
        </div>
        <p
          className="wreveal"
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: "#9aa0b5",
            maxWidth: 260,
            textAlign: isMobile ? "left" : "right",
            margin: 0,
          }}
        >
          {isMobile ? t("helperMobile") : t("helperWeb")}
        </p>
      </div>

      <div
        className="smx wreveal"
        style={{
          display: "flex",
          gap: isMobile ? 16 : 24,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          padding: isMobile ? "32px 30px 16px" : "48px 80px 16px",
        }}
      >
        {EXHIBITS.map((ex, i) => (
          <button
            key={ex.name}
            className="excard"
            onClick={() => onOpen(i)}
            style={{
              flex: "none",
              width: isMobile ? 236 : 320,
              scrollSnapAlign: "start",
              cursor: "pointer",
              background: "transparent",
              border: 0,
              padding: 0,
              textAlign: "left",
            }}
          >
            <div
              style={{
                position: "relative",
                height: isMobile ? 300 : 420,
                borderRadius: 4,
                overflow: "hidden",
                background: ex.bg,
              }}
            >
              <div
                className="eximg"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: ex.bg,
                }}
              >
                {ex.image && (
                  <img
                    src={ex.image}
                    alt={ex.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: 0.78,
                      mixBlendMode: "luminosity",
                    }}
                  />
                )}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "repeating-linear-gradient(125deg,rgba(0,0,0,.16) 0 2px,transparent 2px 14px)",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  top: 18,
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 10,
                  letterSpacing: ".1em",
                  color: "rgba(255,255,255,.72)",
                  border: "1px solid rgba(255,255,255,.32)",
                  borderRadius: 2,
                  padding: "6px 9px",
                }}
              >
                {ex.tag}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "55%",
                  background:
                    "linear-gradient(to top,rgba(7,12,28,.88),transparent)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  right: 20,
                  bottom: 22,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: isMobile ? 21 : 26,
                    lineHeight: 1.12,
                    color: "#F3ECDD",
                  }}
                >
                  {ex.name}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 14,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 10,
                      letterSpacing: ".08em",
                      color: "rgba(216,185,120,.9)",
                    }}
                  >
                    {ex.period}
                  </span>
                  <span style={{ color: "var(--gold)", fontSize: 18 }}>→</span>
                </div>
              </div>
            </div>
          </button>
        ))}
        <div style={{ flex: "none", width: 40 }} />
      </div>
    </section>
  );
}
