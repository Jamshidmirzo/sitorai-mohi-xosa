"use client";

import { useEffect, useReducer, useRef } from "react";
import { useTranslations } from "next-intl";
import { QUIZ_TOTAL_SECONDS, type QuizQuestion } from "@/lib/narrative-types";

type State = {
  qIndex: number;
  picked: number | null;
  textVal: string;
  checked: boolean;
  lastCorrect: boolean;
  score: number;
  timeLeft: number;
  done: boolean;
};

type Action =
  | { type: "tick" }
  | { type: "pick"; i: number }
  | { type: "setText"; v: string }
  | { type: "check"; correct: boolean }
  | { type: "next" }
  | { type: "finish" }
  | { type: "reset" };

const initial = (): State => ({
  qIndex: 0,
  picked: null,
  textVal: "",
  checked: false,
  lastCorrect: false,
  score: 0,
  timeLeft: QUIZ_TOTAL_SECONDS,
  done: false,
});

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "tick": {
      const t = s.timeLeft - 1;
      if (t <= 0) return { ...s, timeLeft: 0, done: true };
      return { ...s, timeLeft: t };
    }
    case "pick":
      return s.checked ? s : { ...s, picked: a.i };
    case "setText":
      return s.checked ? s : { ...s, textVal: a.v };
    case "check":
      return {
        ...s,
        checked: true,
        lastCorrect: a.correct,
        score: a.correct ? s.score + 1 : s.score,
      };
    case "next":
      return {
        ...s,
        qIndex: s.qIndex + 1,
        picked: null,
        textVal: "",
        checked: false,
        lastCorrect: false,
      };
    case "finish":
      return { ...s, done: true };
    case "reset":
      return initial();
  }
}

function fmtTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Tr = (key: string, vars?: Record<string, string | number>) => string;

function verdict(score: number, total: number, t: Tr) {
  if (score === total) return t("verdictAll");
  if (score / total >= 0.5) return t("verdictHalf");
  if (score > 0) return t("verdictSome");
  return t("verdictNone");
}

export function Quiz({
  questions,
  onBack,
  onNextPiece,
}: {
  questions: QuizQuestion[];
  onBack: () => void;
  onNextPiece: () => void;
}) {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = useTranslations("narrative.quiz");
  const quiz = questions;
  const totalQ = quiz.length;
  const q = quiz[state.qIndex];
  if (!q) return null;

  useEffect(() => {
    intervalRef.current = setInterval(() => dispatch({ type: "tick" }), 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (state.done && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [state.done]);

  const timeLow = state.timeLeft <= 15;
  const accentColor = timeLow ? "var(--quiz-bad)" : "var(--gold)";

  if (state.done) {
    const took = QUIZ_TOTAL_SECONDS - state.timeLeft;
    return (
      <div style={{ color: "#F3ECDD" }}>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "rgba(216,185,120,.85)",
          }}
        >
          {t("result")}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 500,
            fontSize: 74,
            lineHeight: 1,
            marginTop: 14,
            color: "#FBF5E8",
          }}
        >
          {state.score}{" "}
          <span style={{ color: "rgba(216,185,120,.6)" }}>/ {totalQ}</span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-display), serif",
            fontStyle: "italic",
            fontSize: 22,
            lineHeight: 1.4,
            color: "#d8c79c",
            marginTop: 18,
            maxWidth: 460,
          }}
        >
          {verdict(state.score, totalQ, t)}
        </p>
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#8c90a6",
            marginTop: 14,
          }}
        >
          {t("timeTaken", { time: fmtTime(took) })}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
          <button
            onClick={() => dispatch({ type: "reset" })}
            style={primaryBtn()}
          >
            {t("tryAgain")}
          </button>
          <button onClick={onBack} style={outlineBtn()}>
            {t("backToPiece")}
          </button>
          <button
            onClick={onNextPiece}
            style={{
              ...outlineBtn(),
              border: 0,
              padding: "12px 6px",
              color: "#D8B978",
            }}
          >
            {t("nextPiece")}
          </button>
        </div>
      </div>
    );
  }

  const isLast = state.qIndex === totalQ - 1;
  const primaryLabel = state.checked
    ? isLast
      ? t("seeScore")
      : t("continue")
    : t("checkAnswer");

  const submitDisabled = state.checked
    ? false
    : q.type === "choice"
      ? state.picked === null
      : state.textVal.trim().length === 0;

  const onPrimary = () => {
    if (state.checked) {
      if (isLast) dispatch({ type: "finish" });
      else dispatch({ type: "next" });
      return;
    }
    if (q.type === "choice") {
      if (state.picked === null) return;
      dispatch({ type: "check", correct: state.picked === q.answer });
    } else {
      const t = state.textVal.trim().toLowerCase();
      const ok = q.accept.some((a) => a.toLowerCase() === t);
      dispatch({ type: "check", correct: ok });
    }
  };

  return (
    <div style={{ color: "#F3ECDD" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "rgba(216,185,120,.85)",
          }}
        >
          {t("question", { n: state.qIndex + 1, total: totalQ })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 12,
            letterSpacing: ".18em",
            color: timeLow ? "var(--quiz-bad)" : "#d8d3c6",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: `0 0 10px ${timeLow ? "rgba(217,116,95,.7)" : "rgba(216,185,120,.7)"}`,
            }}
          />
          {fmtTime(state.timeLeft)}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          height: 2,
          background: "rgba(216,185,120,.14)",
          marginBottom: 30,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: accentColor,
            transformOrigin: "left",
            transform: `scaleX(${state.timeLeft / QUIZ_TOTAL_SECONDS})`,
            transition: "transform .9s linear",
          }}
        />
      </div>

      <h3
        style={{
          fontFamily: "var(--font-display), serif",
          fontWeight: 500,
          fontSize: 30,
          lineHeight: 1.18,
          color: "#FBF5E8",
          margin: 0,
        }}
      >
        {q.q}
      </h3>

      {q.type === "choice" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 26,
          }}
        >
          {q.options.map((opt, i) => {
            const picked = state.picked === i;
            const isCorrect = state.checked && i === q.answer;
            const wrongPick =
              state.checked && picked && i !== q.answer;
            const dimmed = state.checked && !picked && i !== q.answer;
            let borderColor = "rgba(216,185,120,.28)";
            let chipBg = "transparent";
            let chipColor = "#d8d3c6";
            let textColor = "#d8d3c6";
            if (picked && !state.checked) {
              borderColor = "rgba(216,185,120,.6)";
              chipBg = "#D8B978";
              chipColor = "#221E17";
            }
            if (isCorrect) {
              borderColor = "var(--quiz-ok)";
              chipBg = "var(--quiz-ok)";
              chipColor = "#0c1226";
              textColor = "#F3ECDD";
            }
            if (wrongPick) {
              borderColor = "var(--quiz-bad)";
              chipBg = "var(--quiz-bad)";
              chipColor = "#fff";
            }
            if (dimmed) {
              textColor = "#8c90a6";
            }
            return (
              <button
                key={opt}
                onClick={() => dispatch({ type: "pick", i })}
                disabled={state.checked}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  border: `1px solid ${borderColor}`,
                  borderRadius: 3,
                  background:
                    isCorrect
                      ? "rgba(98,176,131,.12)"
                      : wrongPick
                        ? "rgba(217,116,95,.12)"
                        : "rgba(255,255,255,.02)",
                  color: textColor,
                  cursor: state.checked ? "default" : "pointer",
                  textAlign: "left",
                  fontSize: 15,
                  transition: "all .25s var(--ease-editorial)",
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 3,
                    background: chipBg,
                    color: chipColor,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 12,
                    fontWeight: 500,
                    border:
                      picked || isCorrect || wrongPick
                        ? "none"
                        : "1px solid rgba(216,185,120,.4)",
                  }}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <input
          value={state.textVal}
          onChange={(e) => dispatch({ type: "setText", v: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") onPrimary();
          }}
          disabled={state.checked}
          placeholder={t("answerPlaceholder")}
          style={{
            marginTop: 26,
            width: "100%",
            padding: "16px 18px",
            background: "rgba(255,255,255,.04)",
            border: `1px solid ${
              state.checked
                ? state.lastCorrect
                  ? "var(--quiz-ok)"
                  : "var(--quiz-bad)"
                : "rgba(216,185,120,.4)"
            }`,
            borderRadius: 3,
            color: "#F3ECDD",
            fontSize: 16,
            fontFamily: "var(--font-body), sans-serif",
            outline: "none",
          }}
        />
      )}

      {state.checked && (
        <div
          style={{
            marginTop: 22,
            padding: "16px 18px",
            background: state.lastCorrect
              ? "rgba(98,176,131,.1)"
              : "rgba(217,116,95,.1)",
            border: `1px solid ${state.lastCorrect ? "var(--quiz-ok)" : "var(--quiz-bad)"}`,
            borderRadius: 3,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: ".18em",
              textTransform: "uppercase",
              color: state.lastCorrect ? "var(--quiz-ok)" : "var(--quiz-bad)",
              marginBottom: 8,
            }}
          >
            {state.lastCorrect ? t("correct") : t("notQuite")}
          </div>
          {!state.lastCorrect && (
            <div
              style={{
                fontSize: 14,
                color: "#d8d3c6",
                marginBottom: 6,
              }}
            >
              {t("answerLabel")}{" "}
              <span style={{ color: "#FBF5E8" }}>
                {q.type === "choice" ? q.options[q.answer] : q.answer}
              </span>
            </div>
          )}
          <div style={{ fontSize: 14, color: "#b9bccb", lineHeight: 1.5 }}>
            {q.explain}
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: 0,
            color: "#9aa0b5",
            fontFamily: "var(--font-mono), monospace",
            fontSize: 11,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {t("backToReading")}
        </button>
        <button
          onClick={onPrimary}
          disabled={submitDisabled}
          style={{
            ...primaryBtn(),
            opacity: submitDisabled ? 0.4 : 1,
            cursor: submitDisabled ? "not-allowed" : "pointer",
          }}
        >
          {primaryLabel}
        </button>
      </div>
    </div>
  );
}

function primaryBtn() {
  return {
    padding: "12px 22px",
    borderRadius: 3,
    border: 0,
    background: "#D8B978",
    color: "#221E17",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: ".04em",
    cursor: "pointer",
  } as const;
}

function outlineBtn() {
  return {
    padding: "12px 22px",
    borderRadius: 3,
    border: "1px solid rgba(216,185,120,.5)",
    background: "transparent",
    color: "#D8B978",
    fontFamily: "var(--font-body), sans-serif",
    fontSize: 13,
    letterSpacing: ".04em",
    cursor: "pointer",
  } as const;
}

