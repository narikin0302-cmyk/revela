"use client";

import { useState, useEffect } from "react";
import { getCompatibility, type MBTIType } from "@/data/aisei";
import {
  parseRevelaCode,
  calculateFullCompatibility,
  type ParsedCode,
} from "@/lib/revelaCodes";
import { getRpgClassByCombo } from "@/data/rpgClasses";
import {
  getSynergyPatternId,
  getSynergyDescription,
  SYNERGY_PATTERNS,
  CLASS_ROLES,
} from "@/data/rpgSynergy";

// ── Constants ────────────────────────────────────────────────

const MBTI_GRID: MBTIType[][] = [
  ["INTJ", "INTP", "ENTJ", "ENTP"],
  ["INFJ", "INFP", "ENFJ", "ENFP"],
  ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  ["ISTP", "ISFP", "ESTP", "ESFP"],
];

const RANK_COLORS: Record<string, string> = {
  S: "#EDEDED",
  A: "#60a5fa",
  B: "#34d399",
  C: "#f87171",
  D: "#9ca3af",
};

const RANK_LABELS: Record<string, string> = {
  S: "運命の相手",
  A: "相性抜群",
  B: "良い関係",
  C: "努力次第",
  D: "挑戦的な関係",
};

const MAX_MEMBERS = 99;
const MAX_MATRIX = 15;

type Mode = "group" | "code" | "mbti";

// ── Pair result type ──────────────────────────────────────────

interface PairResult {
  idxA: number;
  idxB: number;
  labelA: string;
  labelB: string;
  score: number;
}

// ── Group member label ────────────────────────────────────────

function memberLabel(index: number): string {
  if (index === 0) return "あなた";
  return `メンバー${index + 1}`;
}

// ── Sub-components ───────────────────────────────────────────

function MBTISelector({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: MBTIType | null;
  onSelect: (type: MBTIType) => void;
}) {
  return (
    <div>
      <p
        className="text-center text-xs tracking-[0.3em] mb-4 font-medium"
        style={{ color: "rgba(255,255,255,0.55)", opacity: 0.8 }}
      >
        {label}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {MBTI_GRID.flat().map((type) => {
          const isSelected = selected === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="rounded-xl py-2 px-1 text-xs font-bold tracking-wider transition-all duration-200 hover:scale-105"
              style={{
                background: isSelected
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(255,255,255,0.04)",
                color: isSelected ? "#EDEDED" : "#EDEDED",
                border: isSelected
                  ? "none"
                  : "1px solid rgba(255,255,255,0.2)",
                boxShadow: isSelected ? "0 0 15px rgba(255,255,255,0.4)" : "none",
              }}
            >
              {type}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function HeartVisualization({ score }: { score: number }) {
  const filled = Math.round(score / 20);
  return (
    <div className="flex gap-1.5 justify-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill={i <= filled ? "#e8a0bf" : "none"}
          stroke="#e8a0bf"
          strokeWidth="1.5"
          opacity={i <= filled ? 1 : 0.3}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ))}
    </div>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  const filled = Math.round(score / 10);
  return (
    <div className="flex items-center gap-3 mb-2">
      <span className="text-xs opacity-60 w-20 flex-shrink-0 text-right">{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: "14px",
              height: "8px",
              borderRadius: "2px",
              background: i < filled ? color : "rgba(255,255,255,0.08)",
              border: i < filled ? "none" : "1px solid rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-bold" style={{ color, minWidth: "36px" }}>{score}%</span>
    </div>
  );
}

// ── Score cell color ──────────────────────────────────────────

function scoreCellStyle(score: number): React.CSSProperties {
  if (score >= 80) return { background: "rgba(52,211,153,0.2)", color: "#34d399", border: "1px solid rgba(52,211,153,0.4)" };
  if (score >= 60) return { background: "rgba(251,191,36,0.15)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.35)" };
  return { background: "rgba(248,113,113,0.15)", color: "#f87171", border: "1px solid rgba(248,113,113,0.35)" };
}

// ── Medal emoji for rank ──────────────────────────────────────

function rankMedal(i: number): string {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return `${i + 1}.`;
}

// ── Code input mode result (2-person) ────────────────────────

function CodeCompatibilityResult({
  codeA,
  codeB,
  onReset,
}: {
  codeA: ParsedCode;
  codeB: ParsedCode;
  onReset: () => void;
}) {
  const result = calculateFullCompatibility(codeA, codeB);
  const { total, mbtiScore, charaScore, zodiacScore, tarotScore, comment, strengths, cautions } = result;

  const rank =
    total >= 90 ? "S" : total >= 80 ? "A" : total >= 65 ? "B" : total >= 50 ? "C" : "D";
  const rankColor = RANK_COLORS[rank];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-base font-bold mx-auto mb-2"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))", border: "1px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.55)" }}
          >
            {codeA.mbti}
          </div>
          <p className="text-xs opacity-40">あなた</p>
          <p className="text-xs opacity-50 mt-0.5" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>{codeA.zodiac}</p>
        </div>
        <div className="text-2xl" style={{ color: "#e8a0bf" }}>×</div>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-base font-bold mx-auto mb-2"
            style={{ background: "linear-gradient(135deg, rgba(232,160,191,0.2), rgba(232,160,191,0.1))", border: "1px solid rgba(232,160,191,0.4)", color: "#e8a0bf" }}
          >
            {codeB.mbti}
          </div>
          <p className="text-xs opacity-40">友達</p>
          <p className="text-xs opacity-50 mt-0.5" style={{ color: "#e8a0bf", fontFamily: "monospace" }}>{codeB.zodiac}</p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(232,160,191,0.08))",
          border: `1px solid ${rankColor}44`,
        }}
      >
        <p className="text-xs tracking-[0.3em] mb-3" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>
          COMPATIBILITY SCORE
        </p>
        <div
          className="text-6xl font-light mb-2"
          style={{
            background: `linear-gradient(135deg, ${rankColor}, #f0d060)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "var(--font-noto-serif-jp), serif",
          }}
        >
          {total}
          <span className="text-3xl">%</span>
        </div>
        <HeartVisualization score={total} />
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: `${rankColor}22`, border: `1px solid ${rankColor}55` }}>
          <span className="text-lg font-bold" style={{ color: rankColor }}>{rank}</span>
          <span className="text-sm" style={{ color: rankColor }}>{RANK_LABELS[rank]}</span>
        </div>
      </div>

      <div className="card-glow rounded-2xl p-5">
        <p className="text-xs tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>
          ✦ スコア詳細
        </p>
        <ScoreBar label="MBTI相性"   score={mbtiScore}   color="rgba(255,255,255,0.55)" />
        <ScoreBar label="キャラ相性" score={charaScore}  color="#e8a0bf" />
        <ScoreBar label="星座相性"   score={zodiacScore} color="#93c5fd" />
        <ScoreBar label="タロット"   score={tarotScore}  color="#c084fc" />
      </div>

      <div className="card-glow rounded-2xl p-5">
        <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>
          ✦ 総合コメント
        </p>
        <p className="text-sm leading-relaxed opacity-80">{comment}</p>
      </div>

      <div className="card-glow rounded-2xl p-5">
        <p className="text-xs tracking-widest mb-3" style={{ color: "#34d399", opacity: 0.8 }}>
          ✦ 強みとなるポイント
        </p>
        <ul className="space-y-2">
          {strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm opacity-75">
              <span style={{ color: "#34d399", flexShrink: 0 }}>-</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card-glow rounded-2xl p-5">
        <p className="text-xs tracking-widest mb-3" style={{ color: "#f87171", opacity: 0.8 }}>
          ⚠ 注意が必要なポイント
        </p>
        <ul className="space-y-2">
          {cautions.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm opacity-75">
              <span style={{ color: "#f87171", flexShrink: 0 }}>-</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* RPG Party Synergy */}
      {(() => {
        const rpgA = getRpgClassByCombo(codeA.mbti, codeA.loveType);
        const rpgB = getRpgClassByCombo(codeB.mbti, codeB.loveType);
        if (!rpgA || !rpgB) return null;
        const patternId = getSynergyPatternId(rpgA.name, rpgB.name);
        const pattern = SYNERGY_PATTERNS[patternId];
        const roleA = CLASS_ROLES[rpgA.name];
        const roleB = CLASS_ROLES[rpgB.name];
        const roleLabel: Record<string, string> = { LEADER: "前衛", SUPPORT: "後衛", BRAIN: "頭脳", TRICKSTER: "自由" };
        const desc = getSynergyDescription(pattern, rpgA.name, rpgB.name);

        return (
          <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${pattern.color}33` }}>
            <p className="text-xs tracking-widest mb-4" style={{ color: pattern.color, opacity: 0.9 }}>
              ⚔ PARTY SYNERGY
            </p>

            {/* 2クラス並べる */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="text-center flex-1">
                <div className="text-2xl mb-1">{rpgA.emoji}</div>
                <p className="text-sm font-bold" style={{ color: rpgA.color }}>{rpgA.name}</p>
                <p className="text-xs mt-0.5 px-2 py-0.5 rounded-full inline-block" style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {roleA ? roleLabel[roleA] : ""}
                </p>
              </div>
              <div className="text-lg" style={{ color: "rgba(255,255,255,0.25)" }}>×</div>
              <div className="text-center flex-1">
                <div className="text-2xl mb-1">{rpgB.emoji}</div>
                <p className="text-sm font-bold" style={{ color: rpgB.color }}>{rpgB.name}</p>
                <p className="text-xs mt-0.5 px-2 py-0.5 rounded-full inline-block" style={{ color: "rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {roleB ? roleLabel[roleB] : ""}
                </p>
              </div>
            </div>

            {/* ランク＋パターン名 */}
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold" style={{ background: `${pattern.color}18`, border: `1px solid ${pattern.color}55`, color: pattern.color }}>
                Tactical Synergy {pattern.rank} — {pattern.name}
              </span>
            </div>

            {/* タイトル */}
            <p className="text-base font-bold text-center mb-3 leading-snug" style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "#f0f0f0" }}>
              「{pattern.title}」
            </p>

            {/* 説明文 */}
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>{desc}</p>
          </div>
        );
      })()}

      <div className="text-center pt-2">
        <button onClick={onReset} className="btn-outline-gold px-8 py-3 rounded-full text-sm tracking-widest">
          もう一度診断する
        </button>
      </div>
    </div>
  );
}

// ── MBTI mode result ──────────────────────────────────────────

function MbtiCompatibilityResult({
  personA,
  personB,
  onReset,
}: {
  personA: MBTIType;
  personB: MBTIType;
  onReset: () => void;
}) {
  const result = getCompatibility(personA, personB);
  const rankColor = RANK_COLORS[result.rank];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-base font-bold mx-auto mb-2"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))", border: "1px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.55)" }}
          >
            {personA}
          </div>
          <p className="text-xs opacity-40">あなた</p>
        </div>
        <div className="text-2xl" style={{ color: "#e8a0bf" }}>×</div>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-base font-bold mx-auto mb-2"
            style={{ background: "linear-gradient(135deg, rgba(232,160,191,0.2), rgba(232,160,191,0.1))", border: "1px solid rgba(232,160,191,0.4)", color: "#e8a0bf" }}
          >
            {personB}
          </div>
          <p className="text-xs opacity-40">相手</p>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(232,160,191,0.08))",
          border: `1px solid ${rankColor}44`,
        }}
      >
        <p className="text-xs tracking-[0.3em] mb-3" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>
          COMPATIBILITY SCORE
        </p>
        <div
          className="text-6xl font-light mb-2"
          style={{
            background: `linear-gradient(135deg, ${rankColor}, #f0d060)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontFamily: "var(--font-noto-serif-jp), serif",
          }}
        >
          {result.score}
          <span className="text-3xl">%</span>
        </div>
        <HeartVisualization score={result.score} />
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full" style={{ background: `${rankColor}22`, border: `1px solid ${rankColor}55` }}>
          <span className="text-lg font-bold" style={{ color: rankColor }}>{result.rank}</span>
          <span className="text-sm" style={{ color: rankColor }}>{RANK_LABELS[result.rank]}</span>
        </div>
        <p className="mt-3 text-base font-medium" style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}>
          {result.label}
        </p>
      </div>

      <div className="card-glow rounded-2xl p-5">
        <p className="text-xs tracking-widest mb-3" style={{ color: "#34d399", opacity: 0.8 }}>
          ✦ 強み
        </p>
        <p className="text-sm leading-relaxed opacity-75">{result.strengths}</p>
      </div>

      <div className="card-glow rounded-2xl p-5">
        <p className="text-xs tracking-widest mb-3" style={{ color: "#f87171", opacity: 0.8 }}>
          ⚠ 注意点
        </p>
        <p className="text-sm leading-relaxed opacity-75">{result.cautions}</p>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.3)" }}
      >
        <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.8 }}>
          💫 アドバイス
        </p>
        <p className="text-sm leading-relaxed opacity-80">{result.advice}</p>
      </div>

      <div className="text-center pt-4">
        <button onClick={onReset} className="btn-outline-gold px-8 py-3 rounded-full text-sm tracking-widest">
          もう一度診断する
        </button>
      </div>
    </div>
  );
}

// ── Group results ─────────────────────────────────────────────

function GroupCompatibilityResult({
  allMembers,
  onReset,
}: {
  allMembers: ParsedCode[];
  onReset: () => void;
}) {
  const n = allMembers.length;

  // Calculate all pairs
  const pairs: PairResult[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const result = calculateFullCompatibility(allMembers[i], allMembers[j]);
      pairs.push({
        idxA: i,
        idxB: j,
        labelA: memberLabel(i),
        labelB: memberLabel(j),
        score: result.total,
      });
    }
  }

  // Sort descending by score
  const ranked = [...pairs].sort((a, b) => b.score - a.score);

  // Average score
  const avg = pairs.length > 0
    ? Math.round(pairs.reduce((s, p) => s + p.score, 0) / pairs.length)
    : 0;

  // Best match for "あなた" (index 0)
  const myPairs = ranked.filter((p) => p.idxA === 0 || p.idxB === 0);
  const bestForMe = myPairs[0];

  // Matrix display limit
  const matrixN = Math.min(n, MAX_MATRIX);
  const showMatrixNote = n > MAX_MATRIX;

  // Build score map for matrix
  const scoreMap = new Map<string, number>();
  for (const p of pairs) {
    scoreMap.set(`${p.idxA}_${p.idxB}`, p.score);
    scoreMap.set(`${p.idxB}_${p.idxA}`, p.score);
  }

  // MBTI intro/extrovert count
  const introCount = allMembers.filter((m) => m.mbti[0] === "I").length;
  const extroCount = n - introCount;
  const introBar = Math.round((introCount / n) * 5);
  const extroBar = Math.round((extroCount / n) * 5);

  // Top 10 pairs for large groups
  const displayedPairs = ranked.slice(0, Math.min(ranked.length, 10));

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#EDEDED",
    borderRadius: "12px",
    padding: "10px 14px",
    fontSize: "13px",
    outline: "none",
    fontFamily: "monospace",
    letterSpacing: "0.08em",
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="text-center">
        <p className="text-xs tracking-[0.3em] opacity-50 mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━━</p>
        <p className="text-sm font-medium tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>グループ相性ランキング</p>
        <p className="text-xs tracking-[0.3em] opacity-50 mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━━</p>
      </div>

      {/* Ranking list */}
      <div className="card-glow rounded-2xl p-5 space-y-3">
        {displayedPairs.map((p, i) => {
          const filled = Math.round(p.score / 20);
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="text-base w-8 flex-shrink-0">{rankMedal(i)}</span>
              <span className="text-sm flex-1" style={{ color: "#EDEDED" }}>
                {p.labelA} × {p.labelB}
              </span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((h) => (
                  <svg key={h} width="14" height="14" viewBox="0 0 24 24"
                    fill={h <= filled ? "#e8a0bf" : "none"} stroke="#e8a0bf" strokeWidth="1.5"
                    opacity={h <= filled ? 1 : 0.25}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold w-10 text-right" style={{ color: "rgba(255,255,255,0.55)" }}>{p.score}%</span>
            </div>
          );
        })}
        {ranked.length > 10 && (
          <p className="text-xs opacity-40 text-center pt-1">上位10ペアを表示 (全{ranked.length}ペア)</p>
        )}
      </div>

      {/* Group average */}
      <div
        className="rounded-2xl p-5 text-center"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(232,160,191,0.08))", border: "1px solid rgba(255,255,255,0.3)" }}
      >
        <p className="text-xs tracking-widest mb-2 opacity-60" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━━</p>
        <p className="text-sm tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>グループ平均相性</p>
        <div
          className="text-5xl font-light mb-1"
          style={{
            color: "#EDEDED",
            fontFamily: "var(--font-noto-serif-jp), serif",
          }}
        >
          {avg}<span className="text-2xl">%</span>
        </div>
        {avg >= 80 && <span className="text-lg">🎉</span>}
        <p className="text-xs tracking-widest mt-2 opacity-60" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━━</p>
      </div>

      {/* Best match for あなた */}
      {bestForMe && (
        <div className="card-glow rounded-2xl p-5">
          <p className="text-xs tracking-widest mb-1 opacity-60" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━━</p>
          <p className="text-sm tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.55)" }}>あなたと最も相性がいい人</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>
                {bestForMe.idxA === 0 ? bestForMe.labelB : bestForMe.labelA}
                <span className="ml-2 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{bestForMe.score}%</span>
              </p>
              <p className="text-xs opacity-60 mt-0.5">
                {(() => {
                  const other = allMembers[bestForMe.idxA === 0 ? bestForMe.idxB : bestForMe.idxA];
                  return `${other.mbti}との組み合わせ — ${other.zodiac}座`;
                })()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Compatibility matrix (3+ people) */}
      {n >= 3 && (
        <div className="card-glow rounded-2xl p-5">
          <p className="text-xs tracking-widest mb-3 opacity-70" style={{ color: "rgba(255,255,255,0.55)" }}>✦ 相性マトリックス</p>
          {showMatrixNote && (
            <p className="text-xs opacity-40 mb-3">上位{MAX_MATRIX}人を表示</p>
          )}
          <div className="overflow-x-auto">
            <table style={{ borderCollapse: "separate", borderSpacing: "3px", fontSize: "11px" }}>
              <thead>
                <tr>
                  <th style={{ width: "48px" }} />
                  {Array.from({ length: matrixN }, (_, j) => (
                    <th key={j} style={{ width: "44px", padding: "2px", textAlign: "center", color: "rgba(255,255,255,0.55)", opacity: 0.7, fontWeight: 600 }}>
                      {j === 0 ? "あなた" : `M${j + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: matrixN }, (_, i) => (
                  <tr key={i}>
                    <td style={{ padding: "2px 4px", color: "rgba(255,255,255,0.55)", opacity: 0.7, fontWeight: 600, whiteSpace: "nowrap" }}>
                      {i === 0 ? "あなた" : `M${i + 1}`}
                    </td>
                    {Array.from({ length: matrixN }, (_, j) => {
                      if (i === j) {
                        return (
                          <td key={j} style={{ textAlign: "center", padding: "3px", borderRadius: "4px", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>
                            ─
                          </td>
                        );
                      }
                      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
                      const score = scoreMap.get(key) ?? 0;
                      return (
                        <td key={j} style={{ textAlign: "center", padding: "3px", borderRadius: "4px", ...scoreCellStyle(score) }}>
                          {score}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MBTI balance analysis */}
      <div className="card-glow rounded-2xl p-5">
        <p className="text-xs tracking-widest mb-4 opacity-70" style={{ color: "rgba(255,255,255,0.55)" }}>✦ タイプ別分析</p>
        <p className="text-xs mb-3 opacity-60">グループのMBTIバランス:</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs opacity-60 w-20 flex-shrink-0">内向型 (I)</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((b) => (
                <div key={b} style={{ width: "16px", height: "8px", borderRadius: "2px", background: b <= introBar ? "#93c5fd" : "rgba(255,255,255,0.08)" }} />
              ))}
            </div>
            <span className="text-xs opacity-60">{introCount}人</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs opacity-60 w-20 flex-shrink-0">外向型 (E)</span>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((b) => (
                <div key={b} style={{ width: "16px", height: "8px", borderRadius: "2px", background: b <= extroBar ? "#f9a8d4" : "rgba(255,255,255,0.08)" }} />
              ))}
            </div>
            <span className="text-xs opacity-60">{extroCount}人</span>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <button onClick={onReset} className="btn-outline-gold px-8 py-3 rounded-full text-sm tracking-widest">
          もう一度診断する
        </button>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────

export default function AiseiPage() {
  const [mode, setMode] = useState<Mode>("group");

  // Group mode state
  const [myCode, setMyCode]           = useState<string>("");
  const [inputCode, setInputCode]     = useState<string>("");
  const [members, setMembers]         = useState<ParsedCode[]>([]);
  const [groupError, setGroupError]   = useState<string | null>(null);
  const [groupResult, setGroupResult] = useState<ParsedCode[] | null>(null);

  // Code mode state (2-person)
  const [myCodeInput, setMyCodeInput]         = useState("");
  const [friendCodeInput, setFriendCodeInput] = useState("");
  const [codeError, setCodeError]             = useState<string | null>(null);
  const [parsedA, setParsedA]                 = useState<ParsedCode | null>(null);
  const [parsedB, setParsedB]                 = useState<ParsedCode | null>(null);

  // MBTI mode state
  const [personA, setPersonA]   = useState<MBTIType | null>(null);
  const [personB, setPersonB]   = useState<MBTIType | null>(null);
  const [mbtiStep, setMbtiStep] = useState<1 | 2 | 3>(1);

  // Pre-fill own code from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("revela_mycode");
      if (saved) {
        setMyCode(saved);
        setMyCodeInput(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // ── Group mode handlers ──
  const handleAddMember = () => {
    setGroupError(null);
    const parsed = parseRevelaCode(inputCode.trim());
    if (!parsed) {
      setGroupError("コードの形式が正しくありません（例: INFJ-LCRO-かに-星）");
      return;
    }
    if (members.length + 1 >= MAX_MEMBERS) {
      setGroupError(`最大${MAX_MEMBERS}人までです`);
      return;
    }
    setMembers((prev) => [...prev, parsed]);
    setInputCode("");
  };

  const handleRemoveMember = (index: number) => {
    setMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGroupSubmit = () => {
    setGroupError(null);
    const selfParsed = parseRevelaCode(myCode.trim());
    if (!selfParsed) {
      setGroupError("あなたのコードの形式が正しくありません（例: ENFP-FCRO-うお-月）");
      return;
    }
    if (members.length === 0) {
      setGroupError("メンバーを1人以上追加してください");
      return;
    }
    setGroupResult([selfParsed, ...members]);
  };

  const resetGroup = () => {
    setGroupResult(null);
    setGroupError(null);
  };

  // ── 2-person code mode handlers ──
  const handleCodeSubmit = () => {
    setCodeError(null);
    const a = parseRevelaCode(myCodeInput.trim());
    const b = parseRevelaCode(friendCodeInput.trim());
    if (!a) {
      setCodeError("あなたのコードの形式が正しくありません（例: ENFP-FCRO-うお-月）");
      return;
    }
    if (!b) {
      setCodeError("友達のコードの形式が正しくありません（例: INFJ-LCRO-かに-星）");
      return;
    }
    setParsedA(a);
    setParsedB(b);
  };

  const resetCode = () => {
    setParsedA(null);
    setParsedB(null);
    setCodeError(null);
  };

  // ── MBTI mode handlers ──
  const showMbtiResult = mbtiStep === 3 && personA && personB;

  const resetMbti = () => {
    setPersonA(null);
    setPersonB(null);
    setMbtiStep(1);
  };

  const handleMbtiNext = () => {
    if (mbtiStep === 1 && personA) setMbtiStep(2);
    else if (mbtiStep === 2 && personB) setMbtiStep(3);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#EDEDED",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "monospace",
    letterSpacing: "0.08em",
    transition: "border-color 0.2s ease",
  };

  const isResultShowing = !!groupResult || !!parsedA || showMbtiResult;

  return (
    <div className="relative min-h-screen px-4 py-12 max-w-2xl mx-auto">
      {/* Decorative orb */}
      <div
        className="orb w-80 h-80 opacity-10"
        style={{ background: "radial-gradient(circle, #e8a0bf, transparent)", top: "10%", right: "-15%" }}
      />

      {/* Header */}
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.4em] mb-3" style={{ color: "rgba(255,255,255,0.55)", opacity: 0.7 }}>
          COMPATIBILITY
        </p>
        <h1
          className="text-3xl sm:text-4xl font-light mb-4"
          style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
        >
          相性診断
        </h1>
        <p className="text-sm opacity-50 max-w-sm mx-auto leading-relaxed">
          revelaコードで4次元の相性を確かめよう。
        </p>
        <div className="divider-gold w-20 mx-auto mt-4" />
      </div>

      {/* ── MODE TABS ── */}
      {!isResultShowing && (
        <div className="flex gap-2 mb-8">
          {(["group", "code", "mbti"] as Mode[]).map((m) => {
            const labels: Record<Mode, string> = {
              group: "グループ相性診断",
              code: "2人で診断",
              mbti: "MBTIで診断",
            };
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-200"
                style={{
                  background: mode === m
                    ? "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))"
                    : "rgba(255,255,255,0.03)",
                  border: mode === m ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                  color: mode === m ? "rgba(255,255,255,0.55)" : "rgba(240,230,211,0.5)",
                }}
              >
                {labels[m]}
              </button>
            );
          })}
        </div>
      )}

      {/* ── GROUP MODE INPUT ── */}
      {mode === "group" && !groupResult && (
        <div className="animate-fade-in">
          <div className="card-glow rounded-2xl p-6 mb-6">
            <div className="text-center mb-5">
              <p className="text-xs tracking-[0.3em] opacity-50 mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━━</p>
              <p className="text-sm font-medium tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>グループ相性診断</p>
              <p className="text-xs tracking-[0.3em] opacity-50 mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━━</p>
            </div>

            {/* My code */}
            <div className="mb-5">
              <label className="block text-xs tracking-widest mb-2 opacity-60">あなたのコード</label>
              <input
                type="text"
                placeholder="例: ENFP-FCRO-うお-月"
                value={myCode}
                onChange={(e) => setMyCode(e.target.value)}
                style={inputStyle}
              />
            </div>

            {/* Add member */}
            <div className="mb-5">
              <label className="block text-xs tracking-widest mb-2 opacity-60">友達のコードを追加</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="例: INFJ-LCRO-かに-星"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAddMember(); }}
                  style={{ ...inputStyle, flex: 1, width: undefined }}
                />
                <button
                  onClick={handleAddMember}
                  disabled={!inputCode.trim() || members.length >= MAX_MEMBERS - 1}
                  className="px-4 py-2 rounded-xl text-sm font-bold tracking-wider transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))",
                    border: "1px solid rgba(255,255,255,0.5)",
                    color: "rgba(255,255,255,0.55)",
                    whiteSpace: "nowrap",
                  }}
                >
                  追加 +
                </button>
              </div>
            </div>

            {/* Member list */}
            {members.length > 0 && (
              <div className="mb-5">
                <p className="text-xs tracking-widest mb-3 opacity-60">追加されたメンバー:</p>
                <div className="space-y-2">
                  {/* あなた row */}
                  {myCode.trim() && parseRevelaCode(myCode.trim()) && (
                    <div
                      className="flex items-center gap-3 px-3 py-2 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.2)" }}
                    >
                      <span className="text-sm">👤</span>
                      <span className="text-xs font-bold w-16 flex-shrink-0" style={{ color: "rgba(255,255,255,0.55)" }}>あなた</span>
                      <span className="text-xs opacity-60 flex-1 font-mono">{myCode.trim()}</span>
                    </div>
                  )}
                  {members.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                      <span className="text-sm">👤</span>
                      <span className="text-xs font-bold w-16 flex-shrink-0" style={{ color: "#EDEDED" }}>メンバー{i + 2}</span>
                      <span className="text-xs opacity-60 flex-1 font-mono">{m.mbti}-{m.loveType}-{m.zodiac}-{m.tarot}</span>
                      <button
                        onClick={() => handleRemoveMember(i)}
                        className="text-xs opacity-50 hover:opacity-90 transition-opacity px-1"
                        style={{ color: "#f87171" }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs opacity-40 mt-3 text-right">
                  メンバー数: {members.length + 1}人 / 最大{MAX_MEMBERS}人
                </p>
              </div>
            )}

            {groupError && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-xs leading-relaxed"
                style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
              >
                {groupError}
              </div>
            )}

            <button
              onClick={handleGroupSubmit}
              disabled={!myCode.trim() || members.length === 0}
              className="btn-gold w-full py-4 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              グループ相性診断する ✦
            </button>
          </div>

          <p className="text-xs opacity-40 text-center leading-relaxed">
            revelaコードはrevela診断の結果ページで確認できます。<br />
            形式: MBTI-キャラコード-星座-タロット
          </p>
        </div>
      )}

      {/* Group result */}
      {mode === "group" && groupResult && (
        <GroupCompatibilityResult allMembers={groupResult} onReset={resetGroup} />
      )}

      {/* ── 2-PERSON CODE MODE ── */}
      {mode === "code" && !parsedA && (
        <div className="animate-fade-in">
          <div className="card-glow rounded-2xl p-6 mb-6">
            <div className="text-center mb-5">
              <p className="text-xs tracking-[0.3em] opacity-50 mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━━</p>
              <p className="text-sm font-medium tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>友達のrevelaコードを入力</p>
              <p className="text-xs tracking-[0.3em] opacity-50 mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>━━━━━━━━━━━━━━━━━━━━━━━</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest mb-2 opacity-60">あなたのコード</label>
                <input
                  type="text"
                  placeholder="例: ENFP-FCRO-うお-月"
                  value={myCodeInput}
                  onChange={(e) => setMyCodeInput(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest mb-2 opacity-60">友達のコード</label>
                <input
                  type="text"
                  placeholder="例: INFJ-LCRO-かに-星"
                  value={friendCodeInput}
                  onChange={(e) => setFriendCodeInput(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {codeError && (
              <div
                className="mt-4 px-4 py-3 rounded-xl text-xs leading-relaxed"
                style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171" }}
              >
                {codeError}
              </div>
            )}

            <button
              onClick={handleCodeSubmit}
              disabled={!myCodeInput.trim() || !friendCodeInput.trim()}
              className="btn-gold w-full py-4 rounded-full text-sm tracking-widest font-bold mt-5 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              相性診断する ✦
            </button>
          </div>

          <p className="text-xs opacity-40 text-center leading-relaxed">
            revelaコードはrevela診断の結果ページで確認できます。<br />
            形式: MBTI-キャラコード-星座-タロット
          </p>
        </div>
      )}

      {mode === "code" && parsedA && parsedB && (
        <CodeCompatibilityResult codeA={parsedA} codeB={parsedB} onReset={resetCode} />
      )}

      {/* ── MBTI MODE ── */}
      {mode === "mbti" && !showMbtiResult && (
        <div className="animate-fade-in">
          <div className="flex justify-center gap-8 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="text-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 text-xs font-bold"
                  style={{
                    background:
                      s < mbtiStep
                        ? "rgba(255,255,255,0.12)"
                        : s === mbtiStep
                        ? "rgba(255,255,255,0.2)"
                        : "rgba(255,255,255,0.05)",
                    border: s === mbtiStep ? "2px solid rgba(255,255,255,0.7)" : "1px solid rgba(255,255,255,0.1)",
                    color: s < mbtiStep ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {s < mbtiStep ? "✓" : s}
                </div>
                <p className="text-xs opacity-40">
                  {s === 1 ? "あなた" : s === 2 ? "相手" : "結果"}
                </p>
              </div>
            ))}
          </div>

          {mbtiStep === 1 && (
            <div>
              <div className="card-glow rounded-2xl p-6 mb-6">
                <MBTISelector label="PERSON A ─ あなたのタイプ" selected={personA} onSelect={setPersonA} />
              </div>
              <div className="text-center">
                <button
                  onClick={handleMbtiNext}
                  disabled={!personA}
                  className="btn-gold px-10 py-3 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  次へ →
                </button>
              </div>
            </div>
          )}

          {mbtiStep === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.1)", color: "#EDEDED" }}
                >
                  {personA}
                </div>
                <div>
                  <p className="text-xs opacity-50 tracking-widest">あなたのタイプ</p>
                  <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{personA}</p>
                </div>
              </div>
              <div className="card-glow rounded-2xl p-6 mb-6">
                <MBTISelector label="PERSON B ─ 相手のタイプ" selected={personB} onSelect={setPersonB} />
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setMbtiStep(1)} className="btn-outline-gold px-6 py-3 rounded-full text-sm tracking-widest">
                  ← 戻る
                </button>
                <button
                  onClick={handleMbtiNext}
                  disabled={!personB}
                  className="btn-gold px-10 py-3 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  診断する →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "mbti" && showMbtiResult && personA && personB && (
        <MbtiCompatibilityResult personA={personA} personB={personB} onReset={resetMbti} />
      )}
    </div>
  );
}
