"use client";

import { useTranslations } from "next-intl";
import { useIsMobile } from "./use-mobile";

const WHITE_HALL_PHOTO =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Harem%20of%20Sitorai%20Mokhi-Khosa%20Palace%2001.jpg?width=1600";

const STARS = [
  { left: "12%", top: "16%", size: 2, delay: ".2s", color: "#f4e9cf" },
  { left: "84%", top: "12%", size: 3, delay: "1.1s", color: "#fff" },
  { left: "66%", top: "26%", size: 2, delay: ".6s", color: "#f4e9cf" },
  { left: "24%", top: "30%", size: 2, delay: "1.8s", color: "#fff" },
  { left: "50%", top: "10%", size: 2, delay: "2.3s", color: "#fff" },
];

export function WhiteHall() {
  const isMobile = useIsMobile();
  const t = useTranslations("narrative.hall");
  return (
    <section
      id="hall"
      style={{
        position: "relative",
        background:
          "linear-gradient(180deg,var(--cream) 0%,#23263a 7%,var(--mid) 20%,var(--mid2) 100%)",
        padding: isMobile ? "0 0 90px" : "0 0 130px",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {STARS.map((st, i) => (
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
      <div
        style={{
          position: "relative",
          maxWidth: 1080,
          margin: "0 auto",
          padding: isMobile ? "80px 30px 0" : "110px 80px 0",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : ".82fr 1.18fr",
            gap: isMobile ? 36 : 64,
            alignItems: "center",
          }}
        >
          <div>
            <div
              className="wreveal"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 28,
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
                fontSize: isMobile ? 36 : 60,
                lineHeight: 1.04,
                color: "#F3ECDD",
                margin: 0,
              }}
            >
              {t("title1")}
              <br />
              {t("title2")}
            </h2>
            <p
              className="wreveal"
              style={{
                fontSize: isMobile ? 16 : 18,
                lineHeight: 1.74,
                color: "#b9bccb",
                marginTop: isMobile ? 22 : 28,
                textWrap: "pretty",
                transitionDelay: ".08s",
              }}
            >
              {t("body")}
            </p>
            <p
              className="wreveal"
              style={{
                fontFamily: "var(--font-display), serif",
                fontStyle: "italic",
                fontSize: isMobile ? 17 : 20,
                lineHeight: 1.5,
                color: "#d8c79c",
                marginTop: isMobile ? 24 : 30,
                transitionDelay: ".12s",
              }}
            >
              {t("credit")}
            </p>
            <div
              className="wreveal"
              style={{
                display: "flex",
                gap: 16,
                marginTop: isMobile ? 28 : 36,
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: "22px 20px",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(216,185,120,.18)",
                  borderRadius: 3,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: isMobile ? 24 : 30,
                    color: "#F3ECDD",
                  }}
                >
                  {t("stat1Value")}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "#8c90a6",
                    marginTop: 7,
                  }}
                >
                  {t("stat1Label")}
                </div>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "22px 20px",
                  background: "rgba(255,255,255,.04)",
                  border: "1px solid rgba(216,185,120,.18)",
                  borderRadius: 3,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: isMobile ? 24 : 30,
                    color: "#F3ECDD",
                  }}
                >
                  {t("stat2Value")}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 10,
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "#8c90a6",
                    marginTop: 7,
                  }}
                >
                  {t("stat2Label")}
                </div>
              </div>
            </div>
          </div>
          <div
            className="wclip"
            style={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              aspectRatio: "4/3",
              background:
                "linear-gradient(155deg,#e9e6df 0%,#cfd2dd 48%,#aeb4c6 100%)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(135deg,rgba(60,70,110,.10) 0 2px,transparent 2px 13px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(45deg,rgba(60,70,110,.07) 0 2px,transparent 2px 13px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url('${WHITE_HALL_PHOTO}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                animation: "imgfade 1.8s ease both",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
