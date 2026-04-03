"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import {
  getResultReading,
  loveTypeDescriptions,
  mbtiDescriptions,
} from "@/data/questions";
import type { LoveType } from "@/data/questions";
import { zodiacInfo } from "@/lib/calculate";
import { getRpgClassByCombo } from "@/data/rpgClasses";
import { generateRevelaCode } from "@/lib/revelaCodes";
import { getMbtiCharaName } from "@/data/charaNames";

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

const MBTI_COLORS: Record<string, { primary: string; bg: string; label: string }> = {
  INTJ: { primary: "#7c3aed", bg: "rgba(124,58,237,0.15)", label: "戦略型" },
  INTP: { primary: "#8b5cf6", bg: "rgba(139,92,246,0.15)", label: "戦略型" },
  ENTJ: { primary: "#6d28d9", bg: "rgba(109,40,217,0.15)", label: "戦略型" },
  ENTP: { primary: "#a78bfa", bg: "rgba(167,139,250,0.15)", label: "戦略型" },
  INFJ: { primary: "#059669", bg: "rgba(5,150,105,0.15)", label: "共鳴型" },
  INFP: { primary: "#10b981", bg: "rgba(16,185,129,0.15)", label: "共鳴型" },
  ENFJ: { primary: "#047857", bg: "rgba(4,120,87,0.15)", label: "共鳴型" },
  ENFP: { primary: "#34d399", bg: "rgba(52,211,153,0.15)", label: "共鳴型" },
  ISTJ: { primary: "#1d4ed8", bg: "rgba(29,78,216,0.15)", label: "堅実型" },
  ISFJ: { primary: "#2563eb", bg: "rgba(37,99,235,0.15)", label: "堅実型" },
  ESTJ: { primary: "#1e40af", bg: "rgba(30,64,175,0.15)", label: "堅実型" },
  ESFJ: { primary: "#3b82f6", bg: "rgba(59,130,246,0.15)", label: "堅実型" },
  ISTP: { primary: "#92400e", bg: "rgba(146,64,14,0.15)", label: "感応型" },
  ISFP: { primary: "#d97706", bg: "rgba(217,119,6,0.15)", label: "感応型" },
  ESTP: { primary: "#b45309", bg: "rgba(180,83,9,0.15)", label: "感応型" },
  ESFP: { primary: "#f59e0b", bg: "rgba(245,158,11,0.15)", label: "感応型" },
};

function ResultView() {
  const params = useSearchParams();
  const mbti = params.get("mbti") ?? "";
  const love = params.get("love") as LoveType | null;
  const zodiac = params.get("zodiac") ?? "なし";
  const tarot = params.get("tarot") ?? "";
  const reversed = params.get("reversed") === "1";

  const [codeCopied, setCodeCopied] = useState(false);

  if (!mbti || !love || !tarot) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>データが見つかりません</p>
        <Link href="/history" className="text-xs underline opacity-50">← 履歴に戻る</Link>
      </div>
    );
  }

  const reading = getResultReading(mbti, love, zodiac, tarot, reversed);
  const mbtiColor = MBTI_COLORS[mbti] ?? { primary: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.08)", label: "" };
  const loveInfo = loveTypeDescriptions[love];
  const mbtiInfo = mbtiDescriptions[mbti];
  const zodiacData = zodiac !== "なし" ? zodiacInfo[zodiac] : null;
  const rpg = getRpgClassByCombo(mbti, love);

  const revelCode = rpg ? generateRevelaCode(mbti, love, rpg.name) : null;
  const handleCopyCode = async () => {
    if (!revelCode) return;
    try {
      await navigator.clipboard.writeText(revelCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    } catch { /* silent */ }
  };

  const chips = [
    { label: "現在地", value: mbti, sub: mbtiColor.label, color: mbtiColor.primary, bg: mbtiColor.bg },
    { label: "本音", value: loveInfo?.nickname ?? love, sub: "", color: "#e8a0bf", bg: "rgba(232,160,191,0.12)" },
  ];

  const sectionBox: React.CSSProperties = {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: "9px",
    letterSpacing: "0.25em",
    color: "rgba(255,255,255,0.35)",
    marginBottom: "10px",
    textTransform: "uppercase",
  };

  // Yu-Gi-Oh card data
  const atk = YGO_ATK[love] ?? 2000;
  const def = YGO_DEF[love] ?? 1500;
  const stars = Math.max(4, Math.min(9, Math.round(atk / 350)));
  const grp = love.charAt(0);
  const sec = love.charAt(1);
  const catchphrase = getMbtiCharaName(mbti, love) ?? `${MBTI_ADJ[mbti] ?? ""}${loveInfo?.nickname ?? ""}`;
  const rpgName = rpg?.name ?? "冒険者";
  const rpgEmoji = rpg?.emoji ?? "⚔️";
  const zodiacElem = zodiacData?.element ?? null;
  const ELEM_STYLE: Record<string, { bg: string; color: string; symbol: string }> = {
    火: { bg: "linear-gradient(135deg, #ff6030, #cc2200)", color: "#fff", symbol: "🔥" },
    土: { bg: "linear-gradient(135deg, #a08040, #604010)", color: "#f0e0b0", symbol: "🌍" },
    風: { bg: "linear-gradient(135deg, #60d0a0, #208060)", color: "#fff", symbol: "💨" },
    水: { bg: "linear-gradient(135deg, #4090e0, #1040a0)", color: "#fff", symbol: "💧" },
  };
  const elemSt = zodiacElem ? ELEM_STYLE[zodiacElem] : { bg: "linear-gradient(135deg, #888,#444)", color: "#fff", symbol: "✦" };
  const attrDisplay = zodiacElem ? `${elemSt.symbol} ${zodiac}` : "？";
  const typeKey = `${grp}${sec}`;
  const TYPE_STYLE: Record<string, { frameOuter: string; frameInner: string; nameBg: string; nameColor: string; artBg: string; artAccent: string; cardBg: string }> = {
    LC: { frameOuter: "#d4af37", frameInner: "#8b6914", nameBg: "linear-gradient(90deg, #1a1000, #2d1f00, #1a1000)", nameColor: "#f0d060", artBg: "linear-gradient(160deg, #0d0800 0%, #1c1400 50%, #0a0600 100%)", artAccent: "#d4af37", cardBg: "linear-gradient(175deg, #1c1200 0%, #0e0900 100%)" },
    LA: { frameOuter: "#e8834a", frameInner: "#8b3a00", nameBg: "linear-gradient(90deg, #1a0600, #2d1000, #1a0600)", nameColor: "#ffb070", artBg: "linear-gradient(160deg, #100500 0%, #1e0a00 50%, #0d0300 100%)", artAccent: "#e8834a", cardBg: "linear-gradient(175deg, #1a0800 0%, #0d0300 100%)" },
    FC: { frameOuter: "#8ab4d4", frameInner: "#2a4a6a", nameBg: "linear-gradient(90deg, #030810, #091428, #030810)", nameColor: "#a8d4f0", artBg: "linear-gradient(160deg, #030810 0%, #050f1e 50%, #020608 100%)", artAccent: "#6ab0e8", cardBg: "linear-gradient(175deg, #04080f 0%, #020508 100%)" },
    FA: { frameOuter: "#9b59b6", frameInner: "#4a1060", nameBg: "linear-gradient(90deg, #0d001a, #1a0030, #0d001a)", nameColor: "#c87ef8", artBg: "linear-gradient(160deg, #080010 0%, #120020 50%, #050008 100%)", artAccent: "#9b59b6", cardBg: "linear-gradient(175deg, #0d001a 0%, #060008 100%)" },
  };
  const ts = TYPE_STYLE[typeKey] ?? TYPE_STYLE.LC;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      {/* Back */}
      <Link href="/history" className="inline-flex items-center gap-1.5 text-xs mb-8 opacity-40 hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
        ← 履歴に戻る
      </Link>

      {/* 遊戯王風カード */}
      <div className="flex justify-center mb-8">
        <div style={{ width: 260, position: "relative", borderRadius: 10, background: ts.cardBg, boxShadow: `0 16px 60px rgba(0,0,0,0.85), 0 0 30px ${ts.frameOuter}44, inset 0 0 0 3px ${ts.frameOuter}, inset 0 0 0 5px ${ts.frameInner}, inset 0 0 0 7px ${ts.frameOuter}88`, padding: 8 }}>
          <div style={{ background: ts.nameBg, border: `1px solid ${ts.frameOuter}88`, borderRadius: 4, padding: "5px 8px", marginBottom: 5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: ts.nameColor, letterSpacing: "0.02em", lineHeight: 1.2, flex: 1 }}>{catchphrase}</span>
            <div style={{ borderRadius: 6, background: elemSt.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 0 8px ${ts.frameOuter}88`, fontSize: 8, fontWeight: 700, color: elemSt.color, padding: "2px 5px", whiteSpace: "nowrap" }}>{attrDisplay}</div>
          </div>
          <div style={{ textAlign: "right", marginBottom: 5, paddingRight: 2 }}>
            {Array.from({ length: stars }).map((_, i) => <span key={i} style={{ color: ts.frameOuter, fontSize: 14, textShadow: `0 0 6px ${ts.frameOuter}` }}>★</span>)}
          </div>
          <div style={{ width: "100%", aspectRatio: "1/1", borderRadius: 4, border: `2px solid ${ts.frameOuter}66`, background: ts.artBg, marginBottom: 6, position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }} viewBox="0 0 244 244">
              <circle cx="122" cy="122" r="90" stroke={ts.artAccent} strokeWidth="1" fill="none" />
              <circle cx="122" cy="122" r="60" stroke={ts.artAccent} strokeWidth="0.7" fill="none" />
              <circle cx="122" cy="122" r="30" stroke={ts.artAccent} strokeWidth="0.5" fill="none" />
              {[0,45,90,135,180,225,270,315].map((deg) => { const r2 = (deg * Math.PI) / 180; return <line key={deg} x1="122" y1="122" x2={122 + 90 * Math.cos(r2)} y2={122 + 90 * Math.sin(r2)} stroke={ts.artAccent} strokeWidth="0.5" />; })}
              <polygon points="122,32 202,172 42,172" stroke={ts.artAccent} strokeWidth="1" fill="none" />
              <polygon points="122,212 42,72 202,72" stroke={ts.artAccent} strokeWidth="0.7" fill="none" />
            </svg>
            <span style={{ fontSize: 72, position: "relative", zIndex: 1, filter: `drop-shadow(0 0 16px ${ts.artAccent})` }}>{rpgEmoji}</span>
            <div style={{ position: "absolute", bottom: 6, right: 6, background: `${ts.artAccent}22`, border: `1px solid ${ts.artAccent}66`, borderRadius: 3, padding: "2px 6px", fontSize: 9, color: ts.artAccent, fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em" }}>{mbti} × {love}</div>
          </div>
          <div style={{ fontSize: 9, color: `${ts.nameColor}cc`, marginBottom: 4, paddingLeft: 2, fontWeight: 600, letterSpacing: "0.05em" }}>{`【${zodiac !== "なし" ? zodiac : "星座不明"}／${rpgName}】`}</div>
          <div style={{ background: `${ts.artAccent}0a`, border: `1px solid ${ts.frameOuter}44`, borderRadius: 4, padding: "6px 7px", marginBottom: 8, fontSize: 9, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, minHeight: 52 }}>
            {loveInfo?.subtitle}。{loveInfo?.motto}
            {rpg && <span style={{ display: "block", marginTop: 4, opacity: 0.7, borderTop: `1px solid ${ts.frameOuter}33`, paddingTop: 4 }}>{rpgEmoji}【{rpgName}】{rpg.tagline}</span>}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, borderTop: `1px solid ${ts.frameOuter}44`, paddingTop: 6 }}>
            {[{ label: "ATK", val: atk }, { label: "DEF", val: def }].map(({ label, val }) => (
              <div key={label} style={{ textAlign: "right" }}>
                <span style={{ fontSize: 9, color: `${ts.nameColor}99`, letterSpacing: "0.1em" }}>{label}/</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: ts.nameColor, fontFamily: "monospace", letterSpacing: "0.05em" }}>{String(val).padStart(4, "\u2007")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5 chips */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {chips.map((c) => (
          <div key={c.label} className="rounded-2xl p-4 text-center" style={{ background: c.bg, border: `1px solid ${c.color}33` }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>{c.label}</p>
            <p className="font-bold" style={{ color: c.color, fontSize: "15px", lineHeight: 1.2 }}>{c.value}</p>
            {c.sub && <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{c.sub}</p>}
          </div>
        ))}
        {rpg && (
          <div className="rounded-2xl p-4 text-center col-span-2" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.25)" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>職業RPG</p>
            <p className="font-bold" style={{ color: "#a78bfa", fontSize: "15px" }}>{rpg.emoji} {rpg.name}</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{rpg.tagline}</p>
            <Link
              href={`/blog/${rpg.id}-guide`}
              className="inline-flex items-center gap-1 mt-3 text-xs tracking-wider transition-opacity hover:opacity-80"
              style={{ color: "#a78bfa", borderBottom: "1px solid rgba(167,139,250,0.3)", paddingBottom: "1px" }}
            >
              {rpg.name}の自己分析ガイドを読む →
            </Link>
          </div>
        )}
      </div>

      {/* MBTI title */}
      {mbtiInfo && (
        <div className="text-center mb-6 px-2">
          <p className="text-xs tracking-widest mb-1" style={{ color: mbtiColor.primary, opacity: 0.8 }}>{mbti} — {mbtiColor.label}</p>
          <p className="text-lg font-medium" style={{ color: "#e8e8e8", fontFamily: "var(--font-noto-serif-jp), serif" }}>{mbtiInfo.title}</p>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-8">
        <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>✦ あなたの本質</p>
        <h1 className="text-2xl sm:text-3xl font-light leading-snug" style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "#f0f0f0" }}>
          「{reading.title}」
        </h1>
      </div>

      {/* Description */}
      <div style={sectionBox}>
        <p style={sectionLabel}>自己分析レポート</p>
        <div
          className="text-sm leading-relaxed"
          style={{ color: "rgba(255,255,255,0.75)" }}
          dangerouslySetInnerHTML={{ __html: reading.description }}
        />
      </div>

      {/* Strengths */}
      {reading.strengths.length > 0 && (
        <div style={sectionBox}>
          <p style={sectionLabel}>強み</p>
          <div className="space-y-3">
            {reading.strengths.map((s, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-sm font-medium mb-1" style={{ color: "#e8e8e8" }}>✦ {s.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {reading.challenges.length > 0 && (
        <div style={sectionBox}>
          <p style={sectionLabel}>課題・成長ポイント</p>
          <div className="space-y-3">
            {reading.challenges.map((c, i) => (
              <div key={i} className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-sm font-medium mb-1" style={{ color: "#e8e8e8" }}>△ {c.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{c.detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Love reading */}
      <div style={sectionBox}>
        <p style={sectionLabel}>恋愛・対人傾向</p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{reading.loveReading}</p>
      </div>

      {/* Cosmic message */}
      <div style={{ ...sectionBox, borderColor: "rgba(192,132,252,0.2)" }}>
        <p style={{ ...sectionLabel, color: "#c084fc" }}>タロットメッセージ — {tarot}{reversed ? "（逆位置）" : ""}</p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{reading.cosmicMessage}</p>
      </div>

      {/* Lucky elements */}
      <div style={sectionBox}>
        <p style={sectionLabel}>ラッキー要素</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: "🎨", label: "カラー", value: reading.luckyElements.color },
            { icon: "✨", label: "アイテム", value: reading.luckyElements.item },
            { icon: "📅", label: "デー", value: reading.luckyElements.day },
            { icon: "🔢", label: "ナンバー", value: String(reading.luckyElements.number) },
          ].map((el) => (
            <div key={el.label} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-lg mb-1">{el.icon}</p>
              <p style={{ fontSize: "9px", letterSpacing: "0.15em", color: "rgba(255,255,255,0.35)", marginBottom: "4px" }}>{el.label}</p>
              <p className="text-xs font-medium" style={{ color: "#e8e8e8" }}>{el.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advice */}
      <div style={{ ...sectionBox, textAlign: "center" }}>
        <p style={sectionLabel}>アドバイス</p>
        <p className="text-sm leading-relaxed italic" style={{ color: "rgba(255,255,255,0.8)" }}>「{reading.advice}」</p>
      </div>

      {/* Revela Code */}
      {revelCode && (
        <div className="rounded-2xl p-5 mb-4 text-center" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(232,160,191,0.05))", border: "1px solid rgba(255,255,255,0.15)" }}>
          <p className="text-xs tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>あなたのrevelaコード</p>
          <div className="flex items-center justify-center gap-3">
            <div
              className="px-5 py-2.5 rounded-xl text-sm font-bold tracking-widest"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.85)", fontFamily: "monospace" }}
            >
              {revelCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="px-4 py-2.5 rounded-xl text-xs font-bold tracking-widest transition-all duration-200"
              style={{
                background: codeCopied ? "linear-gradient(135deg,#059669,#10b981)" : "rgba(255,255,255,0.08)",
                color: codeCopied ? "#fff" : "rgba(255,255,255,0.7)",
                border: codeCopied ? "none" : "1px solid rgba(255,255,255,0.2)",
                minWidth: "72px",
              }}
            >
              {codeCopied ? "✓ コピー済" : "コピー"}
            </button>
          </div>
          <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.3)" }}>友達と相性診断できます →{" "}
            <Link href="/shindan/aisei" className="underline opacity-60">相性診断</Link>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mt-8">
        <Link href="/history" className="flex-1 text-center py-3 rounded-full text-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
          ← 履歴
        </Link>
        <Link href="/shindan" className="flex-1 text-center py-3 rounded-full text-sm btn-outline-primary">
          再診断する
        </Link>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ResultView />
    </Suspense>
  );
}
