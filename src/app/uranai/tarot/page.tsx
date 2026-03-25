"use client";

import { useState, useCallback, useMemo } from "react";
import { tarotCards, getThreeCardReading, type TarotCard } from "@/data/tarot";

// ── Daily tarot helpers ──────────────────────────────────────

function getDailyTarotSeed(dateStr: string): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getDailyCard(dateStr: string): { card: TarotCard; isReversed: boolean } {
  const seed = getDailyTarotSeed(dateStr);
  const idx = seed % tarotCards.length;
  const isReversed = (seed >> 8) % 3 === 0; // ~33% chance reversed
  return { card: tarotCards[idx], isReversed };
}

const POSITIONS = ["過去", "現在", "未来"] as const;
const POSITION_COLORS = ["rgba(232,160,191,0.8)", "rgba(255,255,255,0.8)", "rgba(96,165,250,0.8)"];

// SVG illustrations per card
function CardFaceIllustration({ card, isReversed }: { card: TarotCard; isReversed: boolean }) {
  const illustrations: Record<string, React.ReactNode> = {
    愚者: (
      <g>
        <circle cx="12" cy="8" r="4" fill="none" stroke={card.color} strokeWidth="1.2" />
        <path d="M12 12 L12 20 M8 16 L12 20 L16 16" fill="none" stroke={card.color} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx="19" cy="5" r="1.5" fill={card.color} opacity="0.7" />
        <path d="M17 7 L19 5 L21 7" fill="none" stroke={card.color} strokeWidth="1" />
      </g>
    ),
    女教皇: (
      <g>
        <rect x="9" y="4" width="6" height="9" rx="3" fill="none" stroke={card.color} strokeWidth="1.2" />
        <path d="M8 13 Q12 17 16 13" fill="none" stroke={card.color} strokeWidth="1.2" />
        <path d="M9 20 L15 20" stroke={card.color} strokeWidth="1.2" strokeLinecap="round" />
        <path d="M12 13 L12 20" stroke={card.color} strokeWidth="1" />
        <circle cx="12" cy="3" r="1.5" fill={card.color} opacity="0.8" />
      </g>
    ),
    太陽: (
      <g>
        <circle cx="12" cy="12" r="4.5" fill="none" stroke={card.color} strokeWidth="1.5" />
        <circle cx="12" cy="12" r="2" fill={card.color} opacity="0.6" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1={12 + 6 * Math.cos((angle * Math.PI) / 180)}
            y1={12 + 6 * Math.sin((angle * Math.PI) / 180)}
            x2={12 + 9 * Math.cos((angle * Math.PI) / 180)}
            y2={12 + 9 * Math.sin((angle * Math.PI) / 180)}
            stroke={card.color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        ))}
      </g>
    ),
    月: (
      <g>
        <path d="M17 12 A7 7 0 1 1 12 5 A5 5 0 1 0 17 12Z" fill="none" stroke={card.color} strokeWidth="1.2" />
        <circle cx="10" cy="10" r="1" fill={card.color} opacity="0.7" />
        <circle cx="14" cy="15" r="0.8" fill={card.color} opacity="0.5" />
        <circle cx="9" cy="15" r="0.6" fill={card.color} opacity="0.4" />
      </g>
    ),
    星: (
      <g>
        <polygon points="12,3 13.5,8.5 19,8.5 14.5,12 16,17.5 12,14 8,17.5 9.5,12 5,8.5 10.5,8.5" fill="none" stroke={card.color} strokeWidth="1.2" />
        <circle cx="12" cy="11" r="1.5" fill={card.color} opacity="0.7" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <circle key={a} cx={12 + 8 * Math.cos((a * Math.PI) / 180)} cy={11 + 8 * Math.sin((a * Math.PI) / 180)} r="0.7" fill={card.color} opacity="0.5" />
        ))}
      </g>
    ),
    世界: (
      <g>
        <ellipse cx="12" cy="12" rx="8" ry="10" fill="none" stroke={card.color} strokeWidth="1.2" />
        <ellipse cx="12" cy="12" rx="3" ry="10" fill="none" stroke={card.color} strokeWidth="0.8" opacity="0.5" />
        <path d="M4 12 L20 12" stroke={card.color} strokeWidth="0.8" opacity="0.5" />
        <circle cx="12" cy="12" r="2.5" fill={card.color} opacity="0.5" />
      </g>
    ),
    皇帝: (
      <g>
        <rect x="7" y="4" width="10" height="14" rx="1" fill="none" stroke={card.color} strokeWidth="1.2" />
        <path d="M7 8 L17 8" stroke={card.color} strokeWidth="1" opacity="0.5" />
        <path d="M9 12 L15 12" stroke={card.color} strokeWidth="1" opacity="0.5" />
        <path d="M10 4 L12 1 L14 4" fill={card.color} opacity="0.7" />
        <circle cx="12" cy="12" r="1.5" fill={card.color} opacity="0.6" />
      </g>
    ),
    恋人: (
      <g>
        <path d="M12 18 L7 13 C5 11 5 8 7 7 C9 6 11 7 12 9 C13 7 15 6 17 7 C19 8 19 11 17 13Z" fill="none" stroke={card.color} strokeWidth="1.2" />
        <circle cx="9" cy="6" r="2" fill="none" stroke={card.color} strokeWidth="1" opacity="0.6" />
        <circle cx="15" cy="6" r="2" fill="none" stroke={card.color} strokeWidth="1" opacity="0.6" />
        <path d="M10 20 L14 20" stroke={card.color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </g>
    ),
    力: (
      <g>
        <ellipse cx="10" cy="13" rx="6" ry="4" fill="none" stroke={card.color} strokeWidth="1.2" />
        <circle cx="14" cy="8" r="3" fill="none" stroke={card.color} strokeWidth="1.2" />
        <path d="M12 10 C12 10 13 11 13 13" stroke={card.color} strokeWidth="1" />
        <path d="M6 12 L4 15 M14 12 L16 15" stroke={card.color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        <circle cx="14" cy="8" r="1" fill={card.color} opacity="0.6" />
      </g>
    ),
    審判: (
      <g>
        <path d="M12 3 L12 10 M8 8 L16 8" stroke={card.color} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="3" r="1.5" fill={card.color} opacity="0.7" />
        <path d="M6 14 L10 10 L14 14" fill="none" stroke={card.color} strokeWidth="1.2" />
        <path d="M10 14 L14 10 L18 14" fill="none" stroke={card.color} strokeWidth="1.2" />
        <path d="M4 18 L20 18" stroke={card.color} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <path d="M8 14 L8 18 M12 14 L12 18 L16 18 L16 14" stroke={card.color} strokeWidth="1" opacity="0.5" />
      </g>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width="60"
      height="60"
      xmlns="http://www.w3.org/2000/svg"
      style={isReversed ? { transform: "rotate(180deg)" } : undefined}
    >
      {illustrations[card.name] ?? (
        <circle cx="12" cy="12" r="8" fill="none" stroke={card.color} strokeWidth="1.2" />
      )}
    </svg>
  );
}

// Mandala SVG for card back
function CardBackSVG() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.15)" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
        <g key={angle} transform={`rotate(${angle}, 50, 50)`}>
          <line x1="50" y1="15" x2="50" y2="25" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" />
          <line x1="50" y1="35" x2="50" y2="45" stroke="rgba(255,255,255,0.15)" strokeWidth="0.6" />
          <circle cx="50" cy="15" r="1.2" fill="rgba(255,255,255,0.25)" />
        </g>
      ))}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1={50 + 25 * Math.cos((angle * Math.PI) / 180)}
          y1={50 + 25 * Math.sin((angle * Math.PI) / 180)}
          x2={50 + 35 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 35 * Math.sin((angle * Math.PI) / 180)}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}

type SelectionState = { card: TarotCard; position: number; isReversed: boolean }[];

export default function TarotPage() {
  const [selections, setSelections] = useState<SelectionState>([]);
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [isRevealing, setIsRevealing] = useState<number | null>(null);

  const shuffled = useState(() => [...tarotCards].sort(() => Math.random() - 0.5))[0];

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }, []);

  const dailyDisplay = useMemo(() => {
    const d = new Date();
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  }, []);

  const { card: dailyCard, isReversed: dailyReversed } = useMemo(() => getDailyCard(today), [today]);

  const selectedIds = new Set(selections.map((s) => s.card.id));
  const currentPosition = selections.length; // 0, 1, 2
  const isDone = selections.length === 3;

  const handleCardClick = useCallback(
    (card: TarotCard, index: number) => {
      if (isDone) return;
      if (selectedIds.has(card.id)) return;
      if (isRevealing !== null) return;

      const reversed = Math.random() < 0.3;

      setIsRevealing(index);
      setTimeout(() => {
        setFlipped((prev) => new Set([...prev, index]));
        setTimeout(() => {
          setSelections((prev) => [...prev, { card, position: currentPosition, isReversed: reversed }]);
          setIsRevealing(null);
        }, 400);
      }, 50);
    },
    [isDone, selectedIds, isRevealing, currentPosition]
  );

  const reset = () => {
    setSelections([]);
    setFlipped(new Set());
    setIsRevealing(null);
  };

  const combined = isDone
    ? getThreeCardReading(
        selections[0].card,
        selections[1].card,
        selections[2].card,
        selections[0].isReversed,
        selections[1].isReversed,
        selections[2].isReversed
      )
    : null;

  return (
    <div className="relative min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <p className="font-cinzel section-label mb-3">THREE CARD SPREAD</p>
        <h1
          className="text-3xl sm:text-4xl font-light mb-4"
          style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
        >
          タロット診断
        </h1>
        <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
          {isDone
            ? "3枚のカードが揃いました。"
            : `${POSITIONS[currentPosition]}のカードを1枚選んでください。`}
        </p>
        <div className="divider-gold w-20 mx-auto mt-4" />
      </div>

      {/* ── Daily Tarot Card ── */}
      <div
        className="mb-10 rounded-2xl p-6 animate-fade-in"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p className="font-cinzel text-xs tracking-[0.3em] mb-4 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
          TODAY&apos;S CARD — {dailyDisplay}
        </p>
        <div className="flex items-center gap-5">
          {/* Card visual */}
          <div
            className="flex-shrink-0"
            style={{
              width: "72px",
              height: "115px",
            }}
          >
            <svg
              viewBox="0 0 140 220"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: "100%",
                height: "100%",
                transform: dailyReversed ? "rotate(180deg)" : "none",
              }}
            >
              <rect width="140" height="220" rx="10" fill="#111" />
              <rect x="4" y="4" width="132" height="212" rx="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" opacity="0.8" />
              <circle cx="70" cy="105" r="38" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8" opacity="0.6" />
              <circle cx="70" cy="105" r="24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" opacity="0.5" />
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1="70" y1="105"
                    x2={70 + 20 * Math.sin(angle)}
                    y2={105 - 20 * Math.cos(angle)}
                    stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" opacity="0.7"
                  />
                );
              })}
              <circle cx="70" cy="105" r="5" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" opacity="0.9" />
              <circle cx="70" cy="105" r="2" fill="rgba(255,255,255,0.6)" opacity="0.9" />
              <text x="70" y="198" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10" fontFamily="serif" letterSpacing="2" opacity="0.9">
                {dailyCard.name}
              </text>
            </svg>
          </div>

          {/* Card info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-base font-medium" style={{ color: dailyCard.color }}>
                {dailyCard.name}
              </span>
              {dailyReversed && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-bold"
                  style={{ background: "rgba(220,60,60,0.2)", border: "1px solid rgba(220,60,60,0.5)", color: "#ff8080" }}
                >
                  逆位置
                </span>
              )}
            </div>
            <p className="text-xs opacity-50 mb-2 italic">
              {dailyCard.nameEn} · {dailyReversed ? dailyCard.reversedMeaning : dailyCard.keywords}
            </p>
            <p className="text-xs leading-relaxed opacity-75">
              {dailyReversed ? dailyCard.reversedDescription : dailyCard.upright}
            </p>
          </div>
        </div>
      </div>

      {/* Divider before 3-card spread */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1))" }} />
        <p className="font-cinzel text-xs tracking-[0.3em]" style={{ color: "rgba(255,255,255,0.25)" }}>THREE CARD SPREAD</p>
        <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }} />
      </div>

      {/* Position indicator */}
      {!isDone && (
        <div className="flex justify-center gap-6 mb-8">
          {POSITIONS.map((pos, i) => (
            <div key={pos} className="text-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 text-xs font-bold transition-all duration-300"
                style={{
                  background:
                    i < selections.length
                      ? "rgba(255,255,255,0.15)"
                      : i === currentPosition
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    i === currentPosition
                      ? "2px solid rgba(255,255,255,0.4)"
                      : "1px solid rgba(255,255,255,0.1)",
                  color: i < selections.length ? "#EDEDED" : "rgba(255,255,255,0.5)",
                }}
              >
                {i < selections.length ? "✓" : i + 1}
              </div>
              <p
                className="text-xs tracking-wider"
                style={{ color: "#EDEDED", opacity: i === currentPosition ? 0.8 : 0.25 }}
              >
                {pos}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Card fan */}
      {!isDone && (
        <div className="relative mb-12">
          <p className="text-center text-xs opacity-40 mb-6 tracking-widest">カードを選んでください</p>
          <div className="flex flex-wrap justify-center gap-3">
            {shuffled.map((card, i) => {
              const isSelected = selectedIds.has(card.id);
              const isFlippedCard = flipped.has(i);
              const isRevealingThis = isRevealing === i;

              return (
                <div
                  key={card.id}
                  className="relative cursor-pointer"
                  style={{
                    width: "64px",
                    height: "96px",
                    perspective: "600px",
                    opacity: isSelected ? 0.3 : 1,
                    pointerEvents: isSelected || isDone ? "none" : "auto",
                    transition: "opacity 0.3s ease",
                  }}
                  onClick={() => handleCardClick(card, i)}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.6s ease",
                      transform: isFlippedCard ? "rotateY(180deg)" : "rotateY(0deg)",
                    }}
                  >
                    {/* Card back */}
                    <div
                      className="absolute inset-0 rounded-xl flex items-center justify-center"
                      style={{
                        backfaceVisibility: "hidden",
                        background: "linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)",
                        border: isRevealingThis
                          ? "2px solid rgba(255,255,255,0.5)"
                          : "1px solid rgba(255,255,255,0.12)",
                        boxShadow: isRevealingThis
                          ? "0 0 20px rgba(255,255,255,0.15)"
                          : "0 4px 15px rgba(0,0,0,0.3)",
                      }}
                    >
                      <CardBackSVG />
                    </div>

                    {/* Card front */}
                    <div
                      className="absolute inset-0 rounded-xl flex flex-col items-center justify-center p-2"
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        background: `linear-gradient(135deg, ${card.color}22 0%, rgba(10,10,10,0.95) 100%)`,
                        border: `1px solid ${card.color}66`,
                      }}
                    >
                      <CardFaceIllustration card={card} isReversed={false} />
                      <p className="text-xs text-center leading-tight mt-1" style={{ color: card.color, fontSize: "9px" }}>
                        {card.name}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected cards summary */}
      {selections.length > 0 && (
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {selections.map((sel, i) => (
              <div key={i} className="text-center">
                <p
                  className="text-xs tracking-widest mb-2 font-medium"
                  style={{ color: POSITION_COLORS[i] }}
                >
                  {POSITIONS[i]}
                </p>
                <div
                  className="rounded-xl p-3 mx-auto relative"
                  style={{
                    background: `linear-gradient(135deg, ${sel.card.color}22, rgba(13,11,43,0.9))`,
                    border: sel.isReversed
                      ? "1px solid rgba(239,68,68,0.6)"
                      : `1px solid ${sel.card.color}55`,
                    maxWidth: "90px",
                  }}
                >
                  {sel.isReversed && (
                    <div
                      className="absolute top-1 right-1 text-center rounded px-1"
                      style={{
                        background: "rgba(239,68,68,0.85)",
                        fontSize: "7px",
                        color: "#fff",
                        lineHeight: "14px",
                        letterSpacing: "0.03em",
                      }}
                    >
                      逆位置
                    </div>
                  )}
                  <CardFaceIllustration card={sel.card} isReversed={sel.isReversed} />
                  <p className="text-xs mt-2 font-medium" style={{ color: sel.card.color }}>
                    {sel.card.name}
                  </p>
                </div>
              </div>
            ))}
            {/* Empty placeholders */}
            {Array.from({ length: 3 - selections.length }).map((_, i) => (
              <div key={`empty-${i}`} className="text-center">
                <p className="text-xs tracking-widest mb-2 opacity-30" style={{ color: POSITION_COLORS[selections.length + i] }}>
                  {POSITIONS[selections.length + i]}
                </p>
                <div
                  className="rounded-xl p-3 mx-auto"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px dashed rgba(255,255,255,0.1)",
                    maxWidth: "90px",
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span className="text-xs opacity-30">?</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full results */}
      {isDone && combined && (
        <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
          <div className="divider-gold w-full" />

          {/* Individual card meanings */}
          {selections.map((sel, i) => (
            <div key={i} className="card-glow rounded-2xl p-6 animate-line-reveal" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{
                    background: `${sel.card.color}33`,
                    border: sel.isReversed ? "1px solid rgba(239,68,68,0.6)" : `1px solid ${sel.card.color}66`,
                    color: sel.card.color,
                  }}
                >
                  {POSITIONS[i]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-base font-medium" style={{ color: sel.card.color }}>
                      {sel.card.name}
                    </p>
                    {sel.isReversed && (
                      <span
                        className="text-xs rounded px-1.5 py-0.5"
                        style={{
                          background: "rgba(239,68,68,0.2)",
                          border: "1px solid rgba(239,68,68,0.5)",
                          color: "#f87171",
                        }}
                      >
                        逆位置
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-50">
                    {sel.card.nameEn} · {sel.isReversed ? sel.card.reversedMeaning : sel.card.keywords}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed opacity-75">
                {sel.isReversed
                  ? sel.card.reversedDescription
                  : i === 0
                  ? sel.card.past
                  : i === 1
                  ? sel.card.present
                  : sel.card.future}
              </p>
            </div>
          ))}

          {/* Combined reading */}
          <div
            className="rounded-2xl p-6 animate-line-reveal"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              animationDelay: "0.5s",
            }}
          >
            <p className="font-cinzel text-xs tracking-[0.3em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              COMBINED READING
            </p>
            <h3
              className="text-lg font-light mb-4"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              {combined.title}
            </h3>
            <p className="text-sm leading-relaxed opacity-75">{combined.text}</p>
          </div>

          {/* Reset button */}
          <div className="text-center pt-4">
            <button
              onClick={reset}
              className="btn-outline-gold px-8 py-3 rounded-full text-sm tracking-widest"
            >
              もう一度引く
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
