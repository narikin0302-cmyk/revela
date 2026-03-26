"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getHistory, deleteHistoryEntry, type HistoryEntry } from "@/lib/storage";

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-xs tracking-wide"
      style={{
        background: `${color}18`,
        border: `1px solid ${color}40`,
        color,
      }}
    >
      {label}
    </span>
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
  const router = useRouter();

  const handleRpgDiagnosis = () => {
    try {
      if (entry.mbti) {
        localStorage.setItem("revela_user", JSON.stringify({ mbti: entry.mbti }));
      }
      if (entry.loveType) {
        localStorage.setItem("revela_mycode", entry.loveType);
      }
    } catch { /* ignore */ }
    router.push("/chara?tab=rpg");
  };

  return (
    <div className="card-glow rounded-2xl p-5 transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs mb-2 tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{entry.date}</p>
          <div className="flex flex-wrap gap-2">
            {entry.mbti && <Chip label={entry.mbti} color="rgba(255,255,255,0.6)" />}
            {entry.loveType && <Chip label={entry.loveType} color="#e8a0bf" />}
            {entry.zodiac && <Chip label={entry.zodiac} color="#60a5fa" />}
            {entry.tarot && <Chip label={entry.tarot} color="#34d399" />}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {entry.mbti && (
            <button
              onClick={handleRpgDiagnosis}
              className="text-xs px-3 py-1.5 rounded-full transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              ⚔️ RPG診断
            </button>
          )}
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs px-3 py-1.5 rounded-full transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {expanded ? "閉じる" : "詳細"}
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

      {expanded && entry.description && (
        <div
          className="mt-4 p-4 rounded-xl text-sm leading-relaxed animate-fade-in"
          style={{
            background: "rgba(255,255,255,0.02)",
            borderLeft: "2px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.6)",
          }}
          dangerouslySetInnerHTML={{ __html: entry.description }}
        />
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
