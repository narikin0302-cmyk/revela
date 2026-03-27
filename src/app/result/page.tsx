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

const MBTI_COLORS: Record<string, { primary: string; bg: string; label: string }> = {
  INTJ: { primary: "#7c3aed", bg: "rgba(124,58,237,0.15)", label: "分析家" },
  INTP: { primary: "#8b5cf6", bg: "rgba(139,92,246,0.15)", label: "分析家" },
  ENTJ: { primary: "#6d28d9", bg: "rgba(109,40,217,0.15)", label: "分析家" },
  ENTP: { primary: "#a78bfa", bg: "rgba(167,139,250,0.15)", label: "分析家" },
  INFJ: { primary: "#059669", bg: "rgba(5,150,105,0.15)", label: "外交家" },
  INFP: { primary: "#10b981", bg: "rgba(16,185,129,0.15)", label: "外交家" },
  ENFJ: { primary: "#047857", bg: "rgba(4,120,87,0.15)", label: "外交家" },
  ENFP: { primary: "#34d399", bg: "rgba(52,211,153,0.15)", label: "外交家" },
  ISTJ: { primary: "#1d4ed8", bg: "rgba(29,78,216,0.15)", label: "番人" },
  ISFJ: { primary: "#2563eb", bg: "rgba(37,99,235,0.15)", label: "番人" },
  ESTJ: { primary: "#1e40af", bg: "rgba(30,64,175,0.15)", label: "番人" },
  ESFJ: { primary: "#3b82f6", bg: "rgba(59,130,246,0.15)", label: "番人" },
  ISTP: { primary: "#92400e", bg: "rgba(146,64,14,0.15)", label: "探検家" },
  ISFP: { primary: "#d97706", bg: "rgba(217,119,6,0.15)", label: "探検家" },
  ESTP: { primary: "#b45309", bg: "rgba(180,83,9,0.15)", label: "探検家" },
  ESFP: { primary: "#f59e0b", bg: "rgba(245,158,11,0.15)", label: "探検家" },
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

  const revelCode = zodiac !== "なし" ? generateRevelaCode(mbti, love, zodiac, tarot) : null;
  const handleCopyCode = async () => {
    if (!revelCode) return;
    try {
      await navigator.clipboard.writeText(revelCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    } catch { /* silent */ }
  };

  const chips = [
    { label: "MBTI", value: mbti, sub: mbtiColor.label, color: mbtiColor.primary, bg: mbtiColor.bg },
    { label: "CODE", value: love, sub: loveInfo?.nickname ?? "", color: "#e8a0bf", bg: "rgba(232,160,191,0.12)" },
    { label: "星座", value: zodiac !== "なし" ? zodiac : "—", sub: zodiacData ? `${zodiacData.element}属性` : "", color: "#22d3ee", bg: "rgba(34,211,238,0.08)" },
    { label: "タロット", value: tarot, sub: reversed ? "逆位置" : "正位置", color: "#c084fc", bg: "rgba(192,132,252,0.08)" },
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-fade-in">
      {/* Back */}
      <Link href="/history" className="inline-flex items-center gap-1.5 text-xs mb-8 opacity-40 hover:opacity-70 transition-opacity" style={{ color: "rgba(255,255,255,0.6)" }}>
        ← 履歴に戻る
      </Link>

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
