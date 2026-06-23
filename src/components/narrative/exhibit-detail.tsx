"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Exhibit, QuizQuestion } from "@/lib/narrative-types";
import { useIsMobile } from "./use-mobile";
import { Quiz } from "./quiz";

export function ExhibitDetail({
  selected,
  onClose,
  onSelect,
  exhibits,
  quizByExhibit,
}: {
  selected: number;
  onClose: () => void;
  onSelect: (i: number) => void;
  exhibits: Exhibit[];
  quizByExhibit: Record<string, QuizQuestion[]>;
}) {
  const isMobile = useIsMobile();
  const [quizOpen, setQuizOpen] = useState(false);
  const t = useTranslations("narrative.detail");
  const EXHIBITS = exhibits;
  const ex = EXHIBITS[selected];
  if (!ex) return null;
  const quizQuestions = quizByExhibit[ex.id] ?? [];
  const hasQuiz = quizQuestions.length > 0;

  const nextPiece = () => {
    onSelect((selected + 1) % EXHIBITS.length);
    setQuizOpen(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "var(--mid2)",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
      }}
    >
      {/* Image pane */}
      <div
        style={{
          position: "relative",
          flex: isMobile ? "none" : "1 1 50%",
          height: isMobile ? 280 : "100%",
          background: ex.bg,
          overflow: "hidden",
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
              animation: "imgfade 1.4s ease both",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(125deg,rgba(0,0,0,.18) 0 2px,transparent 2px 14px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(7,12,28,.25) 0%, transparent 25%, transparent 65%, rgba(7,12,28,.5) 100%)",
            pointerEvents: "none",
          }}
        />
        <button
          onClick={onClose}
          aria-label={t("close")}
          style={{
            position: "absolute",
            top: isMobile ? 16 : 24,
            left: isMobile ? 16 : 24,
            width: 42,
            height: 42,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.3)",
            background: "rgba(7,12,28,.55)",
            color: "#F3ECDD",
            fontSize: 22,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          ‹
        </button>
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 16 : 32,
            left: isMobile ? 16 : 32,
            right: isMobile ? 16 : 32,
            color: "rgba(255,255,255,.5)",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: ".14em",
            textTransform: "uppercase",
          }}
        >
          {ex.shot}
        </div>
      </div>

      {/* Info / Quiz pane */}
      <div
        style={{
          flex: isMobile ? "1 1 auto" : "1 1 50%",
          padding: isMobile ? "32px 24px 48px" : 80,
          overflowY: "auto",
          color: "#F3ECDD",
          background: "var(--mid2)",
          marginTop: isMobile ? -46 : 0,
          borderTopLeftRadius: isMobile ? 24 : 0,
          borderTopRightRadius: isMobile ? 24 : 0,
          position: "relative",
        }}
      >
        {quizOpen && hasQuiz ? (
          <Quiz
            questions={quizQuestions}
            onBack={() => setQuizOpen(false)}
            onNextPiece={nextPiece}
          />
        ) : (
          <>
            <div
              style={{
                display: "inline-block",
                padding: "6px 9px",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "rgba(216,185,120,.85)",
                border: "1px solid rgba(216,185,120,.3)",
                borderRadius: 2,
                marginBottom: 22,
              }}
            >
              {ex.tag}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontWeight: 500,
                fontSize: isMobile ? 32 : 48,
                lineHeight: 1.08,
                color: "#FBF5E8",
                margin: 0,
              }}
            >
              {ex.name}
            </h2>
            <div style={{ marginTop: 22, maxWidth: 540 }}>
              {ex.story.split(/\n\n+/).map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontSize: isMobile ? 15 : 17,
                    lineHeight: 1.78,
                    color: "#b9bccb",
                    marginTop: i === 0 ? 0 : 18,
                    textWrap: "pretty",
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            <div
              style={{
                marginTop: 36,
                borderTop: "1px solid rgba(255,255,255,.08)",
              }}
            >
              {[
                [t("period"), ex.period],
                [t("material"), ex.material],
                [t("hall"), ex.hall],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: 16,
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(255,255,255,.07)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 10,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "#8c90a6",
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontSize: 15, color: "#d8d3c6" }}>{v}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 36,
                flexWrap: "wrap",
              }}
            >
              {hasQuiz && (
                <button
                  onClick={() => setQuizOpen(true)}
                  style={{
                    padding: "13px 26px",
                    borderRadius: 3,
                    border: 0,
                    background: "#D8B978",
                    color: "#221E17",
                    fontFamily: "var(--font-body), sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: ".04em",
                    cursor: "pointer",
                  }}
                >
                  {t("testYourEye")}
                </button>
              )}
              <button
                onClick={nextPiece}
                style={{
                  padding: "13px 26px",
                  borderRadius: 3,
                  border: "1px solid rgba(216,185,120,.5)",
                  background: "transparent",
                  color: "#D8B978",
                  fontFamily: "var(--font-body), sans-serif",
                  fontSize: 13,
                  letterSpacing: ".04em",
                  cursor: "pointer",
                }}
              >
                {t("nextPiece")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
