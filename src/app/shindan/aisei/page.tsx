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
import { mbtiDescriptions } from "@/data/questions";

// ── Constants ────────────────────────────────────────────────

const MBTI_GRID: MBTIType[][] = [
  ["INTJ", "INTP", "ENTJ", "ENTP"],
  ["INFJ", "INFP", "ENFJ", "ENFP"],
  ["ISTJ", "ISFJ", "ESTJ", "ESFJ"],
  ["ISTP", "ISFP", "ESTP", "ESFP"],
];

const MBTI_NAMES: Record<MBTIType, string> = Object.fromEntries(
  Object.entries(mbtiDescriptions).map(([k, v]) => [k, v.shortName])
) as Record<MBTIType, string>;

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

const MAX_MATRIX = 15;

type Mode = "code" | "mbti";


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
      <div className="grid grid-cols-2 gap-2">
        {MBTI_GRID.flat().map((type) => {
          const isSelected = selected === type;
          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
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
                background: isSelected ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                border: isSelected ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.1)",
                boxShadow: isSelected ? "0 0 12px rgba(255,255,255,0.2)" : "none",
              }}
            >
              <span>
                <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: isSelected ? "#EDEDED" : "rgba(255,255,255,0.55)" }}>
                  {type}
                </span>
                <span style={{ display: "block", fontSize: "10px", opacity: 0.5 }}>{MBTI_NAMES[type]}</span>
              </span>
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
  const { total, mbtiScore, charaScore, gapScore, axisBonus, axisComment, comment, strengths, cautions } = result;

  const rank =
    total >= 90 ? "S" : total >= 80 ? "A" : total >= 65 ? "B" : total >= 50 ? "C" : "D";
  const rankColor = RANK_COLORS[rank];

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-center gap-6">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold mx-auto mb-2"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1))", border: "1px solid rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.55)" }}
          >
            {codeA.rpgClassName}
          </div>
          <p className="text-xs opacity-40">あなた</p>
        </div>
        <div className="text-2xl" style={{ color: "#e8a0bf" }}>×</div>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold mx-auto mb-2"
            style={{ background: "linear-gradient(135deg, rgba(232,160,191,0.2), rgba(232,160,191,0.1))", border: "1px solid rgba(232,160,191,0.4)", color: "#e8a0bf" }}
          >
            {codeB.rpgClassName}
          </div>
          <p className="text-xs opacity-40">友達</p>
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
        <ScoreBar label="建前相性"   score={mbtiScore}  color="rgba(255,255,255,0.55)" />
        <ScoreBar label="本音相性"   score={charaScore} color="#e8a0bf" />
        <ScoreBar label="ギャップ補完" score={gapScore}   color="#a78bfa" />
        <ScoreBar label="軸の相性"   score={44 + axisBonus * 11} color="#fbbf24" />
        {axisComment && (
          <p className="text-xs mt-3 leading-relaxed" style={{ color: "rgba(251,191,36,0.7)" }}>{axisComment}</p>
        )}
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

// ── Main page ────────────────────────────────────────────────

export default function AiseiPage() {
  const [mode, setMode] = useState<Mode>("code");

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
      if (saved) setMyCodeInput(saved);
    } catch {
      // ignore
    }
  }, []);

  // ── 2-person code mode handlers ──
  const handleCodeSubmit = () => {
    setCodeError(null);
    const a = parseRevelaCode(myCodeInput.trim());
    const b = parseRevelaCode(friendCodeInput.trim());
    if (!a) {
      setCodeError("あなたのコードの形式が正しくありません（例: 海賊王-3）");
      return;
    }
    if (!b) {
      setCodeError("友達のコードの形式が正しくありません（例: 賢者-12）");
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

  const isResultShowing = !!parsedA || showMbtiResult;

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

      {/* ── パーティーバナー ── */}
      {!isResultShowing && (
        <div
          className="w-full rounded-2xl p-6 mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.03))",
            border: "1px solid rgba(212,175,55,0.25)",
          }}
        >
          <p className="text-xs font-bold tracking-widest mb-4" style={{ color: "#d4af37" }}>
            3人以上の場合はパーティー診断へ
          </p>
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            相性診断は「2人の間にあるもの」を深く掘り下げる。
            お互いの立ち回りがどう噛み合うか、どこで補い合えるか——
            2人だからこそ見える関係性の地図を描く。
          </p>
          <p
            className="text-sm leading-relaxed mb-5"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-noto-serif-jp), serif" }}
          >
            3人以上なら、見るべきものが変わる。
            個人同士のギャップではなく、チーム全体のバランス。
            前衛・後衛・頭脳・自由——それぞれの役割がどう組み合わさるかで、
            パーティーの強みと弱点が決まる。
          </p>
          <a
            href="/party"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-all duration-200 hover:opacity-80"
            style={{
              background: "rgba(212,175,55,0.12)",
              border: "1px solid rgba(212,175,55,0.4)",
              color: "#d4af37",
            }}
          >
            <span>⚔️ 3人以上で試す → パーティー診断</span>
          </a>
        </div>
      )}

      {/* ── MODE TABS ── */}
      {/* Group result */}

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
                  placeholder="例: 海賊王-3"
                  value={myCodeInput}
                  onChange={(e) => setMyCodeInput(e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs tracking-widest mb-2 opacity-60">友達のコード</label>
                <input
                  type="text"
                  placeholder="例: 賢者-12"
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
              className="btn-outline-primary w-full py-4 rounded-full text-sm tracking-widest font-bold mt-5 disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              相性診断する ✦
            </button>
          </div>

          <p className="text-xs opacity-40 text-center leading-relaxed">
            revelaコードはrevela診断の結果ページで確認できます。<br />
            形式: RPGクラス名-番号（例: 海賊王-3）
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
                  className="btn-outline-primary px-10 py-3 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed"
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
                  className="btn-outline-primary px-10 py-3 rounded-full text-sm tracking-widest font-bold disabled:opacity-30 disabled:cursor-not-allowed"
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
