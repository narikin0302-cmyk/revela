"use client";

import { useState } from "react";
import { zodiacSigns, type ZodiacSign } from "@/data/seiza";

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i <= stars ? "rgba(255,255,255,0.7)" : "none"}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          opacity={i <= stars ? 1 : 0.3}
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

function SignCard({
  sign,
  onSelect,
}: {
  sign: ZodiacSign;
  onSelect: (sign: ZodiacSign) => void;
}) {
  return (
    <button
      onClick={() => onSelect(sign)}
      className="card-glow rounded-2xl p-5 text-center group hover:scale-105 transition-transform duration-200 cursor-pointer w-full"
    >
      <div className="text-3xl mb-2 group-hover:animate-float inline-block">
        {sign.emoji}
      </div>
      <p className="text-sm font-medium mb-1" style={{ color: "rgba(255,255,255,0.8)" }}>
        {sign.name}
      </p>
      <p className="text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{sign.dates}</p>
    </button>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  overall: "rgba(255,255,255,0.7)",
  love: "#e8a0bf",
  work: "#60a5fa",
  money: "#34d399",
  health: "#f87171",
};

function FortuneDetail({ sign, onBack }: { sign: ZodiacSign; onBack: () => void }) {
  const categories = [
    { key: "overall" as const, label: "総合", color: CATEGORY_COLORS.overall },
    { key: "love" as const, label: "恋愛", color: CATEGORY_COLORS.love },
    { key: "work" as const, label: "仕事", color: CATEGORY_COLORS.work },
    { key: "money" as const, label: "金銭", color: CATEGORY_COLORS.money },
    { key: "health" as const, label: "健康", color: CATEGORY_COLORS.health },
  ];

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 mb-8 text-sm transition-opacity hover:opacity-100"
        style={{ color: "rgba(255,255,255,0.4)", opacity: 0.6 }}
      >
        ← 星座一覧に戻る
      </button>

      <div className="text-center mb-10">
        <div className="text-6xl mb-4 inline-block animate-float">{sign.emoji}</div>
        <h2
          className="text-3xl font-light mb-2"
          style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "#EDEDED" }}
        >
          {sign.name}
        </h2>
        <p className="text-xs tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>{sign.dates}</p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          {sign.element}のエレメント · {sign.planet}支配
        </p>
        <div className="divider-gold w-20 mx-auto mt-4" />
      </div>

      <div className="space-y-4 mb-8">
        {categories.map(({ key, label, color }) => {
          const cat = sign.fortune[key];
          return (
            <div key={key} className="card-glow rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium tracking-wider" style={{ color }}>
                  {label}
                </span>
                <StarRating stars={cat.stars} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>{cat.text}</p>
            </div>
          );
        })}
      </div>

      <div className="card-glow rounded-2xl p-6 mb-8">
        <h3 className="font-cinzel text-xs tracking-[0.3em] mb-5 text-center" style={{ color: "rgba(255,255,255,0.3)" }}>
          LUCKY ITEMS
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs mb-2 tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>ラッキーカラー</p>
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              {sign.fortune.luckyColor}
            </p>
          </div>
          <div>
            <p className="text-xs mb-2 tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>ラッキーアイテム</p>
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              {sign.fortune.luckyItem}
            </p>
          </div>
          <div>
            <p className="text-xs mb-2 tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>ラッキーナンバー</p>
            <p className="text-2xl font-light" style={{ color: "rgba(255,255,255,0.7)" }}>
              {sign.fortune.luckyNumber}
            </p>
          </div>
        </div>
      </div>

      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <p className="font-cinzel text-xs tracking-[0.3em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
          今週のメッセージ
        </p>
        <p
          className="text-base leading-relaxed font-light"
          style={{ fontFamily: "var(--font-noto-serif-jp), serif", color: "rgba(255,255,255,0.75)" }}
        >
          {sign.fortune.weeklyMessage}
        </p>
      </div>
    </div>
  );
}

export default function SeizaPage() {
  const [selectedSign, setSelectedSign] = useState<ZodiacSign | null>(null);

  return (
    <div className="relative min-h-screen px-4 py-12 max-w-4xl mx-auto">
      {!selectedSign ? (
        <>
          <div className="text-center mb-12">
            <p className="font-cinzel section-label mb-3">WEEKLY ANALYSIS</p>
            <h1
              className="text-3xl sm:text-4xl font-light mb-4"
              style={{ fontFamily: "var(--font-noto-serif-jp), serif" }}
            >
              星座
            </h1>
            <p className="text-sm max-w-sm mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
              あなたの星座を選んで、今週の傾向を確認してください。
            </p>
            <div className="divider-gold w-20 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {zodiacSigns.map((sign) => (
              <SignCard key={sign.name} sign={sign} onSelect={setSelectedSign} />
            ))}
          </div>
        </>
      ) : (
        <FortuneDetail sign={selectedSign} onBack={() => setSelectedSign(null)} />
      )}
    </div>
  );
}
