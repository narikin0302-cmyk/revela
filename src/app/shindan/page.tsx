"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  mbtiQuestions,
  loveQuestions,
  zodiacSigns,
  mbtiDescriptions,
  loveTypeDescriptions,
  trueSelfQuestions,
  getResultReading,
  getRandomizedMBTIQuestions,
  getRandomizedLoveQuestions,
} from "@/data/questions";
import type { LoveType, ResultReading, StrengthItem, ChallengeItem, MBTIQuestion, LoveQuestion } from "@/data/questions";
import {
  calculateMBTI,
  calculateLoveType,
  calculateTrueSelf,
  getZodiacFromDate,
  zodiacInfo,
} from "@/lib/calculate";
import type { MBTIAnswers, LoveAnswers, TrueSelfAnswers, LikertScore, MBTIDimensionScore } from "@/lib/calculate";
import { getMBTIScores } from "@/lib/calculate";
import { saveHistoryEntry } from "@/lib/storage";
import { trackDiagnosisResult, fetchDiagnosisStats } from "@/lib/supabase";
import { generateRevelaCode } from "@/lib/revelaCodes";
import { getMbtiCharaName } from "@/data/charaNames";
import { getRpgClassByCombo, getRpgSynergy } from "@/data/rpgClasses";

// ============================================================
// Types
// ============================================================

type Step = 0 | 1 | 2 | 3 | 4;

interface FormData {
  birthMonth: string;
  birthDay: string;
  zodiac: string;
  mbtiAnswers: MBTIAnswers;
  loveAnswers: LoveAnswers;
}

// ============================================================
// MBTI Colors (Change 2)
// ============================================================

const MBTI_COLORS: Record<string, { primary: string; bg: string; label: string; emoji: string }> = {
  // Analysts (NT) — Purple
  INTJ: { primary: "#7c3aed", bg: "rgba(124,58,237,0.15)", label: "建築家", emoji: "♟️" },
  INTP: { primary: "#8b5cf6", bg: "rgba(139,92,246,0.15)", label: "論理学者", emoji: "🔬" },
  ENTJ: { primary: "#6d28d9", bg: "rgba(109,40,217,0.15)", label: "指揮官", emoji: "👑" },
  ENTP: { primary: "#a78bfa", bg: "rgba(167,139,250,0.15)", label: "討論者", emoji: "💬" },
  // Diplomats (NF) — Green
  INFJ: { primary: "#059669", bg: "rgba(5,150,105,0.15)", label: "提唱者", emoji: "🔮" },
  INFP: { primary: "#10b981", bg: "rgba(16,185,129,0.15)", label: "仲介者", emoji: "🌸" },
  ENFJ: { primary: "#047857", bg: "rgba(4,120,87,0.15)", label: "主人公", emoji: "🌟" },
  ENFP: { primary: "#34d399", bg: "rgba(52,211,153,0.15)", label: "広報運動家", emoji: "✨" },
  // Sentinels (SJ) — Blue
  ISTJ: { primary: "#1d4ed8", bg: "rgba(29,78,216,0.15)", label: "管理者", emoji: "📋" },
  ISFJ: { primary: "#2563eb", bg: "rgba(37,99,235,0.15)", label: "擁護者", emoji: "🛡️" },
  ESTJ: { primary: "#1e40af", bg: "rgba(30,64,175,0.15)", label: "幹部", emoji: "🏛️" },
  ESFJ: { primary: "#3b82f6", bg: "rgba(59,130,246,0.15)", label: "領事", emoji: "🤝" },
  // Explorers (SP) — Yellow/Orange
  ISTP: { primary: "#92400e", bg: "rgba(146,64,14,0.15)", label: "巨匠", emoji: "🔧" },
  ISFP: { primary: "#d97706", bg: "rgba(217,119,6,0.15)", label: "冒険家", emoji: "🎨" },
  ESTP: { primary: "#b45309", bg: "rgba(180,83,9,0.15)", label: "起業家", emoji: "⚡" },
  ESFP: { primary: "#f59e0b", bg: "rgba(245,158,11,0.15)", label: "エンターテイナー", emoji: "🎉" },
};

function getMbtiColor(type: string): { primary: string; bg: string; label: string; emoji: string } {
  return MBTI_COLORS[type] ?? { primary: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.08)", label: "", emoji: "" };
}

// ============================================================
// Constants
// ============================================================

const ALL_MBTI_TYPES = [
  "INTJ","INTP","ENTJ","ENTP",
  "INFJ","INFP","ENFJ","ENFP",
  "ISTJ","ISFJ","ESTJ","ESFJ",
  "ISTP","ISFP","ESTP","ESFP",
] as const;

const ALL_LOVE_TYPES: LoveType[] = [
  "ALRF","ALRP","ALVF","ALVP",
  "AERF","AERP","AEVF","AEVP",
  "SLRF","SLRP","SLVF","SLVP",
  "SERF","SERP","SEVF","SEVP",
];

// ============================================================
// Tarot card definitions (local to shindan)
// ============================================================

interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  meaning: string;
  reversedMeaning: string;
  tilt: number;
}

const TAROT_CARDS: TarotCard[] = [
  { id: 0, name: "太陽",    nameEn: "The Sun",            meaning: "活力・成功・喜び・真実の輝き",       reversedMeaning: "一時的な曇り・過度の楽観・燃え尽き",  tilt: -18 },
  { id: 1, name: "月",      nameEn: "The Moon",           meaning: "直感・神秘・内なる世界・夢と幻想",   reversedMeaning: "混乱の解消・真実の発覚・恐怖からの解放", tilt: -12 },
  { id: 2, name: "星",      nameEn: "The Star",           meaning: "希望・再生・導き・宇宙とのつながり", reversedMeaning: "希望の喪失・無力感・自己不信",        tilt: -6  },
  { id: 3, name: "世界",    nameEn: "The World",          meaning: "完成・達成・統合・新たなサイクル",   reversedMeaning: "未完了・停滞・次のステップへの躊躇",   tilt: 0   },
  { id: 4, name: "愚者",    nameEn: "The Fool",           meaning: "新たな始まり・自由・無限の可能性",   reversedMeaning: "無謀・準備不足・現実逃避",            tilt: 6   },
  { id: 5, name: "魔術師",  nameEn: "The Magician",       meaning: "意志・創造・変容・潜在能力の覚醒",   reversedMeaning: "欺瞞・潜在能力の未活用・迷い",        tilt: 12  },
  { id: 6, name: "女教皇",  nameEn: "The High Priestess", meaning: "叡智・神秘・直感・隠された真実",     reversedMeaning: "感情の混乱・秘密の隠蔽・直感の無視",   tilt: 18  },
];

// ============================================================
// AnalyzingScreen (Change 1)
// ============================================================

function AnalyzingScreen({ onComplete }: { onComplete: () => void }) {
  const [textIdx, setTextIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  const texts = [
    "星の配置を読み解いています...",
    "MBTIパターンを解析中...",
    "キャラクターコードを照合しています...",

    "あなた専用の自己分析を生成しています...",
  ];

  useEffect(() => {
    const totalDuration = 2500;
    const textInterval = 600;
    const progressInterval = 40;

    const textTimer = setInterval(() => {
      setTextIdx((prev) => (prev + 1 < texts.length ? prev + 1 : prev));
    }, textInterval);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (totalDuration / progressInterval));
        return next >= 100 ? 100 : next;
      });
    }, progressInterval);

    const doneTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 400);
    }, totalDuration);

    return () => {
      clearInterval(textTimer);
      clearInterval(progressTimer);
      clearTimeout(doneTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.4s ease",
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Floating gold particles */}
      {[
        { left: "15%", animDuration: "3.2s", animDelay: "0s", size: 5 },
        { left: "28%", animDuration: "2.8s", animDelay: "0.5s", size: 4 },
        { left: "50%", animDuration: "3.6s", animDelay: "0.2s", size: 6 },
        { left: "68%", animDuration: "2.5s", animDelay: "0.8s", size: 4 },
        { left: "82%", animDuration: "3.0s", animDelay: "0.3s", size: 5 },
        { left: "40%", animDuration: "2.9s", animDelay: "1.0s", size: 3 },
      ].map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            bottom: "10%",
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            animation: `analyzingParticle ${p.animDuration} ${p.animDelay} ease-in infinite`,
            pointerEvents: "none",
          }}
        />
      ))}

      <style>{`
        @keyframes analyzingParticle {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-60vh) scale(0.3); opacity: 0; }
        }
        @keyframes shuffleIcon {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes ringRotateCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ringRotateCCW {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes sigilPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes analyzingTextFade {
          0% { opacity: 0; transform: translateY(6px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {/* Concentric rings + sigil */}
      <div style={{ position: "relative", width: 180, height: 180, marginBottom: 32 }}>
        {/* Ring 3 — outermost, slow CW */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.25)",
            animation: "ringRotateCW 8s linear infinite",
          }}
        >
          {/* tick marks */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "2px",
                height: "6px",
                background: "rgba(255,255,255,0.5)",
                transformOrigin: "0 -88px",
                transform: `rotate(${i * 30}deg) translateX(-50%)`,
              }}
            />
          ))}
        </div>

        {/* Ring 2 — middle, medium CCW */}
        <div
          style={{
            position: "absolute",
            inset: 18,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.4)",
            animation: "ringRotateCCW 5s linear infinite",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                transformOrigin: "0 -63px",
                transform: `rotate(${i * 45}deg) translateX(-50%)`,
              }}
            />
          ))}
        </div>

        {/* Ring 1 — inner, fast CW */}
        <div
          style={{
            position: "absolute",
            inset: 36,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.6)",
            animation: "ringRotateCW 3s linear infinite",
            boxShadow: "0 0 16px rgba(255,255,255,0.2)",
          }}
        />

        {/* Sigil */}
        <div
          style={{
            position: "absolute",
            inset: 54,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "sigilPulse 2s ease-in-out infinite",
          }}
        >
          <svg viewBox="0 0 60 60" style={{ width: "100%", height: "100%" }}>
            {/* Mandala star */}
            {[0, 45, 90, 135].map((angle, i) => (
              <line
                key={i}
                x1={30 + 26 * Math.cos((angle * Math.PI) / 180)}
                y1={30 + 26 * Math.sin((angle * Math.PI) / 180)}
                x2={30 - 26 * Math.cos((angle * Math.PI) / 180)}
                y2={30 - 26 * Math.sin((angle * Math.PI) / 180)}
                stroke="#d4af37"
                strokeWidth="1"
                opacity="0.8"
              />
            ))}
            <circle cx="30" cy="30" r="10" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
            <circle cx="30" cy="30" r="4" fill="#d4af37" opacity="0.9" />
            {[0, 60, 120, 180, 240, 300].map((a, i) => (
              <circle
                key={i}
                cx={30 + 16 * Math.cos((a * Math.PI) / 180)}
                cy={30 + 16 * Math.sin((a * Math.PI) / 180)}
                r="2"
                fill="#d4af37"
                opacity="0.6"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Text sequence */}
      <div style={{ height: 28, marginBottom: 24, textAlign: "center" }}>
        <p
          key={textIdx}
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.12em",
            opacity: 0,
            animation: "analyzingTextFade 0.6s ease forwards",
            fontFamily: "var(--font-noto-serif-jp), serif",
          }}
        >
          {texts[textIdx]}
        </p>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 240,
          height: 2,
          background: "rgba(255,255,255,0.15)",
          borderRadius: 9999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.8))",
            borderRadius: 9999,
            boxShadow: "0 0 8px rgba(255,255,255,0.5)",
            transition: "width 0.04s linear",
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// Sub-components — shared
// ============================================================

// ============================================================
// Improved Step Indicator (Improvement 1)
// ============================================================

const STEP_LABELS = ["星座", "MBTI", "キャラ", "タロット", "結果"] as const;

function StepIndicator({ step }: { step: number }) {
  // step: 1=星座, 2=MBTI, 3=キャラ; 4=分析レポート(results area)
  // We map to 0-indexed for display
  const currentIdx = step - 1; // 0..3

  return (
    <>
      {/* Desktop: full step indicator */}
      <div className="w-full mb-8 hidden sm:block">
        <div className="flex items-center justify-center gap-0">
          {STEP_LABELS.map((label, i) => {
            const isDone = i < currentIdx;
            const isCurrent = i === currentIdx;
            const isFinal = i === STEP_LABELS.length - 1;

            return (
              <div key={label} className="flex items-center">
                {/* Step circle */}
                <div className="flex flex-col items-center" style={{ minWidth: "52px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: isFinal ? "12px" : "11px",
                      fontWeight: 700,
                      transition: "all 0.4s ease",
                      background: isDone
                        ? "rgba(255,255,255,0.2)"
                        : isCurrent
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.04)",
                      border: isDone
                        ? "none"
                        : isCurrent
                        ? "2px solid rgba(255,255,255,0.8)"
                        : "1px solid rgba(255,255,255,0.12)",
                      color: isDone ? "#EDEDED" : isCurrent ? "#EDEDED" : "rgba(255,255,255,0.25)",
                      boxShadow: isCurrent ? "0 0 12px rgba(255,255,255,0.4)" : "none",
                      animation: isCurrent ? "stepPulse 2s ease-in-out infinite" : "none",
                    }}
                  >
                    {isDone ? "✓" : isFinal ? "✦" : i + 1}
                  </div>
                  <span
                    className="text-center mt-1"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.06em",
                      color: isCurrent ? "#EDEDED" : isDone ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)",
                      fontWeight: isCurrent ? 700 : 400,
                      transition: "all 0.4s ease",
                    }}
                  >
                    {label}
                  </span>
                </div>

                {/* Connector line (not after last item) */}
                {i < STEP_LABELS.length - 1 && (
                  <div
                    style={{
                      height: "1px",
                      width: "28px",
                      marginBottom: "16px",
                      background: i < currentIdx
                        ? "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.8))"
                        : "rgba(255,255,255,0.08)",
                      transition: "background 0.4s ease",
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: dot indicators */}
      <div className="flex justify-center gap-2 mb-6 sm:hidden">
        {STEP_LABELS.map((label, i) => {
          const isDone = i < currentIdx;
          const isCurrent = i === currentIdx;
          return (
            <div
              key={label}
              title={label}
              style={{
                width: isCurrent ? "20px" : "8px",
                height: "8px",
                borderRadius: "9999px",
                background: isDone
                  ? "rgba(255,255,255,0.7)"
                  : isCurrent
                  ? "linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.8))"
                  : "rgba(255,255,255,0.1)",
                transition: "all 0.3s ease",
                boxShadow: isCurrent ? "0 0 8px rgba(255,255,255,0.5)" : "none",
              }}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes stepPulse {
          0%, 100% { box-shadow: 0 0 8px rgba(255,255,255,0.4); }
          50% { box-shadow: 0 0 16px rgba(255,255,255,0.7); }
        }
      `}</style>
    </>
  );
}

// Keep original ProgressBar as alias (unused but kept for safety)
function ProgressBar({ step }: { step: number; total: number }) {
  return <StepIndicator step={step} />;
}

function SectionTitle({ en, ja }: { en: string; ja: string }) {
  return (
    <div className="text-center mb-8">
      <p className="text-xs tracking-[0.4em] mb-2" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>{en}</p>
      <h2 className="text-xl sm:text-2xl font-light" style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}>
        {ja}
      </h2>
      <div className="h-px w-16 mx-auto mt-4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
    </div>
  );
}

// ============================================================
// Step 0: Skip screen — pre-fill MBTI and/or Character Code
// ============================================================

interface Step0Props {
  knownMBTI: string;
  setKnownMBTI: (v: string) => void;
  knowsMBTI: boolean | null;
  setKnowsMBTI: (v: boolean | null) => void;
  knownLove: LoveType | "";
  setKnownLove: (v: LoveType | "") => void;
  knowsLove: boolean | null;
  setKnowsLove: (v: boolean | null) => void;
  onNext: () => void;
  mbtiCount: 5 | 10 | 15;
  onMbtiCountChange: (n: 5 | 10 | 15) => void;
  loveCount: 5 | 10 | 15;
  onLoveCountChange: (n: 5 | 10 | 15) => void;
}

function Step0({
  knownMBTI, setKnownMBTI,
  knowsMBTI, setKnowsMBTI,
  knownLove, setKnownLove,
  knowsLove, setKnowsLove,
  onNext,
  mbtiCount, onMbtiCountChange,
  loveCount, onLoveCountChange,
}: Step0Props) {
  const btnBase: React.CSSProperties = {
    padding: "10px 20px",
    borderRadius: "9999px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    letterSpacing: "0.1em",
  };
  const btnYes = (active: boolean): React.CSSProperties => ({
    ...btnBase,
    background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
    color: active ? "#EDEDED" : "rgba(255,255,255,0.5)",
    border: active ? "none" : "1px solid rgba(255,255,255,0.4)",
  });
  const btnNo = (active: boolean): React.CSSProperties => ({
    ...btnBase,
    background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
    color: "#EDEDED",
    border: active ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(255,255,255,0.1)",
  });

  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <SectionTitle en="STEP 00" ja="診断のカスタマイズ" />

      <p className="text-center text-xs opacity-50 mb-8 leading-relaxed">
        すでに知っているタイプがあれば選んでスキップできます。<br />
        わからない場合はそのまま診断へ進んでください。
      </p>

      {/* MBTI skip */}
      <div
        className="rounded-2xl p-5 mb-5"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        <p className="text-sm font-medium mb-4" style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}>
          MBTIタイプをすでに知っていますか？
        </p>
        <div className="flex gap-3 mb-4">
          <button style={btnYes(knowsMBTI === true)}  onClick={() => setKnowsMBTI(true)}>
            はい、知っています
          </button>
          <button style={btnNo(knowsMBTI === false)} onClick={() => { setKnowsMBTI(false); setKnownMBTI(""); }}>
            いいえ、診断する
          </button>
        </div>

        {knowsMBTI === false && (
          <div className="animate-fade-in mt-1 mb-2">
            <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>質問数を選んでください</p>
            <div className="flex gap-2 flex-wrap mb-1">
              {([5, 10, 15] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => onMbtiCountChange(n)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: mbtiCount === n ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: mbtiCount === n ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                    color: mbtiCount === n ? "#EDEDED" : "rgba(255,255,255,0.45)",
                    border: mbtiCount === n ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {n}問{n === 5 ? "（速攻）" : n === 10 ? "（標準）" : "（詳細）"}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>※ 多いほど正確に診断できます</p>
          </div>
        )}

        {knowsMBTI === true && (
          <div className="animate-fade-in">
            <label className="block text-xs tracking-widest mb-2 opacity-60">MBTIタイプを選択</label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_MBTI_TYPES.map((type) => {
                const isSelected = knownMBTI === type;
                const colors = getMbtiColor(type);
                return (
                  <button
                    key={type}
                    onClick={() => setKnownMBTI(isSelected ? "" : type)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left",
                      background: isSelected ? colors.bg : "rgba(255,255,255,0.04)",
                      border: isSelected ? `1px solid ${colors.primary}` : "1px solid rgba(255,255,255,0.1)",
                      boxShadow: isSelected ? `0 0 8px ${colors.bg}` : "none",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{colors.emoji}</span>
                    <span>
                      <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: isSelected ? colors.primary : "rgba(255,255,255,0.55)" }}>
                        {type}
                      </span>
                      <span style={{ display: "block", fontSize: "10px", color: isSelected ? colors.primary : "rgba(255,255,255,0.45)" }}>
                        {mbtiDescriptions[type]?.title ?? ""}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Character code skip */}
      <div
        className="rounded-2xl p-5 mb-8"
        style={{ background: "rgba(232,160,191,0.05)", border: "1px solid rgba(232,160,191,0.2)" }}
      >
        <p className="text-sm font-medium mb-4" style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}>
          キャラクターコードを知っていますか？
        </p>
        <div className="flex gap-3 mb-4">
          <button style={btnYes(knowsLove === true)}  onClick={() => setKnowsLove(true)}>
            はい、知っています
          </button>
          <button style={btnNo(knowsLove === false)} onClick={() => { setKnowsLove(false); setKnownLove(""); }}>
            いいえ、診断する
          </button>
        </div>

        {knowsLove === false && (
          <div className="animate-fade-in mt-1 mb-2">
            <p className="text-xs mb-2" style={{ color: "rgba(255,255,255,0.45)" }}>質問数を選んでください</p>
            <div className="flex gap-2 flex-wrap mb-1">
              {([5, 10, 15] as const).map((n) => (
                <button
                  key={n}
                  onClick={() => onLoveCountChange(n)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontWeight: loveCount === n ? 700 : 500,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: loveCount === n ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.04)",
                    color: loveCount === n ? "#EDEDED" : "rgba(255,255,255,0.45)",
                    border: loveCount === n ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {n}問{n === 5 ? "（速攻）" : n === 10 ? "（標準）" : "（詳細）"}
                </button>
              ))}
            </div>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>※ 多いほど正確に診断できます</p>
          </div>
        )}

        {knowsLove === true && (
          <div className="animate-fade-in space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {ALL_LOVE_TYPES.map((type) => {
                const info = loveTypeDescriptions[type];
                const isSelected = knownLove === type;
                return (
                  <button
                    key={type}
                    onClick={() => setKnownLove(isSelected ? "" : type)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "8px 10px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      textAlign: "left",
                      background: isSelected ? "rgba(232,160,191,0.2)" : "rgba(255,255,255,0.04)",
                      border: isSelected ? "1px solid rgba(232,160,191,0.6)" : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <span style={{ fontSize: "14px" }}>{info.emoji}</span>
                    <span>
                      <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: isSelected ? "#e8a0bf" : "rgba(255,255,255,0.55)" }}>
                        {type}
                      </span>
                      <span style={{ display: "block", fontSize: "10px", opacity: 0.5 }}>{info.nickname}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        className="btn-outline-primary w-full py-4 rounded-full text-sm tracking-widest font-bold"
      >
        次へ進む →
      </button>
    </div>
  );
}

// ============================================================
// Step 1: Birthday + Zodiac (with skip & quick-select)
// ============================================================

type ZodiacInputMode = "birthdate" | "quickselect";

function Step1({
  data,
  onChange,
  onNext,
  onBack,
  onSkipZodiac,
}: {
  data: FormData;
  onChange: (key: keyof FormData, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  onSkipZodiac: () => void;
}) {
  const [mode, setMode] = useState<ZodiacInputMode>("quickselect");

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleBirthChange = (key: "birthMonth" | "birthDay", value: string) => {
    onChange(key, value);
    const month = key === "birthMonth" ? value : data.birthMonth;
    const day   = key === "birthDay"   ? value : data.birthDay;
    if (month && day) {
      const auto = getZodiacFromDate(parseInt(month), parseInt(day));
      onChange("zodiac", auto);
    }
  };

  const handleQuickSelect = (zodiacValue: string) => {
    onChange("zodiac", zodiacValue);
    onChange("birthMonth", "");
    onChange("birthDay", "");
  };

  const canProceed = mode === "birthdate"
    ? !!(data.birthMonth && data.birthDay && data.zodiac)
    : !!data.zodiac;

  const selectStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "#EDEDED",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  };

  const currentZodiac = data.zodiac ? zodiacInfo[data.zodiac] : null;

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: "10px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    letterSpacing: "0.05em",
    background: active
      ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))"
      : "rgba(255,255,255,0.03)",
    color: active ? "#EDEDED" : "rgba(255,255,255,0.35)",
    border: active ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
  });

  return (
    <div className="animate-fade-in slide-in-right">
      <SectionTitle en="STEP 01" ja="生年月日と星座" />
      <div className="space-y-5 max-w-sm mx-auto">

        {/* Mode toggle */}
        <div className="flex gap-2">
          <button style={tabStyle(mode === "birthdate")} onClick={() => setMode("birthdate")}>
            📅 生年月日から自動判定
          </button>
          <button style={tabStyle(mode === "quickselect")} onClick={() => { setMode("quickselect"); onChange("birthMonth",""); onChange("birthDay",""); }}>
            ✦ 星座を直接選ぶ
          </button>
        </div>

        <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />

        {mode === "birthdate" && (
          <>
            <div>
              <label className="block text-xs tracking-widest mb-2 opacity-60">誕生日</label>
              <div className="grid grid-cols-2 gap-2">
                <select value={data.birthMonth} onChange={(e) => handleBirthChange("birthMonth", e.target.value)} style={selectStyle}>
                  <option value="">月</option>
                  {months.map((m) => <option key={m} value={m} style={{ background: "#1a1730" }}>{m}月</option>)}
                </select>
                <select value={data.birthDay} onChange={(e) => handleBirthChange("birthDay", e.target.value)} style={selectStyle}>
                  <option value="">日</option>
                  {days.map((d) => <option key={d} value={d} style={{ background: "#1a1730" }}>{d}日</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest mb-2 opacity-60">
                星座 <span className="ml-2 opacity-50">(生年月日から自動判定)</span>
              </label>
              <select value={data.zodiac} onChange={(e) => onChange("zodiac", e.target.value)} style={selectStyle}>
                <option value="">星座を選択</option>
                {zodiacSigns.map((z) => (
                  <option key={z.value} value={z.value} style={{ background: "#1a1730" }}>{z.label}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {mode === "quickselect" && (
          <div className="animate-fade-in">
            <label className="block text-xs tracking-widest mb-3 opacity-60">星座を選択してください</label>
            <div className="grid grid-cols-3 gap-2">
              {zodiacSigns.map((z) => {
                const isSelected = data.zodiac === z.value;
                const info = zodiacInfo[z.value];
                return (
                  <button
                    key={z.value}
                    onClick={() => handleQuickSelect(z.value)}
                    style={{
                      padding: "10px 6px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: isSelected ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: isSelected ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.04)",
                      color: isSelected ? "#EDEDED" : "rgba(255,255,255,0.7)",
                      border: isSelected ? "1px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.1)",
                      boxShadow: isSelected ? "0 0 12px rgba(255,255,255,0.2)" : "none",
                      textAlign: "center",
                    }}
                  >
                    <div className="text-base mb-0.5">{info?.emoji ?? "✦"}</div>
                    <div>{z.value}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {data.zodiac && currentZodiac && (
          <div
            className="rounded-xl p-4 text-center animate-fade-in"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.25)" }}
          >
            <div className="text-3xl mb-2">{currentZodiac.emoji}</div>
            <div className="text-lg font-medium mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>{data.zodiac}</div>
            <div className="text-xs opacity-50">エレメント: {currentZodiac.element} &nbsp;·&nbsp; 支配星: {currentZodiac.planet}</div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onBack} className="btn-outline-gold flex-1 py-4 rounded-full text-sm tracking-widest">
            ← 前の問いへ戻る
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className="btn-outline-primary flex-[2] py-4 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            星座を確定する →
          </button>
        </div>

        {/* Skip zodiac link */}
        <div className="text-center">
          <button
            onClick={onSkipZodiac}
            className="text-xs opacity-40 hover:opacity-70 transition-opacity underline tracking-wider"
          >
            今はスキップ（後で確認できます）
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Step 2: MBTI Questions (or skipped)
// ============================================================

const LIKERT_LABELS: { score: LikertScore; label: string; short: string }[] = [
  { score: 1, label: "そう思う",         short: "そう思う" },
  { score: 2, label: "ややそう思う",     short: "やや\nそう思う" },
  { score: 3, label: "どちらでもない",   short: "どちら\nでもない" },
  { score: 4, label: "ややそう思わない", short: "やや\n思わない" },
  { score: 5, label: "そう思わない",     short: "そう思わ\nない" },
];

function Step2({
  answers,
  onAnswer,
  onNext,
  onBack,
  questions,
}: {
  answers: MBTIAnswers;
  onAnswer: (id: number, score: LikertScore) => void;
  onNext: () => void;
  onBack: () => void;
  questions: MBTIQuestion[];
}) {
  const answered = Object.keys(answers).length;
  const total = questions.length;
  const canProceed = answered === total;

  return (
    <div className="animate-fade-in slide-in-right">
      <SectionTitle en="STEP 02" ja="性格診断 — MBTI" />
      <div className="text-center mb-6">
        <span className="text-xs tracking-widest opacity-50">{answered} / {total} 回答済み</span>
      </div>

      <div className="space-y-5 max-w-lg mx-auto">
        {questions.map((q, idx) => {
          const selected = answers[q.id];
          return (
            <div key={q.id} className="card-glow rounded-2xl p-5">
              <p className="text-xs opacity-40 mb-2 tracking-widest">Q{String(idx + 1).padStart(2, "0")}</p>
              <p className="text-sm sm:text-base mb-1 leading-relaxed font-medium">{q.question}</p>
              <p className="text-xs opacity-50 mb-4 leading-relaxed">「{q.optionA}」</p>
              <div className="grid grid-cols-5 gap-1.5">
                {LIKERT_LABELS.map(({ score, label }) => {
                  const isSelected = selected === score;
                  return (
                    <button
                      key={score}
                      onClick={() => onAnswer(q.id, score)}
                      className="rounded-xl py-2 px-1 text-center transition-all duration-150"
                      style={{
                        background: isSelected ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.04)",
                        border: isSelected ? "none" : "1px solid rgba(255,255,255,0.2)",
                        color: isSelected ? "#0a0a0a" : "rgba(255,255,255,0.6)",
                        fontWeight: isSelected ? 700 : 400,
                        fontSize: "10px",
                        lineHeight: "1.3",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1.5 px-0.5">
                <span className="text-xs opacity-30">← 当てはまる</span>
                <span className="text-xs opacity-30">当てはまらない →</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 max-w-lg mx-auto mt-8">
        <button onClick={onBack} className="btn-outline-gold flex-1 py-3.5 rounded-full text-sm tracking-widest">← 前の問いへ戻る</button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="btn-outline-primary flex-[2] py-3.5 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {canProceed ? "MBTI結果を見る →" : `残り${total - answered}問`}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Step 2.5: True Self MBTI Verification
// ============================================================

function TrueSelfStep({
  initialMBTI,
  fromDiagnosis,
  onConfirm,
  onSkip,
}: {
  initialMBTI: string;
  fromDiagnosis: boolean;
  onConfirm: (finalMBTI: string, trueSelf: string | null) => void;
  onSkip: () => void;
}) {
  const [answers, setAnswers] = useState<TrueSelfAnswers>({});
  const [result, setResult] = useState<{ confirmed: boolean; suggestedType: string } | null>(null);
  const [chosenType, setChosenType] = useState<string>("");

  const answered = Object.keys(answers).length;
  const total = trueSelfQuestions.length;
  const canCheck = answered === total;

  const handleAnswer = (id: number, choice: "A" | "B") => {
    setAnswers((prev) => ({ ...prev, [id]: choice }));
    setResult(null);
  };

  const handleCheck = () => {
    const r = calculateTrueSelf(initialMBTI, answers);
    setResult(r);
    setChosenType(r.confirmed ? initialMBTI : "");
  };

  const handleChoose = (type: string) => {
    setChosenType(type);
  };

  const handleContinue = () => {
    if (!result) return;
    if (result.confirmed) {
      onConfirm(initialMBTI, null);
    } else {
      const trueSelf = chosenType !== initialMBTI ? chosenType : null;
      onConfirm(chosenType || initialMBTI, trueSelf);
    }
  };

  return (
    <div className="animate-fade-in max-w-lg mx-auto">
      <div className="text-center mb-8">
        <p className="text-xs tracking-[0.4em] mb-2" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>TRUE SELF</p>
        <h2 className="text-xl sm:text-2xl font-light mb-3" style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}>
          {fromDiagnosis ? "本当のあなたを確かめましょう" : "🔮 本当にそれがあなたの本質？"}
        </h2>
        <div className="h-px w-16 mx-auto mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
      </div>

      <div
        className="rounded-2xl p-5 mb-6 text-center"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.2)" }}
      >
        {fromDiagnosis ? (
          <>
            <p className="text-base font-medium mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
              あなたのMBTI診断結果は「{initialMBTI}」でした。
            </p>
            <p className="text-xs opacity-60 leading-relaxed">
              でも... 本当にそれが本当のあなたですか？<br />
              表面的な行動パターンと内なる本質がずれていることがよくあります。<br />
              追加の3問で、あなたの「あなたのタイプ」を確かめましょう。
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-medium mb-2" style={{ color: "rgba(255,255,255,0.55)" }}>
              ちょっと待って！
            </p>
            <p className="text-xs opacity-60 leading-relaxed">
              本当に「{initialMBTI}」があなたの本質ですか？<br />
              以下の3問に答えて確かめてみましょう。
            </p>
          </>
        )}
      </div>

      {!result && (
        <>
          <div className="space-y-4 mb-6">
            {trueSelfQuestions.map((q, idx) => (
              <div key={q.id} className="card-glow rounded-2xl p-5">
                <p className="text-xs opacity-40 mb-2 tracking-widest">Q{String(idx + 1).padStart(2, "0")}</p>
                <p className="text-sm mb-4 leading-relaxed font-medium">{q.question}</p>
                <div className="space-y-2">
                  {(["A", "B"] as const).map((choice) => {
                    const text = choice === "A" ? q.optionA : q.optionB;
                    const isSelected = answers[q.id] === choice;
                    return (
                      <button
                        key={choice}
                        onClick={() => handleAnswer(q.id, choice)}
                        className={`option-btn w-full rounded-xl px-4 py-3 text-xs sm:text-sm leading-relaxed${isSelected ? " selected" : ""}`}
                      >
                        <span
                          className="inline-block w-6 h-6 rounded-full text-xs mr-3 flex-shrink-0"
                          style={{
                            background: isSelected ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.06)",
                            border: isSelected ? "1px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.1)",
                            color: isSelected ? "#EDEDED" : "inherit",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            verticalAlign: "middle",
                          }}
                        >
                          {choice}
                        </span>
                        {text}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCheck}
              disabled={!canCheck}
              className="btn-outline-primary flex-1 py-4 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {canCheck ? "あなたのタイプを確認する ✦" : `残り${total - answered}問`}
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={onSkip}
              className="text-xs opacity-40 hover:opacity-70 transition-opacity underline tracking-wider"
            >
              今はスキップ（後で確認できます）
            </button>
          </div>
        </>
      )}

      {result && (
        <div className="animate-fade-in space-y-4">
          {result.confirmed ? (
            <div
              className="rounded-2xl p-5 text-center"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.4)" }}
            >
              <div className="text-3xl mb-2">✨</div>
              <p className="text-base font-medium mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                やっぱり{initialMBTI}です！
              </p>
              <p className="text-xs opacity-60">あなたの直感は正しかった。本当の姿が確認されました。</p>
            </div>
          ) : (
            <div
              className="rounded-2xl p-5"
              style={{ background: "rgba(232,160,191,0.06)", border: "1px solid rgba(232,160,191,0.3)" }}
            >
              <p className="text-sm font-medium mb-3 text-center" style={{ color: "#e8a0bf" }}>
                あなたの本質は{result.suggestedType}に近いかもしれません。<br />
                <span className="text-xs opacity-60">どちらで続けますか？</span>
              </p>
              <div className="flex gap-3">
                {[initialMBTI, result.suggestedType].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleChoose(type)}
                    style={{
                      flex: 1,
                      padding: "12px 8px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: chosenType === type
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.05)",
                      color: "#EDEDED",
                      border: chosenType === type ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {type}
                    {type === initialMBTI && (
                      <span className="block text-xs font-normal opacity-70">元の結果</span>
                    )}
                    {type === result.suggestedType && (
                      <span className="block text-xs font-normal opacity-70">新しい発見</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!result.confirmed && !chosenType}
            className="btn-outline-primary w-full py-4 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            この結果で進む →
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Step 3: キャラクターコード Questions (or skipped)
// ============================================================

function Step3({
  answers,
  onAnswer,
  onNext,
  onBack,
  questions,
}: {
  answers: LoveAnswers;
  onAnswer: (id: number, score: LikertScore) => void;
  onNext: () => void;
  onBack: () => void;
  questions: LoveQuestion[];
}) {
  const answered = Object.keys(answers).length;
  const total = questions.length;
  const canProceed = answered === total;

  return (
    <div className="animate-fade-in">
      <SectionTitle en="STEP 03" ja="キャラクターコード診断" />
      <div className="text-center mb-6">
        <span className="text-xs tracking-widest opacity-50">{answered} / {total} 回答済み</span>
      </div>
      <div className="space-y-5 max-w-lg mx-auto">
        {questions.map((q, idx) => {
          const selected = answers[q.id];
          return (
            <div key={q.id} className="card-glow rounded-2xl p-5">
              <p className="text-xs opacity-40 mb-2 tracking-widest">Q{String(idx + 1).padStart(2, "0")}</p>
              <p className="text-sm sm:text-base mb-1 leading-relaxed font-medium">{q.question}</p>
              <p className="text-xs opacity-50 mb-4 leading-relaxed">「{q.optionA}」</p>
              <div className="grid grid-cols-5 gap-1.5">
                {LIKERT_LABELS.map(({ score, label }) => {
                  const isSelected = selected === score;
                  return (
                    <button
                      key={score}
                      onClick={() => onAnswer(q.id, score)}
                      className="rounded-xl py-2 px-1 text-center transition-all duration-150"
                      style={{
                        background: isSelected ? "linear-gradient(135deg, #b8508a, #e8a0bf)" : "rgba(255,255,255,0.04)",
                        border: isSelected ? "none" : "1px solid rgba(232,160,191,0.2)",
                        color: isSelected ? "#0a0a0a" : "rgba(255,255,255,0.6)",
                        fontWeight: isSelected ? 700 : 400,
                        fontSize: "10px",
                        lineHeight: "1.3",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between mt-1.5 px-0.5">
                <span className="text-xs opacity-30">← 当てはまる</span>
                <span className="text-xs opacity-30">当てはまらない →</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 max-w-lg mx-auto mt-8">
        <button onClick={onBack} className="btn-outline-gold flex-1 py-3.5 rounded-full text-sm tracking-widest">← 前の問いへ戻る</button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="btn-outline-primary flex-[2] py-3.5 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {canProceed ? "キャラコードを確定する ✦" : `残り${total - answered}問`}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Tarot Card Back SVG
// ============================================================

function CardBackSVG() {
  return (
    <svg
      viewBox="0 0 140 220"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}
    >
      <rect width="140" height="220" rx="10" ry="10" fill="#111" />
      <rect x="4" y="4" width="132" height="212" rx="8" ry="8" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.8" />
      <rect x="8" y="8" width="124" height="204" rx="6" ry="6" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.4" />
      <path d="M12 18 L12 12 L18 12" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.9" />
      <circle cx="12" cy="12" r="1.5" fill="#d4af37" opacity="0.9" />
      <path d="M128 18 L128 12 L122 12" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.9" />
      <circle cx="128" cy="12" r="1.5" fill="#d4af37" opacity="0.9" />
      <path d="M12 202 L12 208 L18 208" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.9" />
      <circle cx="12" cy="208" r="1.5" fill="#d4af37" opacity="0.9" />
      <path d="M128 202 L128 208 L122 208" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.9" />
      <circle cx="128" cy="208" r="1.5" fill="#d4af37" opacity="0.9" />
      <circle cx="70" cy="105" r="44" fill="none" stroke="#d4af37" strokeWidth="0.8" opacity="0.5" />
      <circle cx="70" cy="105" r="38" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.4" />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const ox = 70 + 28 * Math.sin(angle);
        const oy = 105 - 28 * Math.cos(angle);
        const cx1 = 70 + 38 * Math.sin(angle - 0.25);
        const cy1 = 105 - 38 * Math.cos(angle - 0.25);
        const cx2 = 70 + 38 * Math.sin(angle + 0.25);
        const cy2 = 105 - 38 * Math.cos(angle + 0.25);
        return (
          <path
            key={i}
            d={`M 70 105 Q ${cx1} ${cy1} ${ox} ${oy} Q ${cx2} ${cy2} 70 105`}
            fill="none"
            stroke="#d4af37"
            strokeWidth="0.8"
            opacity="0.55"
          />
        );
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x2 = 70 + 20 * Math.sin(angle);
        const y2 = 105 - 20 * Math.cos(angle);
        return <line key={i} x1="70" y1="105" x2={x2} y2={y2} stroke="#d4af37" strokeWidth="0.8" opacity="0.7" />;
      })}
      <circle cx="70" cy="105" r="5" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.9" />
      <circle cx="70" cy="105" r="2" fill="#d4af37" opacity="0.9" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const x = 70 + 32 * Math.sin(angle);
        const y = 105 - 32 * Math.cos(angle);
        return <circle key={i} cx={x} cy={y} r="1" fill="#d4af37" opacity="0.5" />;
      })}
      <text x="70" y="200" textAnchor="middle" fill="#d4af37" fontSize="9" fontFamily="serif" letterSpacing="3" opacity="0.85">
        revela
      </text>
      <line x1="30" y1="28" x2="110" y2="28" stroke="#d4af37" strokeWidth="0.5" opacity="0.4" />
      <line x1="30" y1="182" x2="110" y2="182" stroke="#d4af37" strokeWidth="0.5" opacity="0.4" />
    </svg>
  );
}

// ============================================================
// Tarot Card Front SVG
// ============================================================

function CardFrontSVG({ card, isReversed }: { card: TarotCard; isReversed: boolean }) {
  const illustrations: Record<number, React.ReactNode> = {
    0: (
      <>
        <defs>
          <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f9e04b" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f0a020" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#c84b00" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="140" height="220" rx="10" fill="#1a0020" />
        <rect x="10" y="35" width="120" height="140" rx="6" fill="url(#sunGrad)" opacity="0.3" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <line key={i}
              x1={70 + 22 * Math.sin(a)} y1={100 - 22 * Math.cos(a)}
              x2={70 + 42 * Math.sin(a)} y2={100 - 42 * Math.cos(a)}
              stroke="#f9e04b" strokeWidth={i % 2 === 0 ? "2" : "1"} opacity="0.9"
            />
          );
        })}
        <circle cx="70" cy="100" r="18" fill="#f9e04b" opacity="0.95" />
        <circle cx="70" cy="100" r="13" fill="#fff8c0" />
        <circle cx="65" cy="97" r="2" fill="#c84b00" />
        <circle cx="75" cy="97" r="2" fill="#c84b00" />
        <path d="M 64 104 Q 70 109 76 104" fill="none" stroke="#c84b00" strokeWidth="1.5" strokeLinecap="round" />
        {[30, 50, 70, 90, 110].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy="155" r="4" fill={i % 2 === 0 ? "#f9e04b" : "#ff8080"} opacity="0.8" />
            <line x1={x} y1="159" x2={x} y2="168" stroke="#4a9a40" strokeWidth="1.5" />
          </g>
        ))}
      </>
    ),
    1: (
      <>
        <defs>
          <radialGradient id="moonGrad" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#8040c0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0a0520" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="140" height="220" rx="10" fill="#05021a" />
        <rect x="10" y="35" width="120" height="140" rx="6" fill="url(#moonGrad)" opacity="0.8" />
        <path d="M 85 65 A 25 25 0 1 1 85 105 A 18 18 0 1 0 85 65 Z" fill="#e0d0ff" opacity="0.9" />
        {[{cx:50,cy:140,r:8},{cx:90,cy:155,r:6},{cx:35,cy:158,r:5}].map((p,i)=>(
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r={p.r} fill="none" stroke="#8060b0" strokeWidth="1" opacity="0.7"/>
            <path d={`M ${p.cx-p.r} ${p.cy} Q ${p.cx} ${p.cy-p.r*1.5} ${p.cx+p.r} ${p.cy}`} fill="none" stroke="#8060b0" strokeWidth="0.8" opacity="0.5"/>
          </g>
        ))}
        {[{x:30,y:60},{x:105,y:75},{x:20,y:100},{x:115,y:120}].map((s,i)=>(
          <circle key={i} cx={s.x} cy={s.y} r="1.5" fill="#e0d0ff" opacity={0.4+i*0.1}/>
        ))}
        <path d="M 20 170 Q 70 155 120 170" fill="none" stroke="#4a3060" strokeWidth="2" opacity="0.6"/>
        <path d="M 30 175 Q 70 165 110 175" fill="#2a1840" opacity="0.4"/>
      </>
    ),
    2: (
      <>
        <rect width="140" height="220" rx="10" fill="#041020" />
        <rect x="10" y="35" width="120" height="140" rx="6" fill="rgba(20,60,100,0.4)" />
        {([[70,60,8],[35,75,3],[105,70,4],[50,120,3],[95,115,2.5],[70,100,2],[20,100,1.5],[120,105,2]] as [number,number,number][]).map(([cx,cy,r],i)=>(
          <circle key={i} cx={cx} cy={cy} r={r} fill="#c0e0ff" opacity={0.5+i*0.05}/>
        ))}
        {Array.from({length:8}).map((_,i)=>{
          const a=(i*45*Math.PI)/180;
          return <line key={i} x1={70+9*Math.sin(a)} y1={60-9*Math.cos(a)} x2={70+16*Math.sin(a)} y2={60-16*Math.cos(a)} stroke="#c0e0ff" strokeWidth="1.5" opacity="0.8"/>;
        })}
        <path d="M 40 140 Q 55 130 70 140 Q 85 150 100 140" fill="none" stroke="#4090c0" strokeWidth="1.5" opacity="0.7"/>
        <path d="M 30 155 L 110 155" stroke="#4090c0" strokeWidth="0.8" opacity="0.4"/>
      </>
    ),
    3: (
      <>
        <rect width="140" height="220" rx="10" fill="#021510" />
        <ellipse cx="70" cy="100" rx="40" ry="52" fill="none" stroke="#40c080" strokeWidth="1.2" opacity="0.8"/>
        <ellipse cx="70" cy="100" rx="15" ry="52" fill="none" stroke="#40c080" strokeWidth="0.8" opacity="0.5"/>
        <line x1="30" y1="100" x2="110" y2="100" stroke="#40c080" strokeWidth="0.8" opacity="0.5"/>
        <ellipse cx="70" cy="100" rx="40" ry="52" fill="none" stroke="#80ffc0" strokeWidth="0.5" opacity="0.3"/>
        <circle cx="70" cy="100" r="12" fill="#40c080" opacity="0.4"/>
        <circle cx="70" cy="100" r="6" fill="#80ffc0" opacity="0.7"/>
        {[0,45,90,135,180,225,270,315].map((a,i)=>{
          const r=(i%2===0)?18:12;
          return <circle key={i} cx={70+r*Math.sin(a*Math.PI/180)} cy={100-r*Math.cos(a*Math.PI/180)} r="2" fill="#40c080" opacity="0.6"/>;
        })}
      </>
    ),
    4: (
      <>
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2040a0" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#80c0ff" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="140" height="220" rx="10" fill="#0a1530" />
        <rect x="10" y="35" width="120" height="140" rx="6" fill="url(#skyGrad)" opacity="0.6" />
        <circle cx="108" cy="55" r="14" fill="#f9e04b" opacity="0.8" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i * 45 * Math.PI) / 180;
          return <line key={i} x1={108 + 16 * Math.sin(a)} y1={55 - 16 * Math.cos(a)} x2={108 + 22 * Math.sin(a)} y2={55 - 22 * Math.cos(a)} stroke="#f9e04b" strokeWidth="1.5" opacity="0.7" />;
        })}
        <circle cx="55" cy="90" r="7" fill="#EDEDED" opacity="0.9" />
        <path d="M 48 87 Q 55 70 62 87" fill="#ff6060" opacity="0.8" />
        <circle cx="62" cy="87" r="3" fill="#f9e04b" opacity="0.9" />
        <line x1="55" y1="97" x2="55" y2="118" stroke="#EDEDED" strokeWidth="2.5" opacity="0.9" />
        <line x1="55" y1="104" x2="44" y2="115" stroke="#EDEDED" strokeWidth="2" opacity="0.9" />
        <line x1="44" y1="115" x2="30" y2="125" stroke="#c09050" strokeWidth="2" opacity="0.9" />
        <circle cx="28" cy="123" r="4" fill="#ff8040" opacity="0.8" />
        <line x1="55" y1="104" x2="67" y2="112" stroke="#EDEDED" strokeWidth="2" opacity="0.9" />
        <line x1="55" y1="118" x2="48" y2="135" stroke="#EDEDED" strokeWidth="2" opacity="0.9" />
        <line x1="55" y1="118" x2="64" y2="132" stroke="#EDEDED" strokeWidth="2" opacity="0.9" />
        <ellipse cx="80" cy="128" rx="8" ry="5" fill="#c09050" opacity="0.8" />
        <circle cx="87" cy="124" r="4" fill="#c09050" opacity="0.8" />
        <path d="M 10 162 L 75 145 L 130 162 L 130 175 L 10 175 Z" fill="#2a4020" opacity="0.7" />
        <polygon points="90,100 110,145 70,145" fill="#3a3060" opacity="0.5" />
        <polygon points="105,95 120,135 90,135" fill="#2a2050" opacity="0.4" />
      </>
    ),
    5: (
      <>
        <defs>
          <radialGradient id="magicGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#8040ff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#111" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="140" height="220" rx="10" fill="#100828" />
        <rect x="10" y="35" width="120" height="140" rx="6" fill="url(#magicGrad)" opacity="0.9" />
        <path d="M 52 52 Q 52 44 60 44 Q 70 44 70 52 Q 70 60 78 60 Q 88 60 88 52 Q 88 44 78 44 Q 70 44 70 52 Q 70 60 60 60 Q 52 60 52 52 Z" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.9" />
        <circle cx="70" cy="86" r="7" fill="#EDEDED" opacity="0.9" />
        <polygon points="70,62 63,86 77,86" fill="#400080" opacity="0.9" />
        <line x1="63" y1="86" x2="77" y2="86" stroke="#d4af37" strokeWidth="1" opacity="0.8" />
        <path d="M 63 93 L 60 130 L 80 130 L 77 93 Z" fill="#400080" opacity="0.8" />
        <line x1="61" y1="108" x2="79" y2="108" stroke="#d4af37" strokeWidth="1.5" opacity="0.7" />
        <line x1="77" y1="95" x2="92" y2="78" stroke="#EDEDED" strokeWidth="2" opacity="0.9" />
        <line x1="92" y1="78" x2="92" y2="65" stroke="#c09050" strokeWidth="2" opacity="0.9" />
        <circle cx="92" cy="63" r="3" fill="#d4af37" opacity="0.9" />
        <line x1="63" y1="95" x2="48" y2="110" stroke="#EDEDED" strokeWidth="2" opacity="0.9" />
        <rect x="30" y="130" width="80" height="4" rx="2" fill="#c09050" opacity="0.7" />
      </>
    ),
    6: (
      <>
        <defs>
          <radialGradient id="priestGrad" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#4060c0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#111" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="140" height="220" rx="10" fill="#0a0a0a" />
        <rect x="10" y="35" width="120" height="140" rx="6" fill="url(#priestGrad)" opacity="0.9" />
        <rect x="18" y="45" width="14" height="110" rx="3" fill="#1a1060" opacity="0.9" />
        <rect x="108" y="45" width="14" height="110" rx="3" fill="#f0f0e0" opacity="0.7" />
        <circle cx="70" cy="82" r="8" fill="#e8d8c0" opacity="0.9" />
        <rect x="62" y="70" width="16" height="5" rx="1" fill="#d4af37" opacity="0.9" />
        <path d="M 62 90 L 55 155 L 85 155 L 78 90 Z" fill="#2030a0" opacity="0.8" />
        <line x1="70" y1="96" x2="70" y2="106" stroke="#d4af37" strokeWidth="1.5" opacity="0.9" />
        <line x1="66" y1="100" x2="74" y2="100" stroke="#d4af37" strokeWidth="1.5" opacity="0.9" />
        <rect x="58" y="115" width="24" height="16" rx="2" fill="#f0e8c0" opacity="0.8" />
        <path d="M 58 158 Q 70 150 82 158" fill="none" stroke="#c0b0ff" strokeWidth="2" opacity="0.8" />
      </>
    ),
  };

  const cardContent = (
    <>
      {illustrations[card.id] ?? <rect width="140" height="220" rx="10" fill="#111" />}
      <rect x="4" y="4" width="132" height="212" rx="8" ry="8" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.6" />
      <rect x="15" y="10" width="110" height="18" rx="3" fill="#111" opacity="0.8" />
      <text x="70" y="22" textAnchor="middle" fill="#d4af37" fontSize="9" fontFamily="serif" letterSpacing="1" opacity="0.95">
        {card.name}
      </text>
      <rect x="15" y="192" width="110" height="18" rx="3" fill="#111" opacity="0.8" />
      <text x="70" y="204" textAnchor="middle" fill="#d4af37" fontSize="7" fontFamily="serif" letterSpacing="1" opacity="0.8">
        {card.nameEn}
      </text>
    </>
  );

  return (
    <svg
      viewBox="0 0 140 220"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "100%",
        height: "100%",
        transform: isReversed ? "rotate(180deg)" : "none",
      }}
    >
      {cardContent}
    </svg>
  );
}

// ============================================================
// Sparkle particle
// ============================================================

function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <div
      className="tarot-sparkle"
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        width: "6px",
        height: "6px",
        animationDelay: `${delay}s`,
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <svg viewBox="0 0 10 10" style={{ width: "100%", height: "100%" }}>
        <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4" fill="#d4af37" opacity="0.9" />
      </svg>
    </div>
  );
}

// ============================================================
// Tarot card selection
// ============================================================

type TarotPhase = "selecting" | "flipping" | "revealed";

function TarotSelection({
  onSelect,
}: {
  onSelect: (card: TarotCard, isReversed: boolean) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<TarotPhase>("selecting");
  const [showFront, setShowFront] = useState(false);
  const [burst, setBurst] = useState(false);
  const [cardIsReversed, setCardIsReversed] = useState(false);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Shuffle state
  const [shuffledCards, setShuffledCards] = useState<TarotCard[]>(() => {
    const arr = [...TAROT_CARDS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [isShuffling, setIsShuffling] = useState(false);
  const [scatterOffsets, setScatterOffsets] = useState<Array<{ x: number; y: number; r: number }>>([]);

  const doShuffle = useCallback(() => {
    if (isShuffling || phase !== "selecting") return;
    // scatter cards outward
    const offsets = TAROT_CARDS.map(() => ({
      x: (Math.random() - 0.5) * 220,
      y: -(Math.random() * 100 + 60),
      r: (Math.random() - 0.5) * 70,
    }));
    setScatterOffsets(offsets);
    setIsShuffling(true);
    // re-shuffle after scatter
    setTimeout(() => {
      const arr = [...TAROT_CARDS];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledCards(arr);
      setScatterOffsets([]);
      setTimeout(() => setIsShuffling(false), 350);
    }, 380);
  }, [isShuffling, phase]);

  useEffect(() => {
    return () => { timeoutRefs.current.forEach(clearTimeout); };
  }, []);

  const handleCardClick = (idx: number) => {
    if (phase !== "selecting") return;
    setSelected(idx);
    setPhase("flipping");

    // 30% chance of reversed
    const reversed = Math.random() < 0.3;
    setCardIsReversed(reversed);

    const t1 = setTimeout(() => setShowFront(true), 250);
    const t2 = setTimeout(() => { setBurst(true); setPhase("revealed"); }, 550);
    const t3 = setTimeout(() => onSelect(shuffledCards[idx], reversed), 1800);
    timeoutRefs.current = [t1, t2, t3];
  };

  // Drifting sparkles (float upward)
  const driftingSparkles = [
    { x: 8,  bottom: 20, d: 0,    dur: 3.0 },
    { x: 22, bottom: 15, d: 0.7,  dur: 2.8 },
    { x: 45, bottom: 10, d: 0.3,  dur: 3.4 },
    { x: 60, bottom: 18, d: 1.1,  dur: 2.6 },
    { x: 80, bottom: 12, d: 0.5,  dur: 3.2 },
    { x: 92, bottom: 22, d: 1.5,  dur: 2.9 },
  ];

  const sparkles = [
    { x: 10, y: 15, d: 0 }, { x: 85, y: 10, d: 0.4 }, { x: 5, y: 70, d: 0.8 },
    { x: 90, y: 75, d: 0.2 }, { x: 50, y: 5, d: 0.6 }, { x: 40, y: 90, d: 1.0 },
    { x: 70, y: 85, d: 0.3 }, { x: 20, y: 88, d: 0.7 }, { x: 78, y: 20, d: 0.5 },
  ];

  return (
    <div className="animate-fade-in text-center" style={{ position: "relative" }}>
      <SectionTitle en="TAROT" ja="タロットカードを引いてください" />
      <p className="text-xs opacity-40 mb-4 tracking-wider">
        7枚の中からあなたに呼ばれるカードを一枚選んでください
      </p>

      {/* Shuffle button */}
      {phase === "selecting" && (
        <div className="flex justify-center mb-6">
          <button
            onClick={doShuffle}
            disabled={isShuffling}
            style={{
              background: isShuffling
                ? "rgba(255,255,255,0.06)"
                : "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.35)",
              color: isShuffling ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)",
              padding: "8px 24px",
              borderRadius: "9999px",
              fontSize: "12px",
              letterSpacing: "0.18em",
              cursor: isShuffling ? "default" : "pointer",
              transition: "all 0.25s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                animation: isShuffling ? "shuffleIcon 0.5s linear infinite" : "none",
              }}
            >
              🔀
            </span>
            {isShuffling ? "シャッフル中..." : "シャッフル"}
          </button>
        </div>
      )}

      {/* Drifting sparkles (always visible while selecting) */}
      {phase === "selecting" && (
        <div style={{ position: "relative", pointerEvents: "none" }}>
          {driftingSparkles.map((s, i) => (
            <div
              key={i}
              className="sparkle-drift"
              style={{
                position: "absolute",
                left: `${s.x}%`,
                bottom: `${s.bottom}%`,
                width: "6px",
                height: "6px",
                animationDelay: `${s.d}s`,
                animationDuration: `${s.dur}s`,
                pointerEvents: "none",
                zIndex: 5,
              }}
            >
              <svg viewBox="0 0 10 10" style={{ width: "100%", height: "100%" }}>
                <polygon points="5,0 6,4 10,5 6,6 5,10 4,6 0,5 4,4" fill="#f472b6" opacity="0.8" />
              </svg>
            </div>
          ))}
        </div>
      )}

      <div style={{ position: "relative", height: "300px", marginBottom: "16px" }}>
        {sparkles.map((s, i) => (
          <Sparkle key={i} x={s.x} y={s.y} delay={s.d} />
        ))}

        {burst && (
          <>
            <div
              className="tarot-gold-burst"
              style={{
                position: "absolute",
                inset: "-40px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 30%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 20,
              }}
            />
            {/* Screen edge glow */}
            <div
              className="tarot-edge-glow"
              style={{
                position: "fixed",
                inset: 0,
                boxShadow: "inset 0 0 80px rgba(255,255,255,0.25)",
                pointerEvents: "none",
                zIndex: 25,
              }}
            />
          </>
        )}

        {/* Row 1: first 4 cards */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "0px",
          }}
        >
          {shuffledCards.slice(0, 4).map((card, rowIdx) => {
            const idx = rowIdx;
            const isSelected = selected === idx;
            const isOther = selected !== null && selected !== idx;
            const isHovered = hovered === idx && phase === "selecting";

            const fanX = (rowIdx - 1.5) * 20;
            const floatDelay = idx * 0.18;

            let cardTransform = `translateX(${fanX}px) rotate(${card.tilt}deg)`;
            if (isShuffling && scatterOffsets[idx]) {
              const s = scatterOffsets[idx];
              cardTransform = `translateX(${s.x}px) translateY(${s.y}px) rotate(${s.r}deg)`;
            } else if (isHovered) {
              cardTransform = `translateX(${fanX}px) rotate(${card.tilt * 0.5}deg) translateY(-20px)`;
            }
            if (isSelected && phase === "flipping") {
              cardTransform = `translateX(0px) rotate(0deg) translateY(-30px) rotateY(${showFront ? "0deg" : "90deg"})`;
            }
            if (isSelected && phase === "revealed") {
              cardTransform = `translateX(0px) rotate(0deg) translateY(-40px) rotateY(0deg)`;
            }

            return (
              <div
                key={card.id}
                className={phase === "selecting" && !isSelected ? "tarot-card-float" : ""}
                onClick={() => handleCardClick(idx)}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: "72px",
                  height: "115px",
                  position: "relative",
                  flexShrink: 0,
                  cursor: phase === "selecting" && !isShuffling ? "pointer" : "default",
                  transition: isShuffling
                    ? "transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.38s ease"
                    : phase === "selecting"
                    ? "transform 0.3s ease, box-shadow 0.3s ease, opacity 0.4s ease"
                    : "transform 0.5s ease, box-shadow 0.4s ease, opacity 0.4s ease",
                  transform: cardTransform,
                  animationDelay: `${floatDelay}s`,
                  opacity: isOther && phase === "revealed" ? 0 : isOther ? 0.3 : 1,
                  transformStyle: "preserve-3d",
                  zIndex: isSelected ? 10 : isHovered ? 5 : 1,
                  filter: isHovered
                    ? "drop-shadow(0 0 12px rgba(255,255,255,0.8))"
                    : isSelected && phase === "revealed"
                      ? "drop-shadow(0 0 20px rgba(255,255,255,0.9)) drop-shadow(0 0 40px rgba(255,255,255,0.4))"
                      : "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {isSelected && showFront ? (
                  <CardFrontSVG card={card} isReversed={cardIsReversed} />
                ) : (
                  <CardBackSVG />
                )}
              </div>
            );
          })}
        </div>

        {/* Row 2: last 3 cards */}
        <div
          style={{
            position: "absolute",
            top: "160px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: "0px",
          }}
        >
          {shuffledCards.slice(4).map((card, rowIdx) => {
            const idx = rowIdx + 4;
            const isSelected = selected === idx;
            const isOther = selected !== null && selected !== idx;
            const isHovered = hovered === idx && phase === "selecting";

            const fanX = (rowIdx - 1) * 20;
            const floatDelay = idx * 0.18;

            let cardTransform = `translateX(${fanX}px) rotate(${card.tilt}deg)`;
            if (isShuffling && scatterOffsets[idx]) {
              const s = scatterOffsets[idx];
              cardTransform = `translateX(${s.x}px) translateY(${s.y}px) rotate(${s.r}deg)`;
            } else if (isHovered) {
              cardTransform = `translateX(${fanX}px) rotate(${card.tilt * 0.5}deg) translateY(-20px)`;
            }
            if (isSelected && phase === "flipping") {
              cardTransform = `translateX(0px) rotate(0deg) translateY(-30px) rotateY(${showFront ? "0deg" : "90deg"})`;
            }
            if (isSelected && phase === "revealed") {
              cardTransform = `translateX(0px) rotate(0deg) translateY(-40px) rotateY(0deg)`;
            }

            return (
              <div
                key={card.id}
                className={phase === "selecting" && !isSelected ? "tarot-card-float" : ""}
                onClick={() => handleCardClick(idx)}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: "72px",
                  height: "115px",
                  position: "relative",
                  flexShrink: 0,
                  cursor: phase === "selecting" && !isShuffling ? "pointer" : "default",
                  transition: isShuffling
                    ? "transform 0.38s cubic-bezier(0.4,0,0.2,1), opacity 0.38s ease"
                    : phase === "selecting"
                    ? "transform 0.3s ease, box-shadow 0.3s ease, opacity 0.4s ease"
                    : "transform 0.5s ease, box-shadow 0.4s ease, opacity 0.4s ease",
                  transform: cardTransform,
                  animationDelay: `${floatDelay}s`,
                  opacity: isOther && phase === "revealed" ? 0 : isOther ? 0.3 : 1,
                  transformStyle: "preserve-3d",
                  zIndex: isSelected ? 10 : isHovered ? 5 : 1,
                  filter: isHovered
                    ? "drop-shadow(0 0 12px rgba(255,255,255,0.8))"
                    : isSelected && phase === "revealed"
                      ? "drop-shadow(0 0 20px rgba(255,255,255,0.9)) drop-shadow(0 0 40px rgba(255,255,255,0.4))"
                      : "drop-shadow(0 4px 8px rgba(0,0,0,0.5))",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {isSelected && showFront ? (
                  <CardFrontSVG card={card} isReversed={cardIsReversed} />
                ) : (
                  <CardBackSVG />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {phase === "revealed" && selected !== null && (
        <div className="animate-fade-in-up mt-4">
          <p className="text-xs tracking-widest opacity-40 mb-1">YOUR CARD</p>
          <p
            className="text-2xl font-light mb-1"
            style={{
              fontFamily: "var(--font-noto-serif-jp), serif",
              color: "#EDEDED",
            }}
          >
            {shuffledCards[selected].name}
          </p>
          {cardIsReversed && (
            <span
              className="inline-block text-xs px-3 py-1 rounded-full mb-1 font-bold"
              style={{
                background: "rgba(220,60,60,0.2)",
                border: "1px solid rgba(220,60,60,0.5)",
                color: "#ff8080",
              }}
            >
              逆位置
            </span>
          )}
          <p className="text-xs opacity-50 italic">
            {cardIsReversed ? shuffledCards[selected].reversedMeaning : shuffledCards[selected].meaning}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Gates Reveal Component — Yu-Gi-Oh Zexal style ornate doors
// ============================================================

function GatesReveal({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase]               = useState(0); // 0=idle,1=godRays,2=open,3=flood,4=angel
  const [gatesOpen, setGatesOpen]       = useState(false);
  const [showGodRays, setShowGodRays]   = useState(false);
  const [showFlood, setShowFlood]       = useState(false);
  const [showAngel, setShowAngel]       = useState(false);
  const [floodScale, setFloodScale]     = useState(0.1);
  const [feathers, setFeathers]         = useState<{ x: number; delay: number; drift: number }[]>([]);
  const [unmounted, setUnmounted]       = useState(false);

  useEffect(() => {
    // Generate feather particles
    setFeathers([
      { x: 45, delay: 0,   drift: -8 },
      { x: 52, delay: 200, drift: 6  },
      { x: 48, delay: 400, drift: -4 },
      { x: 55, delay: 100, drift: 10 },
      { x: 42, delay: 300, drift: -6 },
      { x: 50, delay: 500, drift: 4  },
    ]);

    // Phase 0→1: soft center pulse (0ms), then god rays at 200ms
    const t1 = setTimeout(() => { setPhase(1); setShowGodRays(true); }, 200);
    // Phase 2: gates open at 400ms
    const t2 = setTimeout(() => { setPhase(2); setGatesOpen(true); }, 400);
    // Phase 3: divine light flood begins at 500ms, expands
    const t3 = setTimeout(() => { setPhase(3); setShowFlood(true); setFloodScale(0.1); }, 500);
    const t3b = setTimeout(() => setFloodScale(1), 520);
    // Phase 4: angel silhouette at 1000ms
    const t4 = setTimeout(() => { setPhase(4); setShowAngel(true); }, 1000);
    const t4b = setTimeout(() => setShowAngel(false), 1600);
    // Signal results at 1600ms
    const t5 = setTimeout(() => onComplete(), 1600);
    // Flood fades, god rays fade after results
    const t6 = setTimeout(() => setShowFlood(false), 2000);
    const t7 = setTimeout(() => setShowGodRays(false), 2200);
    // Unmount
    const t8 = setTimeout(() => setUnmounted(true), 2400);

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
      clearTimeout(t3b); clearTimeout(t4); clearTimeout(t4b);
      clearTimeout(t5); clearTimeout(t6); clearTimeout(t7);
      clearTimeout(t8);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (unmounted) return null;

  void phase; // used only for future phase checks; state is set but drives CSS

  const gateTransition = gatesOpen
    ? "transform 1200ms cubic-bezier(0.76, 0, 0.24, 1)"
    : "none";

  // God ray angles
  const godRayAngles = [-60, -40, -20, 0, 20, 40, 60];

  return (
    <>
      <style>{`
        @keyframes divineFloodExpand {
          0%   { opacity: 0; transform: scale(0.1); }
          15%  { opacity: 1; }
          80%  { opacity: 0.9; }
          100% { opacity: 0; transform: scale(1); }
        }
        @keyframes godRayAppear {
          0%   { opacity: 0; transform: translateX(-50%) scaleX(0); }
          100% { opacity: 1; transform: translateX(-50%) scaleX(1); }
        }
        @keyframes godRayFade {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes angelAppear {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.85); }
          40%  { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          70%  { opacity: 1; }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(1.05); }
        }
        @keyframes featherDrift {
          0%   { opacity: 0; transform: translateY(0) rotate(0deg); }
          15%  { opacity: 0.7; }
          80%  { opacity: 0.4; }
          100% { opacity: 0; transform: translateY(-120px) rotate(20deg); }
        }
        @keyframes centerSeamGlow {
          0%, 100% { box-shadow: 0 0 18px 4px rgba(255,255,255,0.5); }
          50%       { box-shadow: 0 0 32px 8px rgba(255,253,200,0.8); }
        }
        @keyframes centerPulse {
          0%   { opacity: 0; transform: translate(-50%,-50%) scale(0.5); }
          50%  { opacity: 0.3; transform: translate(-50%,-50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%,-50%) scale(1.5); }
        }
      `}</style>

      {/* ── Overall wrapper ── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 80,
          pointerEvents: "none",
          background: gatesOpen ? "rgba(255,253,245,0.97)" : "transparent",
          transition: "background 800ms ease",
        }}
      >
        {/* ── Left gate — divine ivory/gold ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            background: "linear-gradient(to right, #fffdf5 0%, #fef9e7 40%, #fdf6d3 70%, #fef3c0 100%)",
            willChange: "transform",
            transition: gateTransition,
            transform: gatesOpen ? "translateX(-100%)" : "translateX(0)",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          {/* Lace crosshatch overlay */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="laceL" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="8" y2="8" stroke="white" strokeWidth="0.5"/>
                <line x1="8" y1="0" x2="0" y2="8" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#laceL)"/>
          </svg>

          {/* SVG: wing + gold decorations */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wingGradL" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)"/>
                <stop offset="100%" stopColor="rgba(255,245,200,0.05)"/>
              </linearGradient>
            </defs>
            {/* Feathered wing (inner half, right wing half pointing toward center) */}
            <path
              d="M 95 50 C 82 22, 55 6, 22 16 C 12 26, 16 44, 30 50 C 16 56, 12 72, 22 82 C 55 94, 82 78, 95 50 Z"
              fill="url(#wingGradL)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="0.5"
            />
            {/* Wing feather detail lines */}
            <path d="M 95 50 C 75 35, 45 28, 22 34" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4"/>
            <path d="M 95 50 C 75 44, 45 41, 22 44" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4"/>
            <path d="M 95 50 C 75 57, 45 59, 22 58" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4"/>
            <path d="M 95 50 C 75 64, 45 68, 22 68" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4"/>
            {/* Horizontal gold divider lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4"/>
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5"/>
            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4"/>
            {/* Inner edge gold strip */}
            <rect x="96" y="0" width="4" height="100" fill="rgba(255,255,255,0.7)"/>
            <line x1="94" y1="0" x2="94" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3"/>
          </svg>

          {/* 真実 (Truth) faint kanji */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "80px",
              color: "white",
              opacity: 0.12,
              fontFamily: "serif",
              fontWeight: 300,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            真実
          </div>
        </div>

        {/* ── Right gate — mirror ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            background: "linear-gradient(to left, #fffdf5 0%, #fef9e7 40%, #fdf6d3 70%, #fef3c0 100%)",
            willChange: "transform",
            transition: gateTransition,
            transform: gatesOpen ? "translateX(100%)" : "translateX(0)",
            overflow: "hidden",
            pointerEvents: "auto",
          }}
        >
          {/* Lace crosshatch overlay */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.08 }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern id="laceR" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="8" y2="8" stroke="white" strokeWidth="0.5"/>
                <line x1="8" y1="0" x2="0" y2="8" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100" height="100" fill="url(#laceR)"/>
          </svg>

          {/* SVG: wing + gold decorations */}
          <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="wingGradR" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)"/>
                <stop offset="100%" stopColor="rgba(255,245,200,0.05)"/>
              </linearGradient>
            </defs>
            {/* Feathered wing (left wing half pointing toward center) */}
            <path
              d="M 5 50 C 18 22, 45 6, 78 16 C 88 26, 84 44, 70 50 C 84 56, 88 72, 78 82 C 45 94, 18 78, 5 50 Z"
              fill="url(#wingGradR)"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="0.5"
            />
            {/* Wing feather detail lines */}
            <path d="M 5 50 C 25 35, 55 28, 78 34" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4"/>
            <path d="M 5 50 C 25 44, 55 41, 78 44" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4"/>
            <path d="M 5 50 C 25 57, 55 59, 78 58" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4"/>
            <path d="M 5 50 C 25 64, 55 68, 78 68" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4"/>
            {/* Horizontal gold divider lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4"/>
            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.55)" strokeWidth="0.5"/>
            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.45)" strokeWidth="0.4"/>
            {/* Inner edge gold strip */}
            <rect x="0" y="0" width="4" height="100" fill="rgba(255,255,255,0.7)"/>
            <line x1="6" y1="0" x2="6" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3"/>
          </svg>

          {/* 覚醒 (Awakening) faint kanji */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "80px",
              color: "white",
              opacity: 0.12,
              fontFamily: "serif",
              fontWeight: 300,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            覚醒
          </div>
        </div>

        {/* ── Center seam golden glow (before open) ── */}
        {!gatesOpen && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "6px",
              height: "100%",
              background: "linear-gradient(180deg, transparent, rgba(255,253,200,0.9), rgba(255,255,255,1), rgba(255,253,200,0.9), transparent)",
              filter: "blur(2px)",
              zIndex: 2,
              animation: "centerSeamGlow 1.5s ease-in-out infinite",
            }}
          />
        )}

        {/* ── Phase 0 soft center pulse ── */}
        {!gatesOpen && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "200px",
              height: "200px",
              marginLeft: "-100px",
              marginTop: "-100px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,253,230,0.4), transparent 70%)",
              zIndex: 2,
              animation: "centerPulse 200ms ease forwards",
            }}
          />
        )}

        {/* ── God rays (fan from center) ── */}
        {showGodRays && godRayAngles.map((angle, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "3px",
              height: "120vh",
              transformOrigin: "top center",
              transform: `translateX(-50%) rotate(${angle}deg)`,
              background: "linear-gradient(to bottom, rgba(255,245,180,0.7), transparent)",
              zIndex: 6,
              pointerEvents: "none",
              animationName: showGodRays
                ? (gatesOpen ? "godRayFade" : "godRayAppear")
                : "none",
              animationDuration: showGodRays ? (gatesOpen ? "600ms" : "200ms") : "0s",
              animationTimingFunction: "ease",
              animationFillMode: "forwards",
              animationDelay: `${i * 30}ms`,
            }}
          />
        ))}

        {/* ── Divine light flood (radial, expanding) ── */}
        {showFlood && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "200vw",
              height: "200vh",
              marginLeft: "-100vw",
              marginTop: "-100vh",
              borderRadius: "50%",
              background: "radial-gradient(ellipse 100vw 100vh at center, rgba(255,253,230,0.95) 0%, rgba(255,245,180,0.7) 15%, rgba(255,255,255,0.4) 35%, rgba(232,160,191,0.2) 60%, transparent 80%)",
              zIndex: 5,
              pointerEvents: "none",
              transform: `scale(${floodScale})`,
              transition: "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
              animation: "divineFloodExpand 1800ms ease forwards",
            }}
          />
        )}

        {/* ── Angel silhouette at center ── */}
        {showAngel && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: 8,
              animation: "angelAppear 600ms ease forwards",
              pointerEvents: "none",
            }}
          >
            <svg
              width="120"
              height="160"
              viewBox="0 0 120 160"
              fill="none"
              style={{ filter: "drop-shadow(0 0 20px rgba(255,253,200,0.9))" }}
            >
              {/* Halo */}
              <ellipse cx="60" cy="18" rx="22" ry="7" fill="none" stroke="rgba(255,253,200,0.9)" strokeWidth="2"/>
              {/* Head */}
              <circle cx="60" cy="35" r="13" fill="none" stroke="rgba(255,253,200,0.85)" strokeWidth="1.5"/>
              {/* Body */}
              <path d="M 60 48 L 60 110" stroke="rgba(255,253,200,0.8)" strokeWidth="2" strokeLinecap="round"/>
              {/* Arms */}
              <path d="M 30 75 Q 45 65 60 70 Q 75 65 90 75" fill="none" stroke="rgba(255,253,200,0.8)" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Robe/skirt */}
              <path d="M 45 95 L 35 140 M 60 110 L 60 145 M 75 95 L 85 140" stroke="rgba(255,253,200,0.7)" strokeWidth="1.2" strokeLinecap="round"/>
              {/* Left wing */}
              <path d="M 48 60 C 20 45, 5 35, 10 55 C 5 65, 15 80, 40 78 C 15 88, 8 100, 18 108 C 35 118, 50 100, 55 90"
                fill="rgba(255,253,200,0.08)" stroke="rgba(255,253,200,0.7)" strokeWidth="1.2"/>
              {/* Right wing */}
              <path d="M 72 60 C 100 45, 115 35, 110 55 C 115 65, 105 80, 80 78 C 105 88, 112 100, 102 108 C 85 118, 70 100, 65 90"
                fill="rgba(255,253,200,0.08)" stroke="rgba(255,253,200,0.7)" strokeWidth="1.2"/>
            </svg>
          </div>
        )}

        {/* ── Feather particles (drift upward) ── */}
        {feathers.map((f, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${f.x}%`,
              bottom: "40%",
              zIndex: 7,
              pointerEvents: "none",
              animationName: "featherDrift",
              animationDuration: "2s",
              animationTimingFunction: "ease-out",
              animationFillMode: "forwards",
              animationDelay: `${f.delay}ms`,
            }}
          >
            <svg
              width="12"
              height="20"
              viewBox="0 0 12 20"
              style={{ transform: `rotate(${f.drift}deg)` }}
            >
              <ellipse cx="6" cy="10" rx="3.5" ry="9" fill="rgba(255,253,230,0.6)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.5"/>
              <line x1="6" y1="1" x2="6" y2="19" stroke="rgba(255,255,255,0.5)" strokeWidth="0.5"/>
            </svg>
          </div>
        ))}
      </div>
    </>
  );
}

// ============================================================
// Accordion components for strengths & challenges
// ============================================================

function StrengthsAccordion({
  strengths,
  sectionStyle,
}: {
  strengths: StrengthItem[];
  sectionStyle: React.CSSProperties;
}) {
  const [open, setOpen] = useState<boolean[]>(strengths.map(() => false));

  const toggle = (i: number) => {
    setOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <div className="mb-5" style={sectionStyle}>
      <p className="text-xs tracking-widest opacity-40 mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>✦ あなたの強み</p>
      <div className="space-y-2">
        {strengths.map((s, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{
              border: "1px solid rgba(52,211,153,0.3)",
              background: "rgba(52,211,153,0.06)",
            }}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left"
              style={{ color: "#6ee7b7" }}
            >
              <span className="flex items-center gap-2 text-xs font-medium">
                <span style={{ color: "#34d399", flexShrink: 0 }}>✓</span>
                {s.title}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  transition: "transform 0.25s ease",
                  transform: open[i] ? "rotate(180deg)" : "rotate(0deg)",
                  flexShrink: 0,
                  opacity: 0.6,
                }}
              >
                ▼
              </span>
            </button>
            <div
              style={{
                maxHeight: open[i] ? "200px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              <p
                className="px-3 pb-3 text-xs leading-relaxed"
                style={{ color: "rgba(110,231,183,0.8)", borderTop: "1px solid rgba(52,211,153,0.15)" }}
              >
                {s.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChallengesAccordion({
  challenges,
  sectionStyle,
}: {
  challenges: ChallengeItem[];
  sectionStyle: React.CSSProperties;
}) {
  const [open, setOpen] = useState<boolean[]>(challenges.map(() => false));

  const toggle = (i: number) => {
    setOpen((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    <div className="mb-5" style={sectionStyle}>
      <p className="text-xs tracking-widest opacity-40 mb-3" style={{ color: "#f472b6" }}>✦ 成長のヒント（盲点）</p>
      <div className="space-y-2">
        {challenges.map((c, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden"
            style={{
              border: "1px solid rgba(244,114,182,0.2)",
              background: "rgba(244,114,182,0.06)",
            }}
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left"
              style={{ color: "rgba(240,230,211,0.8)" }}
            >
              <span className="flex items-center gap-2 text-xs font-medium">
                <span style={{ color: "#f472b6", flexShrink: 0 }}>△</span>
                {c.title}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  transition: "transform 0.25s ease",
                  transform: open[i] ? "rotate(180deg)" : "rotate(0deg)",
                  flexShrink: 0,
                  opacity: 0.5,
                }}
              >
                ▼
              </span>
            </button>
            <div
              style={{
                maxHeight: open[i] ? "200px" : "0",
                overflow: "hidden",
                transition: "max-height 0.3s ease",
              }}
            >
              <p
                className="px-3 pb-3 text-xs leading-relaxed"
                style={{ color: "rgba(240,230,211,0.6)", borderTop: "1px solid rgba(244,114,182,0.12)" }}
              >
                {c.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Results Page (Change 4)
// ============================================================

// ============================================================
// Share Card Modal (Improvement 3)
// ============================================================

function ShareCardModal({
  mbtiType,
  trueSelfMbti,
  loveType,
  tarotCard,
  tarotIsReversed,
  zodiac,
  title,
  description,
  onClose,
}: {
  mbtiType: string;
  trueSelfMbti: string | null;
  loveType: LoveType;
  tarotCard: TarotCard;
  tarotIsReversed: boolean;
  zodiac: string;
  title: string;
  description: string;
  onClose: () => void;
}) {
  const displayMBTI = trueSelfMbti ?? mbtiType;
  const loveInfo = loveTypeDescriptions[loveType];
  const mbtiColor = getMbtiColor(displayMBTI);
  const [textCopied, setTextCopied] = useState(false);

  // Get first sentence of description (strip HTML tags)
  const plainDesc = description.replace(/<[^>]+>/g, "").split(/[。！？]/)[0] + "。";

  const handleCopyText = async () => {
    const text = `✨ revelaで自己分析しました ✨\n\n🧠 ${displayMBTI} — ${mbtiColor.label}\n✦ ${loveInfo.nickname}（${loveType}）\n⭐ ${zodiac}\n🔮 ${tarotCard.name}${tarotIsReversed ? "（逆位置）" : ""}\n\n「${title}」\n\nrevela.jp で無料診断 ✦\n#revela #MBTI診断 #自己分析`;
    try {
      await navigator.clipboard.writeText(text);
      setTextCopied(true);
      setTimeout(() => setTextCopied(false), 2500);
    } catch { /* silent */ }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "360px",
          background: "linear-gradient(145deg, #0d0b2b 0%, #1a0a3d 60%, #0d0b2b 100%)",
          border: "1.5px solid rgba(255,255,255,0.6)",
          borderRadius: "20px",
          padding: "28px 24px",
          boxShadow: "0 0 60px rgba(255,255,255,0.15), inset 0 0 40px rgba(255,255,255,0.03)",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Corner decorations */}
        <div style={{ position: "absolute", top: 10, left: 10, width: 20, height: 20, borderTop: "1.5px solid rgba(255,255,255,0.6)", borderLeft: "1.5px solid rgba(255,255,255,0.6)" }} />
        <div style={{ position: "absolute", top: 10, right: 10, width: 20, height: 20, borderTop: "1.5px solid rgba(255,255,255,0.6)", borderRight: "1.5px solid rgba(255,255,255,0.6)" }} />
        <div style={{ position: "absolute", bottom: 10, left: 10, width: 20, height: 20, borderBottom: "1.5px solid rgba(255,255,255,0.6)", borderLeft: "1.5px solid rgba(255,255,255,0.6)" }} />
        <div style={{ position: "absolute", bottom: 10, right: 10, width: 20, height: 20, borderBottom: "1.5px solid rgba(255,255,255,0.6)", borderRight: "1.5px solid rgba(255,255,255,0.6)" }} />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <p
            style={{
              fontSize: "22px",
              fontFamily: "var(--font-noto-serif-jp), serif",
              fontWeight: 300,
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            revela
          </p>
          <p style={{ fontSize: "9px", letterSpacing: "0.3em", opacity: 0.5, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
            self analysis
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)", marginBottom: "16px" }} />

        {/* 5 chips */}
        {(() => {
          const rpgChip = getRpgClassByCombo(displayMBTI, loveType);
          const chips = [
            { label: "MBTI", value: displayMBTI, sub: mbtiColor.label, color: mbtiColor.primary, bg: mbtiColor.bg, span: false },
            { label: "CODE", value: loveType, sub: loveInfo.nickname, color: "#e8a0bf", bg: "rgba(232,160,191,0.12)", span: false },
            { label: "星座", value: zodiac === "なし" ? "—" : zodiac, sub: "", color: "#93c5fd", bg: "rgba(147,197,253,0.08)", span: false },
            { label: "タロット", value: tarotCard.name, sub: tarotIsReversed ? "逆位置" : "正位置", color: "#c084fc", bg: "rgba(192,132,252,0.08)", span: false },
            { label: "職業RPG", value: rpgChip ? `${rpgChip.emoji} ${rpgChip.name}` : "—", sub: rpgChip?.tagline ?? "", color: "#7c3aed", bg: "rgba(124,58,237,0.08)", span: true },
          ];
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "16px" }}>
              {chips.map((chip) => (
                <div
                  key={chip.label}
                  style={{
                    background: chip.bg,
                    border: `1px solid ${chip.color}33`,
                    borderRadius: "12px",
                    padding: "10px 8px",
                    textAlign: "center",
                    gridColumn: chip.span ? "1 / -1" : undefined,
                  }}
                >
                  <p style={{ fontSize: "8px", opacity: 0.5, letterSpacing: "0.15em", marginBottom: "4px" }}>{chip.label}</p>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: chip.color, lineHeight: 1.2 }}>{chip.value}</p>
                  {chip.sub && <p style={{ fontSize: "9px", opacity: 0.6, marginTop: "2px" }}>{chip.sub}</p>}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <p
            style={{
              fontSize: "15px",
              fontFamily: "var(--font-noto-serif-jp), serif",
              fontWeight: 400,
              color: "#EDEDED",
              lineHeight: 1.5,
            }}
          >
            {title}
          </p>
        </div>

        {/* Description snippet */}
        <p
          style={{
            fontSize: "11px",
            lineHeight: 1.7,
            opacity: 0.65,
            textAlign: "center",
            marginBottom: "16px",
            fontFamily: "var(--font-noto-serif-jp), serif",
          }}
        >
          {plainDesc}
        </p>

        {/* Divider */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)", marginBottom: "12px" }} />

        {/* Footer */}
        <p style={{ fontSize: "9px", textAlign: "center", letterSpacing: "0.15em", opacity: 0.4, color: "rgba(255,255,255,0.55)", marginBottom: "16px" }}>
          revela.jp で無料診断 ✦
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            onClick={handleCopyText}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              background: textCopied ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(255,255,255,0.08)",
              color: "#0a0a0a",
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {textCopied ? "✓ コピーしました！" : "テキストをコピー"}
          </button>
          <p style={{ fontSize: "9px", textAlign: "center", opacity: 0.35, letterSpacing: "0.08em" }}>
            スクリーンショットで画像として保存できます
          </p>
          <button
            onClick={onClose}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "9999px",
              fontSize: "11px",
              letterSpacing: "0.1em",
              background: "transparent",
              color: "rgba(240,230,211,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}

const MBTI_ADJ: Record<string, string> = {
  ENFP: "自由奔放な",  ENFJ: "カリスマ的な",  ENTP: "革新的な",   ENTJ: "指導力あふれる",
  INFP: "繊細な",      INFJ: "洞察力あふれる", INTP: "論理的な",   INTJ: "戦略的な",
  ESFP: "陽気な",      ESFJ: "思いやりあふれる", ESTP: "行動的な", ESTJ: "実直な",
  ISFP: "芸術的な",    ISFJ: "献身的な",       ISTP: "冷静沈着な", ISTJ: "誠実な",
};

const YGO_ATK: Record<string, number> = {
  LCRO: 2800, LCRE: 2400, LCPO: 3000, LCPE: 2600,
  LARO: 2500, LARE: 2700, LAPO: 2300, LAPE: 2900,
  FCRO: 2200, FCRE: 1900, FCPO: 2100, FCPE: 2000,
  FARO: 1800, FARE: 1700, FAPO: 2000, FAPE: 1600,
};
const YGO_DEF: Record<string, number> = {
  LCRO: 1500, LCRE: 2000, LCPO: 1200, LCPE: 1800,
  LARO: 2200, LARE: 1900, LAPO: 2400, LAPE: 2000,
  FCRO: 2600, FCRE: 2800, FCPO: 2400, FCPE: 2500,
  FARO: 3000, FARE: 2800, FAPO: 2600, FAPE: 3200,
};

function ResultsPage({
  data,
  mbtiType,
  trueSelfMbti,
  loveType,
  tarotCard,
  tarotIsReversed,
  onReset,
  gatesComplete,
}: {
  data: FormData;
  mbtiType: string;
  trueSelfMbti: string | null;
  loveType: LoveType;
  tarotCard: TarotCard;
  tarotIsReversed: boolean;
  onReset: () => void;
  gatesComplete: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [statsRank, setStatsRank] = useState<{ mbtiRank: number; total: number } | null>(null);
  const [rankingToast, setRankingToast] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [savingImage, setSavingImage] = useState(false);
  const [imgAttempt, setImgAttempt] = useState(0);

  const reading: ResultReading = getResultReading(mbtiType, loveType, data.zodiac, tarotCard.name, tarotIsReversed);
  const mbtiInfo = mbtiDescriptions[mbtiType];
  const loveInfo = loveTypeDescriptions[loveType];
  const zodiacData = data.zodiac !== "なし" ? zodiacInfo[data.zodiac] : null;
  const mbtiColors = getMbtiColor(mbtiType);

  const displayMBTI = trueSelfMbti ? trueSelfMbti : mbtiType;
  const displayMBTIInfo = mbtiDescriptions[displayMBTI];
  const displayColors = getMbtiColor(displayMBTI);

  useEffect(() => {
    if (gatesComplete) {
      const t = setTimeout(() => setResultsVisible(true), 50);
      return () => clearTimeout(t);
    }
  }, [gatesComplete]);

  useEffect(() => {
    fetchDiagnosisStats().then((stats) => {
      const finalMBTI = trueSelfMbti ?? mbtiType;
      const rank = stats.mbtiRanking.findIndex((r) => r.type === finalMBTI) + 1;
      if (rank > 0 && stats.total > 0) {
        setStatsRank({ mbtiRank: rank, total: stats.total });
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    saveHistoryEntry({
      date: dateStr,
      mbti: mbtiType,
      trueSelfMbti: trueSelfMbti ?? undefined,
      loveType,
      zodiac: data.zodiac || undefined,
      tarot: tarotCard.name,
      isReversed: tarotIsReversed,
      description: reading.description,
    });
    trackDiagnosisResult({
      mbti: trueSelfMbti ?? mbtiType,
      loveType,
      zodiac: data.zodiac || undefined,
    });
    setTimeout(() => {
      setRankingToast(true);
      setTimeout(() => setRankingToast(false), 4000);
    }, 1500);
    // Save revela code to localStorage for the aisei page
    const finalMBTI = trueSelfMbti ?? mbtiType;
    try {
      localStorage.setItem("revela_user", JSON.stringify({ mbti: finalMBTI }));
      if (data.zodiac && data.zodiac !== "なし") {
        const code = generateRevelaCode(finalMBTI, loveType, data.zodiac);
        localStorage.setItem("revela_mycode", code);
      }
    } catch {
      // ignore if localStorage is unavailable
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const descParts = reading.description.split(/(?=<span class="result-section-label">)/g).filter(Boolean);

  const buildShareText = () => {
    const mbtiLabel = trueSelfMbti ? `${mbtiType}→${trueSelfMbti}` : mbtiType;
    const tarotLabel = tarotIsReversed ? `${tarotCard.name}（逆位置）` : tarotCard.name;
    const strength0 = reading.strengths[0]?.title ?? "";
    const strength1 = reading.strengths[1]?.title ?? "";
    const strengthStr = strength1 ? `${strength0} / ${strength1}` : strength0;
    return `✨ revelaで自己分析しました ✨\n\n🧠 ${mbtiLabel}（${displayMBTIInfo?.title || ""}）\n✦ ${loveInfo.nickname}（${loveType}）\n⭐ ${data.zodiac}\n🔮 ${tarotLabel}\n\n📊 あなたの自己分析\n強み: ${strengthStr}\n\n🔗 revela.jp/shindan で無料診断\n#revela #MBTI診断 #自己分析 #キャラクターコード`;
  };

  const handleShare = async () => {
    const text = buildShareText();
    try {
      if (navigator.share) {
        await navigator.share({ text, url: "https://revela.jp/shindan" });
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setToastVisible(true);
        setTimeout(() => { setCopied(false); setToastVisible(false); }, 2500);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setToastVisible(true);
        setTimeout(() => { setCopied(false); setToastVisible(false); }, 2500);
      } catch { /* silent */ }
    }
  };

  const handleTwitterShare = () => {
    const text = buildShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleLineShare = () => {
    const shareUrl = "https://revela.blog/shindan";
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSave = async () => {
    const text = `【revela 自己分析】\n\nMBTI: ${displayMBTI}（${displayMBTIInfo?.title || ""}）\nキャラクターコード: ${loveInfo.nickname}（${loveType}）\n${loveInfo.motto}\n星座: ${data.zodiac}\nタロット: ${tarotCard.name}${tarotIsReversed ? "（逆位置）" : ""}\n\n「${reading.title}」\n\n${reading.advice}`;
    try {
      await navigator.clipboard.writeText(text);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    } catch { /* silent */ }
  };

  const handleSaveImage = () => {
    setSavingImage(true);
    setTimeout(() => {
      try {
        const W = 600;
        const H = 900;
        const canvas = document.createElement("canvas");
        canvas.width = W;
        canvas.height = H;
        const ctx = canvas.getContext("2d");
        if (!ctx) { setSavingImage(false); return; }

        // ── background gradient ──
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, "#0a0a0a");
        bg.addColorStop(0.5, "#0a0a0a");
        bg.addColorStop(1, "#1a1a1a");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // ── starfield dots ──
        const stars = [[60,80],[180,40],[320,90],[480,55],[540,130],[90,200],[410,170],[150,350],[520,300],[280,430],[70,500],[460,480],[200,620],[380,590],[500,700]];
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        stars.forEach(([sx, sy]) => { ctx.beginPath(); ctx.arc(sx, sy, 1.2, 0, Math.PI * 2); ctx.fill(); });

        // ── outer gold border ──
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(14, 14, W - 28, H - 28);
        // inner border
        ctx.strokeStyle = "rgba(255,255,255,0.18)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(20, 20, W - 40, H - 40);

        // ── corner ornaments ──
        const corners = [[28,28],[W-28,28],[28,H-28],[W-28,H-28]];
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        corners.forEach(([cx2, cy2]) => { ctx.beginPath(); ctx.arc(cx2, cy2, 3, 0, Math.PI * 2); ctx.fill(); });

        // ── "revela" logo ──
        ctx.font = "bold 22px serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#d4af37";
        ctx.fillText("revela", W / 2, 68);
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText("本当の自分を知る", W / 2, 86);

        // ── horizontal divider ──
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(60, 100); ctx.lineTo(W - 60, 100); ctx.stroke();

        // ── MBTI block ──
        ctx.fillStyle = displayColors.primary + "22";
        ctx.fillRect(W / 2 - 110, 118, 220, 80);
        ctx.strokeStyle = displayColors.primary + "66";
        ctx.lineWidth = 1;
        ctx.strokeRect(W / 2 - 110, 118, 220, 80);
        ctx.font = "10px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.textAlign = "center";
        ctx.fillText("MBTI", W / 2, 138);
        ctx.font = "bold 40px sans-serif";
        ctx.fillStyle = displayColors.primary;
        ctx.fillText(displayMBTI, W / 2, 178);
        if (displayMBTIInfo?.title) {
          ctx.font = "13px sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.55)";
          ctx.fillText(displayMBTIInfo.title, W / 2, 196);
        }

        // ── キャラクターコード block ──
        ctx.fillStyle = "rgba(232,160,191,0.12)";
        ctx.fillRect(40, 222, 240, 68);
        ctx.strokeStyle = "rgba(232,160,191,0.3)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(40, 222, 240, 68);
        ctx.font = "9px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.textAlign = "center";
        ctx.fillText("CHARACTER CODE", 160, 242);
        ctx.font = "bold 15px serif";
        ctx.fillStyle = "#e8a0bf";
        ctx.fillText(loveInfo.nickname, 160, 264);
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fillText(loveType, 160, 282);

        // ── 星座 block ──
        ctx.fillStyle = "rgba(147,197,253,0.10)";
        ctx.fillRect(320, 222, 240, 68);
        ctx.strokeStyle = "rgba(147,197,253,0.25)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(320, 222, 240, 68);
        ctx.font = "9px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.textAlign = "center";
        ctx.fillText("ZODIAC", 440, 242);
        ctx.font = "bold 22px serif";
        ctx.fillStyle = "#93c5fd";
        ctx.fillText(data.zodiac !== "なし" ? data.zodiac : "—", 440, 268);
        if (data.zodiac !== "なし" && zodiacData) {
          ctx.font = "11px sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.45)";
          ctx.fillText(zodiacData.element || "", 440, 283);
        }

        // ── タロット block ──
        ctx.fillStyle = "rgba(139,92,246,0.12)";
        ctx.fillRect(40, 312, 520, 68);
        ctx.strokeStyle = "rgba(139,92,246,0.3)";
        ctx.lineWidth = 0.8;
        ctx.strokeRect(40, 312, 520, 68);
        ctx.font = "9px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.textAlign = "center";
        ctx.fillText("TAROT", W / 2, 332);
        ctx.font = "bold 22px serif";
        ctx.fillStyle = "#c4b5fd";
        ctx.fillText(tarotCard.name + (tarotIsReversed ? "（逆位置）" : ""), W / 2, 358);
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.fillText(tarotIsReversed ? tarotCard.reversedMeaning : tarotCard.meaning, W / 2, 374);

        // ── divider ──
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(60, 400); ctx.lineTo(W - 60, 400); ctx.stroke();

        // ── reading title ──
        ctx.font = "bold 20px serif";
        ctx.fillStyle = "#d4af37";
        ctx.textAlign = "center";
        ctx.fillText(`「${reading.title}」`, W / 2, 438);

        // ── description (wrapped) ──
        ctx.font = "13px serif";
        ctx.fillStyle = "rgba(245,238,232,0.82)";
        const words = reading.description;
        const lineW = W - 100;
        const lineH = 22;
        let y = 470;
        let line = "";
        for (let i = 0; i < words.length; i++) {
          const ch = words[i];
          const test = line + ch;
          if (ctx.measureText(test).width > lineW) {
            ctx.fillText(line, W / 2, y);
            y += lineH;
            line = ch;
            if (y > 640) { ctx.fillText("…", W / 2, y); break; }
          } else {
            line = test;
          }
        }
        if (line && y <= 640) ctx.fillText(line, W / 2, y);

        // ── revela code (if available) ──
        const finalMBTI2 = trueSelfMbti ?? displayMBTI;
        if (data.zodiac && data.zodiac !== "なし") {
          const code = generateRevelaCode(finalMBTI2, loveType, data.zodiac);
          ctx.fillStyle = "rgba(255,255,255,0.08)";
          ctx.fillRect(W / 2 - 160, 670, 320, 44);
          ctx.strokeStyle = "rgba(255,255,255,0.3)";
          ctx.lineWidth = 0.8;
          ctx.strokeRect(W / 2 - 160, 670, 320, 44);
          ctx.font = "9px sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.5)";
          ctx.textAlign = "center";
          ctx.fillText("REVELA CODE", W / 2, 688);
          ctx.font = "bold 17px monospace";
          ctx.fillStyle = "#d4af37";
          ctx.fillText(code, W / 2, 707);
        }

        // ── bottom divider + footer ──
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(60, 790); ctx.lineTo(W - 60, 790); ctx.stroke();
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.textAlign = "center";
        ctx.fillText("revela.jp | 本当の自分を知る", W / 2, 820);

        const link = document.createElement("a");
        link.download = `revela-${displayMBTI}-${loveType}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch (e) {
        console.error(e);
      } finally {
        setSavingImage(false);
      }
    }, 50);
  };

  const sectionStyle = (delay: number): React.CSSProperties => ({
    opacity: resultsVisible ? 1 : 0,
    transform: resultsVisible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
  });

  return (
    <div className="max-w-lg mx-auto" style={{ position: "relative" }}>
      {/* Share Card Modal */}
      {showShareCard && (
        <ShareCardModal
          mbtiType={mbtiType}
          trueSelfMbti={trueSelfMbti}
          loveType={loveType}
          tarotCard={tarotCard}
          tarotIsReversed={tarotIsReversed}
          zodiac={data.zodiac}
          title={reading.title}
          description={reading.description}
          onClose={() => setShowShareCard(false)}
        />
      )}

      {/* Toast */}
      {toastVisible && (
        <div
          style={{
            position: "fixed",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 200,
            background: "rgba(255,255,255,0.95)",
            color: "#0a0a0a",
            padding: "10px 24px",
            borderRadius: 9999,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            boxShadow: "0 4px 20px rgba(255,255,255,0.4)",
            animation: "fadeIn 0.3s ease",
          }}
        >
          ✓ コピーしました！
        </div>
      )}

      {/* Ranking toast */}
      {rankingToast && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          zIndex: 300, background: "rgba(20,20,28,0.95)", color: "rgba(255,255,255,0.6)",
          padding: "10px 20px", borderRadius: 9999, fontSize: 11,
          border: "1px solid rgba(255,255,255,0.12)", whiteSpace: "nowrap",
          animation: "fadeIn 0.3s ease", letterSpacing: "0.05em",
        }}>
          診断結果はランキング作成のため匿名で使用されます
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8" style={sectionStyle(0)}>
        <p className="text-xs tracking-[0.4em] mb-2" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>YOUR READING</p>
        <h2 className="text-2xl sm:text-3xl font-light mb-2" style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}>
          あなたの自己分析
        </h2>
        <div className="h-px w-20 mx-auto" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)" }} />
      </div>

      {/* ━━━ 統計バナー（1000人以上集まったら表示） ━━━ */}
      {statsRank && statsRank.total >= 1000 && (
        <div
          className="mb-6 rounded-2xl px-5 py-4 text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>JAPAN STATS</p>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
            あなたの <span style={{ color: displayColors.primary, fontWeight: 700 }}>{trueSelfMbti ?? mbtiType}</span> は
            {statsRank.total.toLocaleString()}人中{" "}
            <span style={{ color: "#f5c842", fontWeight: 700, fontSize: "1.1em" }}>第{statsRank.mbtiRank}位</span>
          </p>
        </div>
      )}

      {/* ━━━ 遊戯王風キャラクターカード (CSS) ━━━ */}
      {(() => {
        const atk = YGO_ATK[loveType] ?? 2000;
        const def = YGO_DEF[loveType] ?? 1500;
        const stars = Math.max(4, Math.min(9, Math.round(atk / 350)));
        const grp = loveType.charAt(0);
        const sec = loveType.charAt(1);
        const catchphrase = getMbtiCharaName(displayMBTI, loveType) ?? `${MBTI_ADJ[displayMBTI] ?? ""}${loveInfo.nickname}`;

        // RPGクラス
        const rpgCardClass = getRpgClassByCombo(displayMBTI, loveType);
        const rpgName = rpgCardClass?.name ?? "冒険者";
        const rpgEmoji = rpgCardClass?.emoji ?? loveInfo.emoji;

        // 星座属性
        const zodiacElem = zodiacData?.element ?? null;
        const ELEM_STYLE: Record<string, { bg: string; color: string; label: string; symbol: string }> = {
          火: { bg: "linear-gradient(135deg, #ff6030, #cc2200)", color: "#fff",    label: "炎",   symbol: "🔥" },
          土: { bg: "linear-gradient(135deg, #a08040, #604010)", color: "#f0e0b0", label: "地",   symbol: "🌍" },
          風: { bg: "linear-gradient(135deg, #60d0a0, #208060)", color: "#fff",    label: "風",   symbol: "💨" },
          水: { bg: "linear-gradient(135deg, #4090e0, #1040a0)", color: "#fff",    label: "水",   symbol: "💧" },
        };
        const elemSt = zodiacElem ? ELEM_STYLE[zodiacElem] : { bg: "linear-gradient(135deg, #888,#444)", color: "#fff", label: "？", symbol: "✦" };
        const attrDisplay = zodiacElem ? `${elemSt.symbol} ${data.zodiac}` : "？";

        // カードタイプ別スタイル
        const typeKey = `${grp}${sec}`;
        const TYPE_STYLE: Record<string, {
          frameOuter: string; frameInner: string; nameBg: string; nameColor: string;
          artBg: string; artAccent: string; cardBg: string; typeLabel: string;
        }> = {
          LC: {
            frameOuter: "#d4af37", frameInner: "#8b6914",
            nameBg: "linear-gradient(90deg, #1a1000, #2d1f00, #1a1000)",
            nameColor: "#f0d060",
            artBg: "linear-gradient(160deg, #0d0800 0%, #1c1400 50%, #0a0600 100%)",
            artAccent: "#d4af37",
            cardBg: "linear-gradient(175deg, #1c1200 0%, #0e0900 100%)",
            typeLabel: "カリスマ",
          },
          LA: {
            frameOuter: "#e8834a", frameInner: "#8b3a00",
            nameBg: "linear-gradient(90deg, #1a0600, #2d1000, #1a0600)",
            nameColor: "#ffb070",
            artBg: "linear-gradient(160deg, #100500 0%, #1e0a00 50%, #0d0300 100%)",
            artAccent: "#e8834a",
            cardBg: "linear-gradient(175deg, #1a0800 0%, #0d0300 100%)",
            typeLabel: "感情型",
          },
          FC: {
            frameOuter: "#8ab4d4", frameInner: "#2a4a6a",
            nameBg: "linear-gradient(90deg, #030810, #091428, #030810)",
            nameColor: "#a8d4f0",
            artBg: "linear-gradient(160deg, #030810 0%, #050f1e 50%, #020608 100%)",
            artAccent: "#6ab0e8",
            cardBg: "linear-gradient(175deg, #04080f 0%, #020508 100%)",
            typeLabel: "神秘",
          },
          FA: {
            frameOuter: "#9b59b6", frameInner: "#4a1060",
            nameBg: "linear-gradient(90deg, #0d001a, #1a0030, #0d001a)",
            nameColor: "#c87ef8",
            artBg: "linear-gradient(160deg, #080010 0%, #120020 50%, #050008 100%)",
            artAccent: "#9b59b6",
            cardBg: "linear-gradient(175deg, #0d001a 0%, #060008 100%)",
            typeLabel: "共感",
          },
        };
        const ts = TYPE_STYLE[typeKey] ?? TYPE_STYLE.LC;

        return (
          <div className="chip-pop mx-auto mb-6" style={{
            width: 260,
            position: "relative",
            borderRadius: 10,
            background: ts.cardBg,
            boxShadow: `0 16px 60px rgba(0,0,0,0.85), 0 0 30px ${ts.frameOuter}44, inset 0 0 0 3px ${ts.frameOuter}, inset 0 0 0 5px ${ts.frameInner}, inset 0 0 0 7px ${ts.frameOuter}88`,
            animationDelay: "0.1s",
            padding: 8,
          }}>

            {/* ── カード名バー ── */}
            <div style={{
              background: ts.nameBg,
              border: `1px solid ${ts.frameOuter}88`,
              borderRadius: 4,
              padding: "5px 8px",
              marginBottom: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
            }}>
              <span style={{ fontSize: 13, fontWeight: 900, color: ts.nameColor, letterSpacing: "0.02em", lineHeight: 1.2, flex: 1 }}>
                {catchphrase}
              </span>
              {/* 属性バッジ（星座） */}
              <div style={{
                borderRadius: 6,
                background: elemSt.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: `0 0 8px ${ts.frameOuter}88`,
                fontSize: 8, fontWeight: 700, color: elemSt.color,
                padding: "2px 5px",
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}>
                {attrDisplay}
              </div>
            </div>

            {/* ── レベル星 ── */}
            <div style={{ textAlign: "right", marginBottom: 5, paddingRight: 2 }}>
              {Array.from({ length: stars }).map((_, i) => (
                <span key={i} style={{ color: ts.frameOuter, fontSize: 14, textShadow: `0 0 6px ${ts.frameOuter}` }}>★</span>
              ))}
            </div>

            {/* ── イラスト枠 ── */}
            <div style={{
              width: "100%",
              aspectRatio: "1 / 1",
              borderRadius: 4,
              border: `2px solid ${ts.frameOuter}66`,
              background: ts.artBg,
              marginBottom: 6,
              position: "relative",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {/* 幾何学的背景装飾 */}
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} viewBox="0 0 244 244">
                <circle cx="122" cy="122" r="90" stroke={ts.artAccent} strokeWidth="1" fill="none" />
                <circle cx="122" cy="122" r="60" stroke={ts.artAccent} strokeWidth="0.7" fill="none" />
                <circle cx="122" cy="122" r="30" stroke={ts.artAccent} strokeWidth="0.5" fill="none" />
                {[0,45,90,135,180,225,270,315].map((deg) => {
                  const r = (deg * Math.PI) / 180;
                  return <line key={deg} x1="122" y1="122" x2={122 + 90 * Math.cos(r)} y2={122 + 90 * Math.sin(r)} stroke={ts.artAccent} strokeWidth="0.5" />;
                })}
                <polygon points="122,32 202,172 42,172" stroke={ts.artAccent} strokeWidth="1" fill="none" />
                <polygon points="122,212 42,72 202,72" stroke={ts.artAccent} strokeWidth="0.7" fill="none" />
              </svg>
              {/* メイン絵文字（RPGクラス） */}
              <span style={{ fontSize: 72, position: "relative", zIndex: 1, filter: `drop-shadow(0 0 16px ${ts.artAccent})` }}>
                {rpgEmoji}
              </span>
              {/* コードバッジ */}
              <div style={{
                position: "absolute", bottom: 6, right: 6,
                background: `${ts.artAccent}22`,
                border: `1px solid ${ts.artAccent}66`,
                borderRadius: 3,
                padding: "2px 6px",
                fontSize: 9,
                color: ts.artAccent,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "0.1em",
              }}>
                {displayMBTI} × {loveType}
              </div>
            </div>

            {/* ── 星座／タイプ行 ── */}
            <div style={{
              fontSize: 9,
              color: `${ts.nameColor}cc`,
              marginBottom: 4,
              paddingLeft: 2,
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}>
              {`【${data.zodiac !== "なし" ? data.zodiac : "星座不明"}／${rpgName}】`}
            </div>

            {/* ── テキストボックス ── */}
            <div style={{
              background: `${ts.artAccent}0a`,
              border: `1px solid ${ts.frameOuter}44`,
              borderRadius: 4,
              padding: "6px 7px",
              marginBottom: 8,
              fontSize: 9,
              color: "rgba(255,255,255,0.75)",
              lineHeight: 1.65,
              minHeight: 52,
            }}>
              {loveInfo.subtitle}。{loveInfo.motto}
              {rpgCardClass && (
                <span style={{ display: "block", marginTop: 4, opacity: 0.7, borderTop: `1px solid ${ts.frameOuter}33`, paddingTop: 4 }}>
                  {rpgCardClass.emoji}【{rpgName}】{rpgCardClass.tagline}
                </span>
              )}
            </div>

            {/* ── ATK / DEF ── */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              borderTop: `1px solid ${ts.frameOuter}44`,
              paddingTop: 6,
            }}>
              {[{ label: "ATK", val: atk }, { label: "DEF", val: def }].map(({ label, val }) => (
                <div key={label} style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 9, color: `${ts.nameColor}99`, letterSpacing: "0.1em" }}>{label}/</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: ts.nameColor, fontFamily: "monospace", letterSpacing: "0.05em" }}>
                    {String(val).padStart(4, "\u2007")}
                  </span>
                </div>
              ))}
            </div>

          </div>
        );
      })()}

      {/* ━━━ 自己分析カード ━━━ */}
      <div
        className="rounded-2xl p-6 sm:p-8 mb-6"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(232,160,191,0.05) 100%)",
          border: "1px solid rgba(255,255,255,0.35)",
          boxShadow: "0 0 40px rgba(255,255,255,0.08)",
          ...sectionStyle(0.2),
        }}
      >
        {/* Gold sweep line */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), rgba(255,255,255,0.3), transparent)",
            marginBottom: 20,
            animation: "shimmer 2s ease forwards",
            backgroundSize: "200% auto",
          }}
        />

        {/* Divider top */}
        <div className="text-center mb-4">
          <p className="text-xs tracking-[0.3em] opacity-50" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━</p>
          <p className="text-xs tracking-widest mt-1 mb-1" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>あなたの自己分析</p>
          <p className="text-xs tracking-[0.3em] opacity-50" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━</p>
        </div>

        {/* 4-element summary */}
        <div className="space-y-2 mb-5 text-sm">
          <div
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg"
            style={{ background: displayColors.bg }}
          >
            <span>🧠</span>
            <span className="opacity-60 text-xs w-24 flex-shrink-0">性格タイプ</span>
            <span className="font-bold" style={{ color: displayColors.primary }}>
              {displayMBTI}
              {trueSelfMbti && trueSelfMbti !== mbtiType && (
                <span className="text-xs ml-2 opacity-60" style={{ color: mbtiColors.primary }}>← 元: {mbtiType}</span>
              )}
              {displayMBTIInfo && (
                <span className="text-xs opacity-70 ml-1" style={{ color: displayColors.primary }}>
                  {displayColors.label}
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg" style={{ background: "rgba(232,160,191,0.06)" }}>
            <span>✦</span>
            <span className="opacity-60 text-xs w-24 flex-shrink-0">キャラクターコード</span>
            <span className="font-medium" style={{ color: "#e8a0bf" }}>
              {loveInfo.nickname}
              <span className="text-xs opacity-60 ml-1">（{loveType}）</span>
            </span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg" style={{ background: "rgba(147,197,253,0.06)" }}>
            <span>⭐</span>
            <span className="opacity-60 text-xs w-24 flex-shrink-0">星座</span>
            <span className="font-medium" style={{ color: data.zodiac === "なし" ? "rgba(147,197,253,0.4)" : "#93c5fd" }}>
              {data.zodiac === "なし" ? "星座なし" : data.zodiac}
              {zodiacData && <span className="text-xs opacity-60 ml-1">（{zodiacData.element}・{zodiacData.planet}）</span>}
            </span>
          </div>
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg" style={{ background: "rgba(147,51,234,0.06)" }}>
            <span>🔮</span>
            <span className="opacity-60 text-xs w-24 flex-shrink-0">タロット</span>
            <span className="font-medium" style={{ color: "#c084fc" }}>
              {tarotCard.name}
              {tarotIsReversed && (
                <span
                  className="text-xs ml-2 px-1.5 py-0.5 rounded font-bold"
                  style={{ background: "rgba(220,60,60,0.2)", color: "#ff8080", border: "1px solid rgba(220,60,60,0.4)" }}
                >
                  逆位置
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="h-px mb-5" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />

        {/* Title */}
        <h3
          className="text-xl sm:text-2xl font-light text-center mb-3"
          style={{
            fontFamily: "var(--font-noto-serif-jp), serif",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {reading.title}
        </h3>

        <div className="h-px mb-5" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

        {/* 総合分析 */}
        <div className="mb-5">
          <p className="text-xs tracking-widest opacity-40 mb-3 text-center" style={{ color: "rgba(255,255,255,0.55)" }}>✦ 総合分析</p>
          <div className="text-sm sm:text-base leading-[2.1] opacity-90 space-y-2">
            {descParts.map((part, i) => (
              <span
                key={i}
                className="animate-line-reveal block"
                style={{ animationDelay: `${0.15 + i * 0.2}s` }}
                dangerouslySetInnerHTML={{ __html: part }}
              />
            ))}
          </div>
        </div>

        <div className="h-px mb-5" style={{ background: "linear-gradient(90deg, transparent, rgba(232,160,191,0.3), transparent)" }} />

        {/* 行動傾向・対人スタイル */}
        <div className="mb-5">
          <p className="text-xs tracking-widest opacity-40 mb-3" style={{ color: "#e8a0bf" }}>✦ 行動傾向・対人スタイル</p>
          <p className="text-sm leading-relaxed opacity-80">{reading.loveReading}</p>
        </div>

        <div className="h-px mb-5" style={{ background: "linear-gradient(90deg, transparent, rgba(147,51,234,0.3), transparent)" }} />

        {/* タロット mini + 今のあなたへのメッセージ */}
        <div className="mb-4">
          <p className="text-xs tracking-widest opacity-40 mb-3" style={{ color: "#c084fc" }}>✦ 今のあなたへのメッセージ</p>
          <div className="flex items-start gap-4">
            <div style={{ width: "56px", height: "88px", flexShrink: 0, filter: "drop-shadow(0 0 12px rgba(255,255,255,0.4))" }}>
              <CardFrontSVG card={tarotCard} isReversed={tarotIsReversed} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>
                {tarotCard.name}
                {tarotIsReversed && (
                  <span className="text-xs ml-2" style={{ color: "#ff8080" }}>逆位置</span>
                )}
              </p>
              <p className="text-xs opacity-50 italic mb-2">
                {tarotIsReversed ? tarotCard.reversedMeaning : tarotCard.meaning}
              </p>
              <p className="text-xs sm:text-sm leading-relaxed opacity-75">{reading.cosmicMessage}</p>
            </div>
          </div>
        </div>

        <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />

        {/* MBTI keywords */}
        {mbtiInfo && (
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {mbtiInfo.keywords.split("・").map((kw, i) => (
              <span key={i} className="text-xs px-3 py-1 rounded-full"
                style={{
                  background: displayColors.bg,
                  border: `1px solid ${displayColors.primary}44`,
                  color: displayColors.primary,
                  opacity: 0.85,
                }}>
                {kw}
              </span>
            ))}
          </div>
        )}

        {/* MBTI dimension scores */}
        {Object.keys(data.mbtiAnswers).length > 0 && (() => {
          const dimScores = getMBTIScores(data.mbtiAnswers);
          const DIM_LABELS: Record<string, { left: string; right: string }> = {
            E: { left: "外向的", right: "内向的" },
            S: { left: "現実的", right: "直感的" },
            T: { left: "論理的", right: "感情的" },
            J: { left: "計画的", right: "柔軟" },
          };
          return (
            <div className="mb-4 space-y-2.5 px-1">
              {dimScores.map(({ left, right, leftPct, rightPct, winner }) => {
                const label = DIM_LABELS[left] ?? { left, right };
                const winnerPct = winner === left ? leftPct : rightPct;
                const winnerLabel = winner === left ? label.left : label.right;
                return (
                  <div key={left}>
                    <div className="flex justify-between text-xs mb-1 opacity-70">
                      <span style={{ color: winner === left ? displayColors.primary : "rgba(255,255,255,0.35)" }}>{left} {label.left} {leftPct}%</span>
                      <span style={{ color: winner === right ? displayColors.primary : "rgba(255,255,255,0.35)" }}>{rightPct}% {label.right} {right}</span>
                    </div>
                    <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${leftPct}%`,
                          background: winner === left
                            ? `linear-gradient(90deg, ${displayColors.primary}99, ${displayColors.primary})`
                            : `linear-gradient(90deg, rgba(255,255,255,0.15), rgba(255,255,255,0.25))`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-right mt-0.5" style={{ color: displayColors.primary, opacity: 0.6 }}>
                      {winnerPct}% {winnerLabel}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })()}

        <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

        {/* ✦ あなたの強み — accordion */}
        <StrengthsAccordion strengths={reading.strengths} sectionStyle={sectionStyle(0.5)} />

        <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }} />

        {/* ✦ 成長のヒント — accordion */}
        <ChallengesAccordion challenges={reading.challenges} sectionStyle={sectionStyle(0.6)} />


        <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(232,160,191,0.3), transparent)" }} />

        {/* ✦ revelaからのアドバイス */}
        <div className="mb-5 rounded-xl p-4" style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(232,160,191,0.06))",
          border: "1px solid rgba(255,255,255,0.3)",
          boxShadow: "inset 0 0 20px rgba(255,255,255,0.03)",
          ...sectionStyle(0.7),
        }}>
          <p className="text-xs tracking-widest opacity-50 mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>✦ revelaからのアドバイス</p>
          <p className="text-xs sm:text-sm leading-relaxed opacity-80 italic">「{reading.advice}」</p>
        </div>

        <div className="h-px mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }} />

        {/* ✦ ラッキーエレメント */}
        <div style={sectionStyle(0.8)}>
          <p className="text-xs tracking-widest opacity-40 mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>✦ ラッキーエレメント</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "ラッキーカラー", value: reading.luckyElements.color, icon: "🎨" },
              { label: "ラッキーアイテム", value: reading.luckyElements.item, icon: "✨" },
              { label: "ラッキーデー", value: reading.luckyElements.day, icon: "📅" },
              { label: "ラッキーナンバー", value: String(reading.luckyElements.number), icon: "🔢" },
            ].map(({ label, value, icon }, i) => (
              <div
                key={i}
                className="chip-pop rounded-xl p-3 text-center"
                style={{
                  animationDelay: `${0.9 + i * 0.1}s`,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div className="text-lg mb-1">{icon}</div>
                <div className="text-xs opacity-40 mb-1 tracking-wide">{label}</div>
                <div className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RPG Career — inline result */}
      {(() => {
        const displayMBTI = trueSelfMbti ?? mbtiType;
        const rpgClass = getRpgClassByCombo(displayMBTI, loveType);
        if (!rpgClass) return null;
        const synergy = zodiacData ? getRpgSynergy(rpgClass.name, zodiacData.element) : null;
        return (
          <div className="mb-5 rounded-2xl p-5" style={{ background: `${rpgClass.color}0d`, border: `1px solid ${rpgClass.color}33` }}>
            <p className="text-xs tracking-widest mb-3 opacity-50" style={{ color: rpgClass.color }}>⚔️ 職場RPGクラス</p>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{rpgClass.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base font-bold" style={{ color: rpgClass.color }}>{rpgClass.name}</span>
                  <span className="text-xs opacity-40">{rpgClass.nameEn}</span>
                </div>
                <p className="text-xs opacity-60 leading-relaxed">{rpgClass.tagline}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {rpgClass.strengths.map((s) => (
                <span key={s} className="text-xs px-2.5 py-1 rounded-full" style={{ background: `${rpgClass.color}18`, border: `1px solid ${rpgClass.color}33`, color: rpgClass.color }}>
                  {s}
                </span>
              ))}
            </div>
            {synergy && (
              <div className="rounded-xl p-3 mb-4" style={{ background: `${rpgClass.color}12`, border: `1px solid ${rpgClass.color}44` }}>
                <p className="text-xs tracking-widest mb-1" style={{ color: rpgClass.color, opacity: 0.7 }}>
                  ✦ 属性オーラ / {zodiacData?.element}属性
                </p>
                <p className="text-sm font-bold mb-1" style={{ color: rpgClass.color }}>「{synergy.synergyName}」</p>
                <p className="text-xs leading-relaxed opacity-70">{synergy.synergyDesc}</p>
              </div>
            )}
            <a href="/chara?tab=rpg" className="text-xs font-medium opacity-70 hover:opacity-100 transition-opacity" style={{ color: rpgClass.color }}>
              全16クラスを見る →
            </a>
          </div>
        );
      })()}

      {/* ━━━ 友達と相性診断 section ━━━ */}
      {(() => {
        const finalMBTI = trueSelfMbti ?? mbtiType;
        const canGenerateCode = data.zodiac && data.zodiac !== "なし";
        if (!canGenerateCode) return null;
        const revelCode = generateRevelaCode(finalMBTI, loveType, data.zodiac);
        const handleCopyCode = async () => {
          try {
            await navigator.clipboard.writeText(revelCode);
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), 2500);
          } catch { /* silent */ }
        };
        return (
          <div
            className="rounded-2xl p-5 mb-6"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(232,160,191,0.06))",
              border: "1px solid rgba(255,255,255,0.4)",
              ...sectionStyle(0.9),
            }}
          >
            <div className="text-center mb-4">
              <p className="text-xs tracking-[0.3em] opacity-50 mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━</p>
              <p className="text-sm tracking-widest font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>友達と相性診断しよう！</p>
              <p className="text-xs tracking-[0.3em] opacity-50 mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━</p>
            </div>
            <p className="text-xs opacity-60 text-center mb-3 tracking-wider">あなたのrevelaコード:</p>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div
                className="px-5 py-2.5 rounded-xl text-sm font-bold tracking-widest"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "monospace",
                  letterSpacing: "0.12em",
                }}
              >
                {revelCode}
              </div>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest transition-all duration-200"
                style={{
                  background: codeCopied
                    ? "linear-gradient(135deg,#059669,#10b981)"
                    : "rgba(255,255,255,0.08)",
                  color: "#0a0a0a",
                  border: "none",
                  boxShadow: codeCopied
                    ? "0 0 12px rgba(16,185,129,0.4)"
                    : "0 0 12px rgba(255,255,255,0.4)",
                  minWidth: "72px",
                }}
              >
                {codeCopied ? "✓ コピー" : "コピー"}
              </button>
            </div>
            <p className="text-xs opacity-60 text-center leading-relaxed mb-4">
              このコードを友達に送って、相性を確かめよう
            </p>
            <a
              href="/shindan/aisei"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm tracking-widest font-bold"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(232,160,191,0.15))",
                border: "1px solid rgba(255,255,255,0.5)",
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none",
                transition: "all 0.2s ease",
              }}
            >
              <span>💫</span>
              <span>相性診断へ →</span>
            </a>
          </div>
        );
      })()}

      {/* Ad placement */}
      <div className="w-full h-16 rounded-xl mb-6 flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
        <span className="text-xs opacity-20 tracking-widest">ADVERTISEMENT</span>
      </div>

      {/* キャラクターコード detail */}
      <div
        className="rounded-2xl p-5 mb-6"
        style={{
          background: "rgba(232,160,191,0.05)",
          border: "1px solid rgba(232,160,191,0.2)",
          ...sectionStyle(0.3),
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{loveInfo.emoji}</span>
          <div className="flex-1">
            <div className="text-sm font-medium" style={{ color: "#e8a0bf" }}>
              {loveType} · {loveInfo.nickname}
            </div>
            <div className="text-xs opacity-50 mt-0.5">{loveInfo.subtitle}</div>
            <div className="text-xs mt-1" style={{ color: "rgba(232,160,191,0.6)", fontStyle: "italic" }}>
              {loveInfo.motto}
            </div>
          </div>
        </div>
        <a
          href="/chara"
          className="text-xs opacity-60 hover:opacity-90 transition-opacity tracking-wider"
          style={{ color: "#e8a0bf", textDecoration: "none" }}
        >
          あなたのキャラクターコードについてもっと詳しく →
        </a>
      </div>

      {/* Action buttons */}
      <div className="space-y-3" style={sectionStyle(0.4)}>
        {/* Share card button */}
        <button
          onClick={() => setShowShareCard(true)}
          className="btn-outline-primary w-full py-4 rounded-full text-sm tracking-widest font-bold"
        >
          ✦ シェアカードを見る
        </button>
        <button
          onClick={handleShare}
          className="w-full py-3.5 rounded-full text-sm tracking-widest font-bold"
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,255,255,0.35)",
            transition: "all 0.2s ease",
          }}
        >
          {copied ? "✓ コピーしました！" : "テキストをコピーしてシェア"}
        </button>
        <button
          onClick={handleTwitterShare}
          className="w-full py-3.5 rounded-full text-sm tracking-widest font-bold flex items-center justify-center gap-2"
          style={{
            background: "#000",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.15)",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          <span>Xでシェアする</span>
        </button>
        <button
          onClick={handleLineShare}
          className="w-full py-3.5 rounded-full text-sm tracking-widest font-bold flex items-center justify-center gap-2"
          style={{
            background: "#06C755",
            color: "#fff",
            border: "1px solid #06C755",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
          </svg>
          <span>LINEでシェアする</span>
        </button>
        <button
          onClick={handleSaveImage}
          disabled={savingImage}
          className="w-full py-3.5 rounded-full text-sm tracking-widest font-bold flex items-center justify-center gap-2"
          style={{
            background: savingImage ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.10)",
            color: savingImage ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.35)",
            cursor: savingImage ? "default" : "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <span>{savingImage ? "⏳" : "📸"}</span>
          <span>{savingImage ? "生成中..." : "結果を画像で保存"}</span>
        </button>
        <button onClick={onReset} className="btn-outline-gold w-full py-4 rounded-full text-sm tracking-widest">
          ✦ 新しい旅をはじめる
        </button>
        <button
          onClick={handleSave}
          className="btn-outline-gold w-full py-3 rounded-full text-xs tracking-widest flex items-center justify-center gap-2"
          style={{ opacity: 0.7 }}
        >
          <span>💾</span>
          <span>診断結果を保存</span>
        </button>
        <a
          href="/shindan/aisei"
          className="btn-outline-gold w-full py-3 rounded-full text-xs tracking-widest flex items-center justify-center gap-2"
          style={{
            display: "flex",
            textDecoration: "none",
            color: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,255,255,0.5)",
            borderRadius: "9999px",
            padding: "12px",
            justifyContent: "center",
            gap: "8px",
            fontSize: "12px",
            letterSpacing: "0.08em",
            opacity: 0.7,
            transition: "all 0.2s ease",
          }}
        >
          <span>💫</span>
          <span>相性診断へ</span>
        </a>
      </div>

      <div className="mt-8 mb-4 w-full h-24 rounded-xl flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.06)" }}>
        <span className="text-xs opacity-15 tracking-widest">ADVERTISEMENT</span>
      </div>
    </div>
  );
}

// ============================================================
// Main Page
// ============================================================

const initialForm: FormData = {
  birthMonth: "",
  birthDay: "",
  zodiac: "",
  mbtiAnswers: {},
  loveAnswers: {},
};

type SubStep = "normal" | "trueSelf" | "trueSelfSkipped";

export default function ShindanPage() {
  // Question count selector
  const [mbtiCount, setMbtiCount] = useState<5 | 10 | 15>(10);
  const [loveCount, setLoveCount] = useState<5 | 10 | 15>(5);

  // Randomized questions — regenerate when count changes
  const [activeQuestions, setActiveQuestions] = useState(() => ({
    mbti: getRandomizedMBTIQuestions(10),
    love: getRandomizedLoveQuestions(5),
  }));

  const handleMbtiCountChange = (count: 5 | 10 | 15) => {
    setMbtiCount(count);
    setFormData((prev) => ({ ...prev, mbtiAnswers: {} }));
    setActiveQuestions((prev) => ({ ...prev, mbti: getRandomizedMBTIQuestions(count) }));
  };

  const handleLoveCountChange = (count: 5 | 10 | 15) => {
    setLoveCount(count);
    setFormData((prev) => ({ ...prev, loveAnswers: {} }));
    setActiveQuestions((prev) => ({ ...prev, love: getRandomizedLoveQuestions(count) }));
  };

  // Step 0 skip state
  const [knowsMBTI, setKnowsMBTI] = useState<boolean | null>(null);
  const [knownMBTI, setKnownMBTI] = useState<string>("");
  const [knowsLove, setKnowsLove] = useState<boolean | null>(null);
  const [knownLove, setKnownLove] = useState<LoveType | "">("");

  // Form + results
  const [step, setStep] = useState<Step>(0);
  const [subStep, setSubStep] = useState<SubStep>("normal");
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [mbtiResult, setMbtiResult] = useState("");
  const [trueSelfMbti, setTrueSelfMbti] = useState<string | null>(null);
  const [loveResult, setLoveResult] = useState<LoveType | null>(null);
  const [selectedTarot, setSelectedTarot] = useState<TarotCard | null>(null);
  const [tarotIsReversed, setTarotIsReversed] = useState(false);

  const [showTarot, setShowTarot] = useState(true);
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [showGates, setShowGates] = useState(false);
  const [gatesComplete, setGatesComplete] = useState(false);

  // Whether the MBTI came from diagnosis (true) or skip (false)
  const [mbtiFromDiagnosis, setMbtiFromDiagnosis] = useState(true);

  const handleFormChange = useCallback((key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleMBTIAnswer = useCallback((id: number, score: LikertScore) => {
    setFormData((prev) => ({ ...prev, mbtiAnswers: { ...prev.mbtiAnswers, [id]: score } }));
  }, []);

  const handleLoveAnswer = useCallback((id: number, score: LikertScore) => {
    setFormData((prev) => ({ ...prev, loveAnswers: { ...prev.loveAnswers, [id]: score } }));
  }, []);

  const goToStep = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStep0Next = () => {
    goToStep(1);
  };

  const handleStep1Next = () => {
    if (knowsMBTI === true && knownMBTI) {
      setMbtiResult(knownMBTI);
      setMbtiFromDiagnosis(false);
      if (knowsLove === true && knownLove) {
        setLoveResult(knownLove as LoveType);
        setSubStep("trueSelf");
        goToStep(4);
      } else {
        setSubStep("trueSelf");
        goToStep(4);
      }
    } else {
      goToStep(2);
    }
  };

  const handleSkipZodiac = () => {
    handleFormChange("zodiac", "なし");
    handleFormChange("birthMonth", "");
    handleFormChange("birthDay", "");
    // Jump straight to MBTI questions
    if (knowsMBTI === true && knownMBTI) {
      setMbtiResult(knownMBTI);
      setMbtiFromDiagnosis(false);
      if (knowsLove === true && knownLove) {
        setLoveResult(knownLove as LoveType);
        setSubStep("trueSelf");
        goToStep(4);
      } else {
        setSubStep("trueSelf");
        goToStep(4);
      }
    } else {
      goToStep(2);
    }
  };

  const handleStep2Next = () => {
    const mbti = calculateMBTI(formData.mbtiAnswers, activeQuestions.mbti);
    setMbtiResult(mbti);
    setMbtiFromDiagnosis(true);
    if (knowsLove === true && knownLove) {
      setLoveResult(knownLove as LoveType);
      setSubStep("trueSelf");
      goToStep(4);
    } else {
      setSubStep("trueSelf");
      goToStep(3);
    }
  };

  const handleStep3Next = () => {
    const love = knowsLove && knownLove ? (knownLove as LoveType) : calculateLoveType(formData.loveAnswers, activeQuestions.love);
    setLoveResult(love);
    setShowTarot(true);
    setSubStep("normal");
    goToStep(4);
  };

  const handleTrueSelfConfirm = (finalMBTI: string, altMBTI: string | null) => {
    if (altMBTI) setTrueSelfMbti(altMBTI);
    else setTrueSelfMbti(null);

    if (knowsLove === true && knownLove) {
      setLoveResult(knownLove as LoveType);
      setSubStep("normal");
      setShowTarot(true);
      goToStep(4);
    } else if (loveResult) {
      setSubStep("normal");
      setShowTarot(true);
      goToStep(4);
    } else {
      setSubStep("normal");
      goToStep(3);
    }
  };

  const handleTrueSelfSkip = () => {
    setTrueSelfMbti(null);
    if (knowsLove === true && knownLove) {
      setLoveResult(knownLove as LoveType);
      setShowTarot(true);
      setSubStep("normal");
      goToStep(4);
    } else if (loveResult) {
      setShowTarot(true);
      setSubStep("normal");
      goToStep(4);
    } else {
      setSubStep("normal");
      goToStep(3);
    }
  };

  const handleTarotSelect = (card: TarotCard, isReversed: boolean) => {
    setSelectedTarot(card);
    setTarotIsReversed(isReversed);
    // Show analyzing screen before results
    setShowAnalyzing(true);
  };

  const handleAnalyzingComplete = () => {
    setShowAnalyzing(false);
    setShowTarot(false);
    setShowGates(false);
    setGatesComplete(true);
  };

  const handleGatesComplete = () => {
    setGatesComplete(true);
  };

  const handleReset = () => {
    setFormData(initialForm);
    setMbtiResult("");
    setTrueSelfMbti(null);
    setLoveResult(null);
    setSelectedTarot(null);
    setTarotIsReversed(false);
    setShowTarot(true);
    setShowAnalyzing(false);
    setShowGates(false);
    setGatesComplete(false);
    setKnowsMBTI(null);
    setKnownMBTI("");
    setKnowsLove(null);
    setKnownLove("");
    setSubStep("normal");
    goToStep(0);
  };

  const progressStep = step === 0 ? 0 : step <= 3 ? step : 4;
  const totalSteps = 4;

  // Determine what to show at step 4
  const showTrueSelf = step === 4 && subStep === "trueSelf" && mbtiResult;
  const showTarotSelection = step === 4 && subStep === "normal" && showTarot && !showAnalyzing;
  const showResults = step === 4 && subStep === "normal" && !showTarot && !showAnalyzing && mbtiResult && loveResult && selectedTarot;

  return (
    <div className="relative min-h-screen px-4 py-8 sm:py-12">
      {/* Analyzing overlay */}
      {showAnalyzing && <AnalyzingScreen onComplete={handleAnalyzingComplete} />}

      {/* Gates reveal overlay (disabled) */}
      {false && showGates && <GatesReveal onComplete={handleGatesComplete} />}

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-cinzel text-lg sm:text-xl font-light tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
            REVELA
          </h1>
          <p className="text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>自己分析ツール</p>
        </div>

        {step >= 1 && step <= 3 && <ProgressBar step={progressStep} total={totalSteps} />}

        {/* Step 0 */}
        {step === 0 && (
          <Step0
            knownMBTI={knownMBTI}
            setKnownMBTI={setKnownMBTI}
            knowsMBTI={knowsMBTI}
            setKnowsMBTI={setKnowsMBTI}
            knownLove={knownLove}
            setKnownLove={setKnownLove}
            knowsLove={knowsLove}
            setKnowsLove={setKnowsLove}
            onNext={handleStep0Next}
            mbtiCount={mbtiCount}
            onMbtiCountChange={handleMbtiCountChange}
            loveCount={loveCount}
            onLoveCountChange={handleLoveCountChange}
          />
        )}

        {/* Step 1: Birthday */}
        {step === 1 && (
          <Step1
            data={formData}
            onChange={handleFormChange}
            onNext={handleStep1Next}
            onBack={() => goToStep(0)}
            onSkipZodiac={handleSkipZodiac}
          />
        )}

        {/* Step 2: MBTI */}
        {step === 2 && (
          <Step2
            answers={formData.mbtiAnswers}
            onAnswer={handleMBTIAnswer}
            onNext={handleStep2Next}
            onBack={() => goToStep(1)}
            questions={activeQuestions.mbti}
          />
        )}

        {/* Step 3: Character Code */}
        {step === 3 && (
          <Step3
            answers={formData.loveAnswers}
            onAnswer={handleLoveAnswer}
            onNext={handleStep3Next}
            onBack={() => goToStep(knowsMBTI && knownMBTI ? 1 : 2)}
            questions={activeQuestions.love}
          />
        )}

        {/* Step 4a: True Self */}
        {showTrueSelf && (
          <TrueSelfStep
            initialMBTI={mbtiResult}
            fromDiagnosis={mbtiFromDiagnosis}
            onConfirm={handleTrueSelfConfirm}
            onSkip={handleTrueSelfSkip}
          />
        )}

        {/* Step 4b: Tarot selection */}
        {showTarotSelection && (
          <TarotSelection onSelect={handleTarotSelect} />
        )}

        {/* Step 4c: Results */}
        {showResults && mbtiResult && loveResult && selectedTarot && (
          <ResultsPage
            data={formData}
            mbtiType={mbtiResult}
            trueSelfMbti={trueSelfMbti}
            loveType={loveResult}
            tarotCard={selectedTarot}
            tarotIsReversed={tarotIsReversed}
            onReset={handleReset}
            gatesComplete={gatesComplete}
          />
        )}
      </div>
    </div>
  );
}
