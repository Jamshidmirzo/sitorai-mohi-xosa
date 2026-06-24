"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type MuseumKey = "salomxona" | "xonai-xasht" | "harem";

const MUSEUMS: { key: MuseumKey; hero: string; count: number }[] = [
  { key: "salomxona", hero: "/uploads/gallery/salomxona/salomxona-04.jpg", count: 15 },
  { key: "xonai-xasht", hero: "/uploads/gallery/xonai-xasht/xonai-xasht-01.jpg", count: 6 },
  { key: "harem", hero: "/uploads/gallery/harem/harem-07.jpg", count: 9 },
];

export function Museums() {
  const t = useTranslations("narrative.museums");
  const locale = useLocale();

  return (
    <section
      id="museums"
      style={{
        position: "relative",
        padding: "120px 80px",
        background: "var(--mid)",
        color: "rgba(247,238,222,.92)",
      }}
      className="wmuseums"
    >
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div
          className="wreveal"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginBottom: 64,
            maxWidth: 720,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "rgba(216,185,120,.78)",
            }}
          >
            {t("eyebrow")}
          </span>
          <h2
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.05,
              margin: 0,
              color: "#F7EEDE",
            }}
          >
            {t("title")}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body), sans-serif",
              fontSize: 17,
              lineHeight: 1.6,
              color: "rgba(247,238,222,.72)",
              margin: 0,
            }}
          >
            {t("intro")}
          </p>
        </div>

        <div className="wmuseum-grid">
          {MUSEUMS.map((m) => (
            <Link
              key={m.key}
              href={`/gallery?category=${m.key}`}
              className="wmuseum-card wreveal"
              locale={locale}
            >
              <div className="wmuseum-img-wrap">
                <Image
                  src={m.hero}
                  alt={t(`${m.key}.name`)}
                  width={1000}
                  height={1333}
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="wmuseum-img"
                  loading="lazy"
                />
                <div className="wmuseum-img-overlay" />
                <span className="wmuseum-count">
                  {m.count} {t("photos")}
                </span>
              </div>
              <div className="wmuseum-body">
                <span className="wmuseum-subtitle">{t(`${m.key}.subtitle`)}</span>
                <h3 className="wmuseum-name">{t(`${m.key}.name`)}</h3>
                <p className="wmuseum-desc">{t(`${m.key}.desc`)}</p>
                <span className="wmuseum-cta">{t("cta")} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        .wmuseum-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .wmuseum-card {
          display: flex;
          flex-direction: column;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(216, 185, 120, 0.18);
          border-radius: 16px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          transition: transform 0.4s ease, border-color 0.4s ease,
            background 0.4s ease;
        }
        .wmuseum-card:hover {
          transform: translateY(-4px);
          border-color: rgba(216, 185, 120, 0.45);
          background: rgba(255, 255, 255, 0.05);
        }
        .wmuseum-img-wrap {
          position: relative;
          aspect-ratio: 4 / 3;
          overflow: hidden;
        }
        .wmuseum-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .wmuseum-card:hover .wmuseum-img {
          transform: scale(1.05);
        }
        .wmuseum-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(8, 11, 24, 0.65) 0%,
            transparent 50%
          );
        }
        .wmuseum-count {
          position: absolute;
          top: 14px;
          right: 14px;
          padding: 5px 12px;
          border-radius: 20px;
          background: rgba(8, 11, 24, 0.7);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          color: #f3ecdd;
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
        }
        .wmuseum-body {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 24px;
        }
        .wmuseum-subtitle {
          font-family: var(--font-mono), monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(216, 185, 120, 0.72);
        }
        .wmuseum-name {
          margin: 0;
          font-family: var(--font-display), serif;
          font-size: 28px;
          color: #f7eede;
        }
        .wmuseum-desc {
          margin: 0;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(247, 238, 222, 0.66);
        }
        .wmuseum-cta {
          margin-top: 6px;
          font-family: var(--font-body), sans-serif;
          font-size: 14px;
          color: #d8b978;
        }
        @media (max-width: 1024px) {
          .wmuseum-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .wmuseum-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}
