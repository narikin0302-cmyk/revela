"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getHistory, deleteHistoryEntry, type HistoryEntry } from "@/lib/storage";
import { generateRevelaCode } from "@/lib/revelaCodes";
import { loveTypeDescriptions } from "@/data/questions";
import type { LoveType } from "@/data/questions";
import { getRpgClassByCombo } from "@/data/rpgClasses";

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

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs tracking-wide"
      style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}
    >
      {label}
    </span>
  );
}

function ResultSummaryCard({ entry }: { entry: HistoryEntry }) {
  const mbtiColor = entry.mbti
    ? (MBTI_COLORS[entry.mbti] ?? { primary: "rgba(255,255,255,0.6)", bg: "rgba(255,255,255,0.08)", label: "" })
    : null;
  const loveInfo = entry.loveType ? loveTypeDescriptions[entry.loveType as LoveType] : null;
  const rpgChip = entry.mbti && entry.loveType ? getRpgClassByCombo(entry.mbti, entry.loveType) : null;

  const chips = [
    entry.mbti && mbtiColor
      ? { label: "現在地", value: entry.mbti, sub: mbtiColor.label, color: mbtiColor.primary, bg: mbtiColor.bg, span: false }
      : null,
    entry.loveType && loveInfo
      ? { label: "本音", value: loveInfo.nickname, sub: "", color: "#e8a0bf", bg: "rgba(232,160,191,0.12)", span: false }
      : null,
    rpgChip
      ? { label: "職業RPG", value: `${rpgChip.emoji} ${rpgChip.name}`, sub: rpgChip.tagline, color: "#7c3aed", bg: "rgba(124,58,237,0.08)", span: true }
      : null,
  ].filter(Boolean) as { label: string; value: string; sub: string; color: string; bg: string; span: boolean }[];

  if (chips.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-4 mb-4 animate-fade-in"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-xs tracking-widest mb-3 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
        ✦ 診断結果
      </p>
      <div className="grid grid-cols-2 gap-2">
        {chips.map((chip) => (
          <div
            key={chip.label}
            className="rounded-xl p-3 text-center"
            style={{
              background: chip.bg,
              border: `1px solid ${chip.color}33`,
              gridColumn: chip.span ? "1 / -1" : undefined,
            }}
          >
            <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em" }}>{chip.label}</p>
            <p className="text-sm font-bold" style={{ color: chip.color, lineHeight: 1.2 }}>{chip.value}</p>
            {chip.sub && <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>{chip.sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryCard({
  entry,
  onDelete,
}: {
  entry: HistoryEntry;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const rpgForCode = entry.mbti && entry.loveType ? getRpgClassByCombo(entry.mbti, entry.loveType) : null;
  const revelCode = rpgForCode && entry.mbti && entry.loveType ? generateRevelaCode(entry.mbti, entry.loveType, rpgForCode.name) : null;

  const handleCopyCode = async () => {
    if (!revelCode) return;
    try {
      await navigator.clipboard.writeText(revelCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2500);
    } catch { /* silent */ }
  };

  const resultUrl = entry.mbti && entry.loveType && entry.tarot
    ? `/result?mbti=${entry.mbti}&love=${entry.loveType}&zodiac=${encodeURIComponent(entry.zodiac ?? "なし")}&tarot=${encodeURIComponent(entry.tarot)}&reversed=${entry.isReversed ? "1" : "0"}`
    : null;

  return (
    <div className="card-glow rounded-2xl p-5 transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs mb-2 tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{entry.date}</p>
          {revelCode && (
            <button
              onClick={handleCopyCode}
              className="mb-3 font-bold tracking-widest transition-all"
              style={{
                fontFamily: "monospace",
                fontSize: "15px",
                color: codeCopied ? "#34d399" : "rgba(255,255,255,0.85)",
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                letterSpacing: "0.1em",
              }}
            >
              {codeCopied ? "✓ コピー済" : revelCode}
            </button>
          )}
          <div className="flex flex-wrap gap-2">
            {entry.mbti && <Chip label={entry.mbti} color="rgba(255,255,255,0.6)" />}
            {entry.loveType && <Chip label={entry.loveType} color="#e8a0bf" />}
            {entry.zodiac && <Chip label={entry.zodiac} color="#60a5fa" />}
            {entry.tarot && <Chip label={entry.tarot} color="#34d399" />}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs px-3 py-1.5 rounded-full transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {expanded ? "閉じる" : "結果を見る"}
          </button>
          <button
            onClick={() => onDelete(entry.id)}
            className="text-xs px-3 py-1.5 rounded-full transition-all hover:bg-red-900/30"
            style={{
              background: "rgba(248,113,113,0.06)",
              border: "1px solid rgba(248,113,113,0.2)",
              color: "#f87171",
            }}
          >
            削除
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 animate-fade-in">
          <ResultSummaryCard entry={entry} />
          {entry.description && (
            <div
              className="p-4 rounded-xl text-sm leading-relaxed"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderLeft: "2px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.6)",
              }}
              dangerouslySetInnerHTML={{ __html: entry.description }}
            />
          )}
          {resultUrl && (
            <Link
              href={resultUrl}
              className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs tracking-wider transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              全画面で見る →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(getHistory());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setEntries(getHistory());
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen px-4 py-12 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <p className="font-cinzel section-label mb-3">ANALYSIS HISTORY</p>
        <h1
          className="text-3xl sm:text-4xl font-light mb-4"
          style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
        >
          結果履歴
        </h1>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>過去の診断結果を振り返ることができます。</p>
        <div className="divider-gold w-20 mx-auto mt-4" />
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-6 opacity-20">◈</div>
          <p
            className="text-xl font-light mb-3"
            style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "rgba(255,255,255,0.4)" }}
          >
            まだ記録がありません
          </p>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.25)" }}>診断を受けると、ここに履歴が保存されます。</p>
          <Link
            href="/shindan"
            className="btn-outline-primary inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm"
          >
            分析をはじめる →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs mb-6 tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
            {entries.length}件の記録
          </p>
          <div className="space-y-4">
            {entries.map((entry) => (
              <HistoryCard key={entry.id} entry={entry} onDelete={handleDelete} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
